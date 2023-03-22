let currentDate 
let events 
const $checkbox = document.getElementById('checkbox')
const $contCards = document.getElementById('cont-cards')
let fn = (card) => card.category 
let cardCategories
let categories
let noRepeatCategories
let arrayNoRepeatCategories
const searchBarFunction = document.getElementById('search')

fetch(' https://mindhub-xj03.onrender.com/api/amazing')
    .then(response => response.json())
    .then (response => {
        currentDate = response.currentDate
        events = response.events.filter(evento=>evento.date<currentDate)
        cardCategories = events.filter(fn)
        categories = cardCategories.map(fn)
        noRepeatCategories = new Set(categories)
        arrayNoRepeatCategories = Array.from(noRepeatCategories)
        console.log(arrayNoRepeatCategories)
        createCheckbox(arrayNoRepeatCategories, $checkbox)
        printCards(events, $contCards)
        $checkbox.addEventListener('change', (event) =>{  
        printCards(filteredText(filterCards(events)), $contCards)  
        })
        //searchbar function read input
        searchBarFunction.addEventListener("keyup", (e)=>{  
        e.preventDefault()
        printCards(filteredText(filterCards(events)), $contCards) 
        })
        searchBarFunction.addEventListener("submit", (e)=>{
        e.preventDefault()
})

    })
    .catch(error => console.log(error))

function createCheckbox(values, container){  
    let template=''
    values.forEach(value => template += `
    <label class="btn btn-secondary active">
    <input class="form-check-input me-2" type="checkbox" value="${value}" id="flexCheckDefault2" checked autocomplete="off">${value}
    </label>
    `)
    container.innerHTML = template
}
createCheckbox(arrayNoRepeatCategories, $checkbox)

function createCard( card ) { 

    let div = document.createElement('div')
    div.className = 'card'
    div.textContent = events.name
    div.classList.add(`card`);
    div.innerHTML = `<img src="${card.image}" class="card-img-top" alt="Image of ${card.name}" />
    <div class="card-body d-flex flex-column align-items-center">
    <h3 class="card-title">${card.name}</h3>
    <p class="card-text"> ${card.description}</p>
    <h5 class="mt-auto">Price:$${card.price} </h5>
    <a href="./details.html?id=${card._id}" class="btn btn-primary align-self-stetch" role="button">More </a>
    </div>`
    return div
}

//imprime las cartas
function printCards(events, container){  
    container.innerHTML=''

    let fragment = document.createDocumentFragment()
    if(events.length!=0){                  
        events.forEach(event => fragment.appendChild(createCard(event)))
        container.appendChild(fragment)
    }else{
        $contCards.innerHTML= `<h2>There is no results for your search.</h2>`  
    }
}
printCards(cardCategories, $contCards)




function filterCards(events){
    let checked= Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(input=>input.value) 
    if(fn.length!=0){
        return events.filter(card => checked.includes(card.category)) 
    } else {
        return events 
    }
}

function filteredText(array){
    let input_value = document.querySelector("input[type='search']").value 
    if (input_value==""){
        return array 
    } else{
        return array.filter(card=>card.name.toLowerCase().includes(input_value.toLowerCase())) 
    }
}