import os
from flask import Flask, render_template, request, redirect, url_for,jsonify
from werkzeug.utils import secure_filename
from config import Config
from database import db, User,Category,Product,Order,OrderItem
from werkzeug.security import generate_password_hash, check_password_hash
from flask import session

# Usanidi wa folda la kuhifadhi picha (hakikisha ipo kwenye app config yako)
UPLOAD_FOLDER = 'static/uploads/products'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)


#ADMIN ROUTES KWA AJILI YA KUFANYA ACTION

#kuongeza category
@app.route('/admin/category/add', methods=['POST'])
def add_category():
    data = request.get_json()
    new_cat = Category(name=data['name'])
    db.session.add(new_cat)
    db.session.commit()
    return jsonify({'message': 'Category imeongezwa!', 'id': new_cat.id}), 201


#KUONGEZA BIDHAA
@app.route('/admin/product/add', methods=['POST'])
def add_product():
    # 1. Kupokea data za maandishi kutoka request.form (sio get_json!)
    name = request.form.get('name')
    price = request.form.get('price')
    category_id = request.form.get('category_id')
    stock_quantity = request.form.get('stock_quantity', 0)

    # 2. Uhakiki wa msingi (Validation)
    if not name or price is None or not category_id:
        return jsonify({'status': 'error', 'message': 'Jina, Bei, na Kategoria vinatakiwa!'}), 400

    # 3. Kagua kama Kategoria ipo kwenye DB
    category = Category.query.get(category_id)
    if not category:
        return jsonify({'status': 'error', 'message': 'Kategoria uliyochagua haipo!'}), 404

    # 4. Kushughulikia Picha kutoka request.files
    image_url = 'default-product.png' # Picha ya akiba kama hajaupload
    
    if 'image' in request.files:
        file = request.files['image']
        
        # Kama mtumiaji amechagua faili na lina jina
        if file and file.filename != '' and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            
            # Hakikisha folda lipo kabla ya kusihihifadhi
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            
            # Hifadhi faili kwenye server
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)
            
            # Weka path itakayohifadhiwa kwenye database
            image_url = f"/static/uploads/products/{filename}"

    # 5. Kuingiza Data kwenye Database
    try:
        new_product = Product(
            name=name.strip(),
            price=float(price),
            category_id=int(category_id),
            stock_quantity=int(stock_quantity),
            image_url=image_url
        )
        
        db.session.add(new_product)
        db.session.commit()

        return jsonify({
            'status': 'success',
            'message': f'Bidhaa "{new_product.name}" imehifadhiwa kikamilifu!',
            'product_id': new_product.id
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'status': 'error', 
            'message': f'Imeshindwa kuhifadhi bidhaa: {str(e)}'
        }), 500

# UPDATE: Inabadilisha jina la category kwa kutumia ID
@app.route('/admin/category/update/<int:id>', methods=['PUT'])
def update_category(id):
    cat = Category.query.get_or_404(id)
    cat.name = request.get_json()['name']
    db.session.commit()
    return jsonify({'message': 'Category imeboreshwa!'})

# DELETE: Inaondoa category kwenye database kwa kutumia ID
@app.route('/admin/category/delete/<int:id>', methods=['DELETE'])
def delete_category(id):
    cat = Category.query.get(id)
    if not cat:
        return jsonify({'error': 'Category haipo'}), 404
    
    # Angalia kama ina products zimefungamana nayo
    if cat.products:
        return jsonify({'error': 'Huwezi kufuta category hii kwa sababu ina bidhaa zilizosajiliwa nayo!'}), 400

    db.session.delete(cat)
    db.session.commit()
    return jsonify({'message': 'Category imefutwa!'})

#UPDATE: update bidhaa kwenye database
@app.route('/admin/product/update/<int:id>', methods=['PUT'])
def update_product(id):
    p = Product.query.get(id)
    if not p: return jsonify({'error': 'Product haipo'}), 404
    d = request.get_json()
    for key, val in d.items(): setattr(p, key, val)
    db.session.commit()
    return jsonify({'message': 'Product imeboreshwa!'})


#DELETE: ondoa product
@app.route('/admin/product/delete/<int:id>', methods=['DELETE'])
def delete_product(id):
    p = Product.query.get(id)
    if not p: return jsonify({'error': 'Product haipo'}), 404
    db.session.delete(p)
    db.session.commit()
    return jsonify({'message': 'Product imefutwa!'})

#DISPLAY: onesha recent orders
@app.route('/admin/dashboard/recent-orders', methods=['GET'])
def get_recent_orders():
    recent = Order.query.order_by(Order.id.desc()).limit(5).all()
    return jsonify([{
        'id': o.id,
        'customer_name': o.customer_name,
        'total_price': o.total_price,
        'status': o.status,
        'created_at': o.created_at.strftime('%Y-%m-%d %H:%M')
    } for o in recent])

# === Ongeza hizi API mbili kwenye app.py yako (karibu na add_category/add_product) ===
# Hizi zinarudisha DATA (JSON) tu, hakuna HTML - ndizo fetch() itakazoziita.

