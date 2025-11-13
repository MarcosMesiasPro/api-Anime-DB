const API = 'https://api.jikan.moe/v4/'; // https://api.jikan.moe/v4/anime?

const container = document.querySelector('#container');
const search = document.querySelector('#input-search');
const btnSearch = document.querySelector('#btn-search');
const titleAccion = document.querySelector('.title-accion');
const seeMoreBtn = document.querySelector('.btn-see-more');
const locationLink = new URLSearchParams(window.location.search);

async function dataFetch(apiUrl) {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

// Codigo Main pagina principal
async function animeMain(count) {
    try {
        const animeData = await dataFetch(`${API}top/anime?sfw&page=${count}`); // top/anime?sfw
        //console.log(animeData.pagination.current_page);
        //console.log(animeData.pagination.last_visible_page);
        animeData.data.forEach(items => {
            container.appendChild(divImg(items));
            
        });

    } catch (error) {
        console.error(error);
    }
}

async function main() {
    const firstMain = await dataFetch(`${API}top/anime?sfw`); // `${API}top/anime?sfw`
    //console.log(firstMain.pagination.current_page);
    firstMain.data.forEach(items => {
        container.appendChild(divImg(items));
    });

    for (let i = 2; i <= 4; i++) {
        setTimeout(() => {
            animeMain(i);
        }, i * 600);
    }
}

// Codigo del buscador

let searchArry = [] // codigo de actualizacion de pagina
async function animeSearch(count, title) {
    try {
        const animeData = await dataFetch(`${API}anime?q=${encodeURIComponent(title)}&sfw&page=${count}`);

        if (animeData.pagination.last_visible_page >= count) {
            animeData.data.forEach(items => {
                container.appendChild(divImg(items, false));
                searchArry.push(items); // codigo de actualizacion de pagina
            });
        }

        localStorage.setItem('search', JSON.stringify(searchArry)); // codigo de actualizacion de pagina

    } catch (error) {
        console.error(error)
    }
    
}

btnSearch.addEventListener('click', () => {
    try {
        document.querySelectorAll('.items').forEach(deleteItems => deleteItems.remove());
        titleAccion.textContent = "";
        for (let i = 1; i <= 10; i++) {
            setTimeout(() => {
            animeSearch(i, search.value)

            }, i * 1000)
        }

        history.pushState({}, '', `?search=${encodeURIComponent(search.value)}`); // codigo de actualizacion de pagina
        localStorage.setItem('getText', search.value); // codigo de actualizacion de pagina

    } catch (error) {
        console.log(error);
    }
});

// Codigo del buscador ENTER

search.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        try {
            document.querySelectorAll('.items').forEach(deleteItems => deleteItems.remove());
            titleAccion.textContent = "";
            for (let i = 1; i <= 10; i++) {
                setTimeout(() => {
                    animeSearch(i, search.value)

                }, i * 1000)
            }

            history.pushState({}, '', `?search=${encodeURIComponent(search.value)}`); // codigo de actualizacion de pagina
            localStorage.setItem('getText', search.value); // codigo de actualizacion de pagina

        } catch (error) {
            console.log(error);
        }
    }
});

// Template HTML
function divImg(data, dataBool = true){

    const img = data.images.jpg.large_image_url
    const div = document.createElement('div');
    div.classList.add('items');

    if (dataBool === true){
        titleAccion.textContent = 'Top Animes';
        div.innerHTML = `<div class="score"><p>${data.score}<br/>Score</p></div>
        <a title="${data.title}" data-id="${data.mal_id}" href="info.html"><img class="images" src="${img}" alt="Cover del Anime ${data.title}"></a>
        <a title="${data.title}" data-id="${data.mal_id}" href="info.html"><h2>${data.title}</h2></a>`;

    } else {
        titleAccion.textContent = 'Titulos Encontrados';
        div.innerHTML = `<a title="${data.title}" data-id="${data.mal_id}" href="info.html"><img class="images" src="${img}" alt="Cover del Anime ${data.title}"></a>
        <a title="${data.title}" data-id="${data.mal_id}" href="info.html"><h2>${data.title}</h2></a>`;
    }

    return div;
}

// Enviar datos a la otra web

container.addEventListener('click', (event) => {
    const aInfo = event.target.closest('a');
    event.preventDefault();

    const getSearch = localStorage.getItem('getText'); // codigo de actualizacion de pagina
    if (getSearch != null) {
        window.location.href = `info.html?id=${encodeURIComponent(aInfo.dataset.id)}&title=${encodeURIComponent(aInfo.title)}&search=${encodeURIComponent(getSearch)}`; // codigo de actualizacion de pagina

    } else {
        window.location.href = `info.html?id=${encodeURIComponent(aInfo.dataset.id)}&title=${encodeURIComponent(aInfo.title)}`;
    }

});

// LocalStorage Codigo

let localAnimeArray = [];
async function localAnimeMain(count) {
    try {
        const animeData = await dataFetch(`${API}top/anime?sfw&page=${count}`);
        animeData.data.forEach(items => {
            localAnimeArray.push(items);
            
        });
        localStorage.setItem('datosAnime', JSON.stringify(localAnimeArray));

    } catch (error) {
        console.error(error);
    }
}

function storageAnimeMain() {
    for (let i = 1; i <= 4; i++){
        setTimeout(() => {
            localAnimeMain(i)
        }, i * 2000);
    }
}

// Codigo de busqueda de actualizacion de pagina

function refreshSearch() {
    try {
        document.querySelectorAll('.items').forEach(deleteItems => deleteItems.remove());
        titleAccion.textContent = "";
        for (let i = 1; i <= 10; i++) {
            setTimeout(() => {
            animeSearch(i, locationLink.get('search'));

            }, i * 1000)
        }
    } catch (error) {
        console.log(error);
    }
}


// Llamada del codigo

if (JSON.parse(localStorage.getItem('datosAnime')) !== null && locationLink.get('search') === null) {

    const lsMain = JSON.parse(localStorage.getItem('datosAnime'));
    lsMain.forEach(items => {
        container.appendChild(divImg(items));
    });

    localStorage.removeItem('search');
    localStorage.removeItem('getText');
    
} else if (locationLink.get('search') !== null){ // Codigo de busqueda de actualizacion de pagina
    
    const localSearch = JSON.parse(localStorage.getItem('search'));
    if (localSearch !== null && localStorage.getItem('getText') === locationLink.get('search')) {

        localSearch.forEach(items => {
            container.appendChild(divImg(items, false));
        });

    } else {
        refreshSearch();
        localStorage.setItem('getText', locationLink.get('search'));

    }
     
    
} else {
    main();
    storageAnimeMain()
}

// See more o ver mas
let numbA = 4; //NumberA
let numbB = 4 //NumberB
seeMoreBtn.addEventListener('click', () => {
    numbA += 1;
    numbB += 4;

    seeMoreMain(numbA, numbB);

    numbA = numbB;
});

function seeMoreMain(numA, numB) {

    for (let i = numA; i <= numB; i++){
        setTimeout(() => {
            animeMain(i)
        }, i * 800);
    }
};