// Suavizar a rolagem para âncoras
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth"
        });
    });
});

// Animações de exibição ao rolar a página
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        entry.target.classList.toggle("visible", entry.isIntersecting);
    });
});
document.querySelectorAll(".imagem").forEach(section => observer.observe(section));

// Resposta visual para botões de redes sociais
document.querySelectorAll(".social-icons a").forEach(icon => {
    icon.addEventListener("mouseover", () => icon.classList.add("hover"));
    icon.addEventListener("mouseleave", () => icon.classList.remove("hover"));
});

// Validação do telefone em tempo real
const telefoneInput = document.getElementById("telefone");
const telefoneFeedback = document.getElementById("telefoneFeedback");

telefoneInput.addEventListener("input", () => {
    const telPattern = /^\(\d{2}\) \d{5}-\d{4}$/;
    telefoneFeedback.textContent = telPattern.test(telefoneInput.value)
        ? ""
        : "Por favor, use o formato (XX) XXXXX-XXXX.";
    telefoneFeedback.classList.toggle('valid', telPattern.test(telefoneInput.value));
});

// Salvar dados do formulário no armazenamento local
const pedidoForm = document.getElementById("pedidoForm");
pedidoForm.addEventListener("input", () => {
    localStorage.setItem("nome", document.getElementById("nome").value);
    localStorage.setItem("telefone", telefoneInput.value);
});

// Recuperar dados salvos do armazenamento local ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("nome").value = localStorage.getItem("nome") || '';
    telefoneInput.value = localStorage.getItem("telefone") || '';
});

// Lógica de envio do formulário com uso do fetch e async/await
pedidoForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Coleta de dados do formulário
    const nome = document.getElementById("nome").value;
    const produto = document.getElementById("produto").value;
    const telefone = telefoneInput.value;
    const mensagem = document.getElementById("mensagem").value;
    const feedback = document.getElementById("pedidoFeedback");

    try {
        // Envio dos dados para o back-end
        const response = await fetch('/api/pedido', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, produto, telefone, mensagem })
        });

        const result = await response.json();

        // Feedback ao usuário
        if (response.ok) {
            feedback.textContent = result.message;
            pedidoForm.reset();
            localStorage.removeItem("nome");
            localStorage.removeItem("telefone");
        } else {
            feedback.textContent = "Erro ao enviar pedido: " + result.error;
        }
    } catch (error) {
        console.error("Erro ao enviar pedido:", error);
        feedback.textContent = "Erro ao enviar pedido. Não é possivel enviar seu pedido.";
    }
});