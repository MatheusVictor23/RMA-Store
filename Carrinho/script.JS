const carrinho = {
    atualizarResumo: () => {
        const itens = document.querySelectorAll(".itensCarrinho");
        let total = 0;

        itens.forEach(item => {
            const precoTexto = item.querySelector(".precoProduto").innerText;
            const preco = parseFloat(precoTexto.replace("R$", "").replace(",", "."));
            total += preco;
        });

        document.querySelector("#total").innerText = `R$ ${total.toFixed(2)}`;
        document.querySelector(".resumoLinha.total span:last-child").innerText = `R$ ${total.toFixed(2)}`;
    },

    configurarRemover: () => {
        const botoesRemover = document.querySelectorAll(".removerItem");

        botoesRemover.forEach(btn => {
            btn.addEventListener("click", () => {
                const item = btn.closest(".itensCarrinho");
                item.remove();

                carrinho.atualizarResumo();
                carrinho.verificarCarrinhoVazio();
            });
        });
    },

    verificarCarrinhoVazio: () => {
        const container = document.querySelector(".colunaItens");
        const itensRestantes = container.querySelectorAll(".itensCarrinho");

        const mensagemExistente = container.querySelector(".mensagemCarrinhoVazio");
        if (mensagemExistente) mensagemExistente.remove();

        if (itensRestantes.length === 0) {
            const mensagem = document.createElement("div");
            mensagem.className = "mensagemCarrinhoVazio";
            mensagem.innerHTML = "<p>Seu carrinho está vazio!</p>";
            container.insertBefore(mensagem, document.querySelector(".continuarComprandoBtn"));
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    carrinho.atualizarResumo();
    carrinho.configurarRemover();
    carrinho.verificarCarrinhoVazio();
});
