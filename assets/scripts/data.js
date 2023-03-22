let urlAPI = 'https://mindhub-xj03.onrender.com/api/amazing';
let pokemons = [];
let types = [];
let inputBusqueda = document.querySelector("input[name=search]");
let checkboxes;

async function getPokemons() {
    try {
        let response = await fetch(urlAPI);
        let dataAPI = await response.json();
        
        for (const pokemon of dataAPI.results) {
            try {
                let pokeData = await getPokemon(pokemon.url);
                pokeData.types = pokeData.types.map(item => item.type.name);
                pokemons.push(pokeData);
            } catch (error) {
                console.log(error.message);
            }
        }
        // ya tengo disponible el array pokemons para hacer todas las operaciones iniciales
        renderCards(pokemons);

        types = extractTypes(pokemons);

        renderCheckboxes(types);

        checkboxes = document.querySelectorAll("input[type=checkbox]");

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener("change", () => {
                renderSearch();
            })
        })

    } catch (error) {
        console.log(error.message);
    }
}
getPokemons();

async function getPokemon(url) {
    try {
        let response = await fetch(url);
        let pokemon = await response.json();
        return pokemon;
    } catch (error) {
        console.log(error.message);
        return {};
    }
}

function renderCards(pokemons) {
    let container = document.querySelector(".pokemons_container");
    let htmlCards = "";
    pokemons.forEach(pokemon => htmlCards += createCard(pokemon));
    container.innerHTML = htmlCards;
}

function createCard(pokemon){
    return `<div class="pokemon">
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    <div class="text">
        <h4>#${pokemon.id.toString().padStart(3,'0')}</h4>
        <h3>${pokemon.name}</h3>
        <div class="types">
            ${pokemon.types.map(type => `<span>${type}</span>`).join("")}
        </div>
    </div>
</div>`;
}

function extractTypes(pokemons){
    let types = [];
    pokemons.forEach(pokemon => {
        pokemon.types.forEach(type => {
            if (!types.includes(type)) {
                types.push(type);
            }
        })
    });
    return types;
}

function renderCheckboxes(types) {
    let container = document.querySelector(".types_checkboxes");
    container.innerHTML = types.map(type => `<label>
    <input type="checkbox" name="types" value="${type}">
    <span>${type}</span>
</label>`).join("");
}

inputBusqueda.addEventListener("input", () => {
    renderSearch();
});


function getChequeados() {
    let chequeados = [];
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            chequeados.push(checkbox.value);
        }
    });
    return chequeados;
}

function renderSearch() {
    let textoBusqueda = inputBusqueda.value;
    let tiposChequeados = getChequeados();
    let resultados = pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(textoBusqueda.toLowerCase()));
    if (tiposChequeados.length > 0) {
        resultados = resultados.filter(pokemon => {
          
             let pasaFiltro = false;
            pokemon.types.forEach(tipo => {
               if (tiposChequeados.includes(tipo)) {
                  pasaFiltro = true;
             }
         });
         return pasaFiltro;
            return tiposChequeados.some(tipo => pokemon.types.includes(tipo));
        });
    }
    renderCards(resultados);
}