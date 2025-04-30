


document.querySelector("#cadastro_card_form").addEventListener('submit', (event) => {
    event.preventDefault();

    let nome = document.querySelector("#name");
    let email = document.querySelector("#email");
    let password = document.querySelector("#password");

    if(nome.value.length > 3 && email.value.length > 3 && password.value.length > 3){
        alert("Usuário cadastrado!")
        nome.value = '';
        email.value = '';
        password.value = '';

        setTimeout(() => {
            window.location.href = "../../Login/index.html";
        }, 1500);
    }else{
        alert("preencha os campos corretamente!");
    }

    
    
})