document.querySelector("#login_card_form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

    if (!email || !password) {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/users?email=${email}&password=${password}`);
        const users = await response.json();

        console.log(users)

        if (users.length > 0 && users[0].isAdmin == true) {
            alert("Login realizado com sucesso!");

            setTimeout(() => {
                window.location.href = "../../Admin/index.html";
            }, 1500);
        }
        
        else if(users.length > 0 && users[0].isAdmin == false){
            alert("Login realizado com sucesso!");

            setTimeout(() => {
                window.location.href = "../../Home/index.html";
            }, 1500);
        }

        else {
            alert("Email ou senha incorretos!");
        }
    } catch (error) {
        console.error("Erro ao tentar fazer login:", error.message);
        alert("Erro na conexão com o servidor.");
    }
});