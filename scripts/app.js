


let container = document.querySelector(".pokemons");
let navigation = document.querySelector(".numbers");

const POKE_URL = "https://pokeapi.co/api/v2/pokemon/";
let nextUrl = "";
let prevUrl = "";
let count = 32;
let perPage = 40;

const typeSelect = document.getElementById("type-select");
typeSelect.addEventListener("change", () => {
  clearContainer();
  const typeUrl = typeSelect.value;
  console.log(typeUrl);
  if (typeUrl === "all") {
    getPokemons(`${POKE_URL}?offset=0&limit=40`);
    document.querySelector(".navigation").style.display = "";
  } else {
    getPokemonsType(typeUrl);
    document.querySelector(".navigation").style.display = "none";
  }
});

const getPokemonsType = (url) => {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      pokemons = data.pokemon;
      console.log(pokemons);
      showPokemons(pokemons);
    });
};


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
    console.log(params.get('offset'));
    Page = params.get('offset') / perPage;

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
  if (typeSelect.value === "all") {
    array.map((item) => {
      fetch(item.url)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          loadCard(data);
        });
    });
  } else {
    array.map((pokemon) => {
      fetch(pokemon.pokemon.url)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          loadCard(data);
        });
    });
  }
};

const loadCard = (data) => {
    const imagen = data.sprites.front_default;
    const newImage = imagen ? imagen : "./img/image_404.png";
    const name = data.name;
    const order = data.id;
    const newOrder = (order != -1) ? order : "#";


    let card = document.createElement("div");
    let content = `
        <div class="custom-container">
            <div class="image-container">
                <img src="${newImage}" alt="${name}">
            </div>
            <div class="text-container">
                <span class="pokemon-name">${name}</span>
                <span class="pokemon-number">${newOrder}</span>
            </div>
        </div>
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


//MODAL POKEMON
document.getElementById('search-button').addEventListener('click', () => {
    const search = document.getElementById('search').value;
    fetch(`https://pokeapi.co/api/v2/pokemon/${search}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const pokemonContent = document.getElementById('pokemon-content');
            pokemonContent.innerHTML = `

                <div class="custom-container">
                    <div class="image-container">
                        <img src="${data.sprites.front_default}" alt="${data.name}">
                    </div>
                    <div class="text-container">
                        <span class="pokemon-name">${data.name}</span>
                        <span class="pokemon-number">Altura: ${data.height}</span>
                        <span class="pokemon-number">Peso: ${data.weight}</span>
                    </div>
                </div>
            `;

            // Mostrar el modal
            const modal = document.getElementById('pokemon-modal');
            modal.style.display = 'block';

            // Cerrar el modal cuando se hace clic en la 'x' (close)
            const closeBtn = document.getElementsByClassName('close')[0];
            closeBtn.onclick = function() {
                modal.style.display = 'none';
            };

            // Cerrar el modal cuando se hace clic fuera del contenido
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = 'none';
                }
            };
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('No se encontró el Pokémon.');
        });
});



//FIN MODAL

/**
 * FILTRO DE POKEMONES
 */

const getTypes = () => {
    fetch("https://pokeapi.co/api/v2/type")
      .then((response) => response.json())
      .then((data) => {
        const typeSelect = document.getElementById("type-select");
        data.results.forEach((type) => {
          const option = document.createElement("option");
          option.value = type.url;
          option.text = type.name;
          typeSelect.appendChild(option);
        });
      });
}

getTypes();