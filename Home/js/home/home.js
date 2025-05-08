let page = 0;

let category_image = document.querySelector("#category_img");
let category_title = document.querySelector("#category_title");
let category_description = document.querySelector("#category_description");

const carousel = {
    categories : [
        {
            title:"Moda Masculina",
            description: "Roupas masculinas elegantes",
            url:"./assets/imgs/masculina.jpeg"        
        },
        {
            title:"Moda Feminina",
            description: "Tudo para o seu vestuário",
            url:"./assets/imgs/feminina.jpg"   
        },
        {
            title:"Moda Infantil",
            description: "De 0 a 8 anos",
            url:"./assets/imgs/infantil.jpeg"   
        }
    ],
    imgs: (page) => {
        category_title.innerText = carousel.categories[page].title;
        category_image.src = carousel.categories[page].url;
        category_description.innerText = carousel.categories[page].description;
    },
    prev: () => {
        page--;

        if(page < 0){
            page = (carousel.categories.length - 1);
        }

        console.log(page);

        carousel.imgs(page);
    },
    next: () => {
        page++;

        if(page >= carousel.categories.length){
            page = 0;
        }

        console.log(page);

        carousel.imgs(page);
    }
}

const prev = document.querySelector("#categories_prev");
prev.addEventListener('click', carousel.prev);

const next = document.querySelector("#categories_next");
next.addEventListener('click', carousel.next);

carousel.imgs(page);

document.getElementById('hero_section_description_button').addEventListener('click', function() {
    window.location.href = '#categories';
  });