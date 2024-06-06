


let container = document.querySelector(".pokemons");
let navigation = document.querySelector(".numbers");

const POKE_URL = "https://pokeapi.co/api/v2/pokemon/";
let nextUrl = "";
let prevUrl = "";
let count = 32;
let perPage = 40;


const prev = () => {
    if (prevUrl) {
        clearContainer();
        getPokemons(prevUrl);
    }
    else {
        alert("No hay más pokemones");
    }
}

const next = () => {
    if (nextUrl) {
        clearContainer();
        getPokemons(nextUrl);
    }
    else {
        alert("No hay más pokemones");
    }
}


const getPokemons = (url) => {
    let params = new URLSearchParams(url.split('?')[1]);
    console.log(params.get ('offset'));
    Page = params.get ('offset') / perPage;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            nextUrl = data.next;
            prevUrl = data.previous;
            count = data.count;
            currentPage = Math.floor(data.offset / perPage);
            console.log(currentPage);
            addNumbers();
            showPokemons(data.results);
        })
}

const showPokemons = (array) => {
    array.map(item => {
        fetch(item.url)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                loadCard(data);
            })
    })
}

const loadCard = (data) => {
    const imagen = data.sprites.front_default;
    const newImage = imagen ? imagen : "./img/image_404.png";
    const name = data.name;
    const order = data.order;
    const newOrder = (order != -1) ? order : "#";


    let card = document.createElement("div");
    let content = `
        <img src="${newImage}" alt="${name}">
        <p>${name}</p>
        <p>${newOrder}</p>
    `;
    card.innerHTML = content;
    container.appendChild(card);
}

const addNumbers = () => {
    clearNavigation();
    const page = count / perPage;
    for (let i = 0; i < page; i++) {
        let number = document.createElement("span");
        number.classList.add(`element-${i}`);
        const numLink = `<button onClick="actionsNum(${i})">${i + 1}</button>`;
        number.innerHTML = numLink;
        navigation.appendChild(number);
    }
    addFocusClass();
}

let Page = 0;

const addFocusClass = () => {
    console.log(`Current page: ${Page}`); // Añade esta línea para depuración
    let spanElement = document.querySelector(`.element-${Page}`);
    spanElement.classList.add("current");
}


const actionsNum = (num) => {
    newURL = `${POKE_URL}?offset=${num * 40}&limit=40`;
    clearContainer();
    getPokemons(newURL);
}

const clearContainer = () => container.innerHTML = "";
const clearNavigation = () => navigation.innerHTML = "";

getPokemons(`${POKE_URL}?offset=0&limit=40'`);