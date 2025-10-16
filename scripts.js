/**
 Lógica que deve rodar em TODAS as páginas.
 */
function initGlobalScripts() {
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('#main-nav');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const isExpanded = navMenu.classList.contains('open');
            hamburger.setAttribute('aria-expanded', isExpanded);
        });

        document.querySelectorAll('#main-nav a').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                // Fecha o menu imediatamente
                navMenu.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');

                const href = this.getAttribute('href');
                // Verifica se é um link para uma âncora na mesma página (ex: "#pedidos")
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetElement = document.querySelector(href);
                    if (targetElement) {
                        // Atraso para dar tempo da animação de fechar o menu acontecer
                        setTimeout(() => {
                            targetElement.scrollIntoView({ behavior: 'smooth' });
                        }, 300);
                    }
                }
                // Para links de outras páginas (ex: "produtos.html" ou "index.html#pedidos"),
                // o navegador seguirá o link normalmente.
            });
        });
    }
}

/**
 * Lógica que deve rodar APENAS na página de produtos.
 */
function initProdutosPageScripts() {
    document.querySelectorAll('.btn-pedir').forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.card-produto');
            const id = card.dataset.id;
            const name = card.dataset.name;
            const price = parseFloat(card.dataset.price);
            
            addToCart({ id, name, price });
            
            // Feedback visual
            e.target.textContent = 'Adicionado!';
            setTimeout(() => {
                e.target.textContent = 'Adicionar ao Carrinho';
            }, 1500);
        });
    });
}

/**
 * Lógica que deve rodar APENAS na página de pedidos (carrinho).
 */
function initPedidosPageScripts() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;

    displayCart();

    const pedidoForm = document.getElementById('pedidoForm');
    pedidoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('nome').value;
        const telefone = document.getElementById('telefone').value;
        const cart = getCart();

        if (cart.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }

        let message = `Olá! Gostaria de fazer um pedido:\n\n*Cliente:* ${nome}\n*Telefone:* ${telefone}\n\n*Itens do Pedido:*\n`;
        let total = 0;
        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            message += `- ${item.quantity}x ${item.name} (R$ ${subtotal.toFixed(2)})\n`;
            total += subtotal;
        });
        message += `\n*Total:* R$ ${total.toFixed(2)}`;

        const whatsappUrl = `https://wa.me/5511984139820?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });
}

// --- Funções do Carrinho ---

function getCart() {
    return JSON.parse(localStorage.getItem('shoppingCart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

function addToCart(product) {
    const cart = getCart();
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart(cart);
}

function displayCart() {
    const cart = getCart();
    const container = document.getElementById('cart-items');
    const summaryContainer = document.getElementById('cart-summary');
    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart-message">Seu carrinho está vazio. Adicione produtos na nossa loja!</p>';
        summaryContainer.innerHTML = '';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        container.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>R$ ${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <span>${item.quantity}</span>
                </div>
                <p>R$ ${subtotal.toFixed(2)}</p>
            </div>
        `;
    });
    summaryContainer.innerHTML = `<strong>Total: R$ ${total.toFixed(2)}</strong>`;
}

// Executa os scripts quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
    initGlobalScripts();
    initProdutosPageScripts();
    initPedidosPageScripts();
});