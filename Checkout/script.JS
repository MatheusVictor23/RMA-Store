const checkout = {
    configurarFormulario: () => {
        const formPagamento = document.querySelector('.formPagamento');
        const camposCartao = formPagamento.querySelectorAll('input');

        const metodoPagamento = formPagamento.querySelector('select');
        metodoPagamento.addEventListener('change', () => {
            if (metodoPagamento.value === 'cartao') {
                camposCartao.forEach(campo => campo.disabled = false);
            } else {
                camposCartao.forEach(campo => {
                    campo.disabled = true;
                    campo.value = '';
                });
            }
        });
    },

    configurarBotaoFinalizar: () => {
        const botao = document.querySelector('.finalizarBtn');
        botao.addEventListener('click', (e) => {
            e.preventDefault();

            const endereco = document.querySelector('.formEndereco');
            const pagamento = document.querySelector('.formPagamento');

            const camposObrigatorios = [
                ...endereco.querySelectorAll('input[required]'),
                pagamento.querySelector('select')
            ];

            let valido = true;

            camposObrigatorios.forEach(campo => {
                if (!campo.value.trim()) {
                    campo.classList.add('campo-invalido');
                    valido = false;
                } else {
                    campo.classList.remove('campo-invalido');
                }
            });

            if (valido) {
                alert('Pedido confirmado com sucesso!');
            } else {
                alert('Por favor, preencha todos os campos obrigatórios.');
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    checkout.configurarFormulario();
    checkout.configurarBotaoFinalizar();
});
