document.addEventListener("DOMContentLoaded", () => {
    const confirmacaoSection = document.querySelector(".confirmacao");

    confirmacaoSection.style.opacity = "0";
  
    setTimeout(() => {
      confirmacaoSection.style.transition = "opacity 0.6s ease";
      confirmacaoSection.style.opacity = "1";
    }, 200);


  });
  