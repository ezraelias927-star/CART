// static/js/components/navbar.js

export function initNavbar() {
    // 1. Dropdown toggle (kategoria/bidhaa)
    document.querySelectorAll('.nav-item[data-dropdown]').forEach(function(item){
        var btn = item.querySelector('.nav-link');
        btn.addEventListener('click', function(e){
            e.stopPropagation();
            var wasOpen = item.classList.contains('open');
            document.querySelectorAll('.nav-item.open').forEach(function(i){ 
                i.classList.remove('open'); 
            });
            if(!wasOpen){ 
                item.classList.add('open'); 
            }
        });
    });

    document.addEventListener('click', function(){
        document.querySelectorAll('.nav-item.open').forEach(function(i){ 
            i.classList.remove('open'); 
        });
    });

    // 2. Hamburger (mobile) toggle
    var hamburgerBtn = document.getElementById('hamburgerBtn');
    var navLinks = document.getElementById('navLinks');
    
    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', function(e){
            e.stopPropagation();
            navLinks.classList.toggle('mobile-open');
        });
    }
}