@app.route('/admin/api/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([{'id': c.id, 'name': c.name} for c in categories])

@app.route('/admin/api/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'price': p.price,
        'stock_quantity': p.stock_quantity,
        'image_url': p.image_url,
        'category_id': p.category_id,
        'category_name': p.category.name if p.category else '-'
    } for p in products])


# === Ongeza routes hizi kwenye app.py yako, sehemu ya PAGES (kuonyesha HTML) ===
# Hizi ni tofauti na routes za API ulizoshaziandika (add_category, add_product, n.k.)
# Hizi hurudisha ukurasa (template), API zako zinabaki kupokea/kuhifadhi data.

@app.route('/admin/category', methods=['GET'])
def category_page():
    return render_template('admincategory.html')

@app.route('/admin/bidhaa', methods=['GET'])
def bidhaa_page():
    categories = Category.query.all()
    return render_template('adminbidhaa.html',categories=categories)

@app.route('/bidhaa/update', methods=['GET'])
def bidhaa_update():
    return render_template('bidhaaupdate.html')

@app.route('/category/update', methods=['GET'])
def category_update():
    return render_template('categoryupdate.html')

@app.route('/admin/categories', methods=['GET'])
def category_list_page():
    categories = Category.query.all()
    return render_template('category_list.html', categories=categories)

@app.route('/admin/product', methods=['GET'])
def product_page():
    categories = Category.query.all()   # inahitajika kujaza <select> ya kategoria
    return render_template('product_add.html', categories=categories)

@app.route('/admin/products', methods=['GET'])
def product_list_page():
    products = Product.query.all()
    return render_template('product_list.html', products=products)



#USERS PAGE
#USERS PAGE
#USERS PAGE

@app.route('/')
def home():
    return render_template('home.html')

# Wateja wa kawaida (home.html) hawapaswi kutumia /admin/api/products.

@app.route('/api/products', methods=['GET'])
def get_public_products():
    products = Product.query.all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'price': p.price,
        'image_url': p.image_url,
        'category_id': p.category_id
    } for p in products])


# === Ongeza hii kwenye app.py yako (route ya umma, si ya /admin) ===

@app.route('/api/searchproducts', methods=['GET'])
def search_public_products():
    # ?search=term - ikiwa haipo, tunarudisha bidhaa zote
    search_term = request.args.get('search', '').strip()

    query = Product.query
    if search_term:
        query = query.join(Category, isouter=True).filter(
            db.or_(
                Product.name.ilike(f'%{search_term}%'),
                Category.name.ilike(f'%{search_term}%')
            )
        )

    products = query.all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'price': p.price,
        'image_url': p.image_url,
        'category_id': p.category_id,
        'category_name': p.category.name if p.category else ''
    } for p in products])


# === Ongeza hizi kwenye app.py yako ===
# Zinahitaji: from flask import session (ongeza kwenye import ya flask iliyopo juu)
#             from werkzeug.security import generate_password_hash, check_password_hash
#
# MUHIMU: Flask session inahitaji SECRET_KEY. Hakikisha config.py yako (Config class)
# ina: SECRET_KEY = 'weka-neno-la-siri-refu-hapa'




# ---------- UKURASA (HTML) ----------
@app.route('/auth', methods=['GET'])
def auth_page():
    return render_template('auth.html')


# ---------- REGISTER (kusajili mtumiaji mpya) ----------
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    username = data.get('username', '').strip()
    email = data.get('email', '').strip()
    password = data.get('password', '')

    # Guard clause: taarifa zote zinahitajika
    if not username or not email or not password:
        return jsonify({'message': 'Tafadhali jaza username, email na password.'}), 400

    # Guard clause: username au email isiwe imeshatumika
    existing_user = User.query.filter(
        (User.username == username) | (User.email == email)
    ).first()
    if existing_user:
        return jsonify({'message': 'Username au email hii tayari imesajiliwa.'}), 409

    new_user = User(
        username=username,
        email=email,
        password_hash=generate_password_hash(password)
    )
    db.session.add(new_user)
    db.session.commit()

    # Mweke mtumiaji "ameingia" moja kwa moja baada ya kujisajili
    session['user_id'] = new_user.id
    session['username'] = new_user.username
    session['role'] = new_user.role

    return jsonify({'message': 'Usajili umefanikiwa!', 'username': new_user.username}), 201


# ---------- LOGIN (kuingia) ----------
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    username = data.get('username', '').strip()
    password = data.get('password', '')

    # Guard clause: taarifa zote zinahitajika
    if not username or not password:
        return jsonify({'message': 'Tafadhali jaza username na password.'}), 400

    user = User.query.filter_by(username=username).first()

    # Guard clause: username haipo AU password si sahihi
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'message': 'Username au password si sahihi.'}), 401

    session['user_id'] = user.id
    session['username'] = user.username
    session['role'] = user.role

    return jsonify({'message': 'Umeingia kikamilifu!', 'username': user.username}), 200


# ---------- LOGOUT (kutoka) ----------
@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Umetoka kikamilifu!'}), 200


with app.app_context():
    db.create_all()

if __name__=='__main__':
    app.run(debug=True)