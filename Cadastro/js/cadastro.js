const cadastrar = async (nome, email, password) => {
    try {
        let busca = await fetch(`http://localhost:3000/users?email=${email}`);
        let resultado = await busca.json();

        if (resultado.length > 0) {
            alert("Este e-mail já está cadastrado.");
            return;
        }

        await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nome,
                email: email,
                password: password,
                isAdmin: false
            })
        });

        busca = await fetch(`http://localhost:3000/users?email=${email}`);
        resultado = await busca.json();

        if (resultado.length > 0) {
            alert("Usuário cadastrado com sucesso!");
            setTimeout(() => {
                window.location.href = "../../Login/index.html";
            }, 1500);
            return;
        }

    } catch (error) {
        alert("Erro ao cadastrar: " + error.message);
    }
};

document.querySelector("#cadastro_card_form").addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

    if (nome.length > 3 && email.length > 3 && password.length > 3) {
        await cadastrar(nome, email, password);
    } else {
        alert("Preencha todos os campos corretamente (mínimo 4 caracteres).");
    }
});
