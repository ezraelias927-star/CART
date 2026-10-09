
const WHATSAPP_NUMBER = "255790802484"; 

/**
 * Function ya kufungua WhatsApp kwa Ujumbe wowote
 */
function openWhatsApp(customText = "Habari! Nataka kuulizia kuhusu huduma zenu.") {
    const encodedText = encodeURIComponent(customText);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
}

/**
 * Inasuka Widget ya WhatsApp kikamilifu na kuiweka kwenye DOM
 */
function initWhatsAppWidget() {
    if (document.querySelector('.whatsapp-widget-container')) return;

    // 1. Kutengeneza Container Element
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'whatsapp-widget-container';

    // 2. HTML ya Widget (Tooltip + Button + Online Badge + SVG Icon)
    widgetContainer.innerHTML = `
        <div class="whatsapp-tooltip">👋 Unahitaji msaada? Ongea nasi</div>
        <a href="#" class="whatsapp-float-btn" id="waFloatBtn" aria-label="Chat on WhatsApp">
            <span class="whatsapp-online-badge"></span>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 2c-5.517 0-9.993 4.476-9.993 9.993 0 1.763.459 3.483 1.332 5.003L2 22l5.143-1.348c1.472.803 3.136 1.229 4.888 1.229 5.517 0 9.993-4.476 9.993-9.993S17.548 2 12.031 2zm0 18.257c-1.554 0-3.078-.418-4.413-1.21l-.316-.188-3.275.858.873-3.193-.206-.328c-.871-1.385-1.332-2.986-1.332-4.634 0-4.708 3.83-8.538 8.538-8.538s8.538 3.83 8.538 8.538-3.83 8.538-8.538 8.538z"/>
                <path d="M16.88 14.288c-.281-.141-1.662-.82-1.92-.913-.258-.095-.446-.141-.634.141s-.728.913-.892 1.101c-.164.188-.328.211-.609.07-.281-.141-1.189-.438-2.264-1.397-.837-.746-1.402-1.668-1.566-1.95-.164-.281-.018-.433.123-.573.127-.126.281-.328.422-.492.141-.164.188-.281.281-.469.094-.188.047-.352-.023-.492s-.634-1.528-.868-2.091c-.228-.549-.46-.474-.634-.483l-.54-.009c-.188 0-.492.07-.75.352s-.985.962-.985 2.348.101 2.721 1.148 4.128c1.047 1.407 2.502 2.149 3.751 2.571 1.189.401 1.704.321 2.222.244.578-.086 1.662-.68 1.897-1.337.235-.657.235-1.219.164-1.337-.07-.118-.258-.188-.539-.329z"/>
            </svg>
        </a>
    `;

    document.body.appendChild(widgetContainer);

    // 3. Click Event Handler
    document.getElementById('waFloatBtn').addEventListener('click', (e) => {
        e.preventDefault();
        openWhatsApp("Habari! Nipo kwenye mtandao wenu naomba msaada wa kuelekezwa.");
    });
}

// Anzisha widget ukurasa ukimaliza kupakia
document.addEventListener('DOMContentLoaded', initWhatsAppWidget);