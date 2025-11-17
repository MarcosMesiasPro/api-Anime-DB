const API = 'https://api.jikan.moe/v4/'; // https://api.jikan.moe/v4/anime?

const container = document.querySelector('#container');
const search = document.querySelector('#input-search');
const btnSearch = document.querySelector('#btn-search');
const titleAccion = document.querySelector('.title-accion');
const locationLink = new URLSearchParams(window.location.search);
let loadMain = false;

async function dataFetch(apiUrl) {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

// Codigo Main pagina principal

let localStorageArray = []; // Codigo localStorage
async function animeMain(count) {
    const loader = document.getElementById('loader'); // Codigo loader
    loader.classList.remove('hidden'); // Codigo loader

    try {
        const animeData = await dataFetch(`${API}top/anime?sfw&page=${count}`); // top/anime?sfw
        animeData.data.forEach(items => {
            container.appendChild(divImg(items));
            localStorageArray.length <= 74 && localStorageArray.push(items); // Codigo localStorage
            
        });

        if (JSON.parse(localStorage.getItem('datosAnime')) === null && count === 3){ // Codigo localStorage
            localStorage.setItem('datosAnime', JSON.stringify(localStorageArray));
            
        }
        if (count === 3){loadMain = true}; // Codigo del observador scroll infinito

    } catch (error) {
        console.error(error);

    } finally {
        loader.classList.add('hidden'); // Codigo loader

    }
}


async function main() {
    try {
        for (let i = 1; i <= 3; i++) {
        await animeMain(i);
    };

    } catch (error) {
        console.error(error)
    }
};

// Codigo del buscador

let searchArry = [] // codigo de actualizacion de pagina
async function animeSearch(count, title) {
    loadMain = false; // Codigo del observador scroll infinito
    const loader = document.getElementById('loader'); // Codigo loader
    loader.classList.remove('hidden'); // Codigo loader
    let totalPage = 0;
    try {
        const animeData = await dataFetch(`${API}anime?q=${encodeURIComponent(title)}&sfw&page=${count}`);
        totalPage = animeData.pagination.last_visible_page;
        if (animeData.pagination.last_visible_page >= count) {
            animeData.data.forEach(items => {
                container.appendChild(divImg(items, false));
                searchArry.length < 75 && searchArry.push(items); // codigo de actualizacion de pagina
                
            });
        }

        localStorage.setItem('search', JSON.stringify(searchArry)); // codigo de actualizacion de pagina 
        if (count >= 3 && totalPage > 3){loadMain = true}; // Codigo del observador scroll infinito

    } catch (error) {
        console.error(error)
    } finally {
        loader.classList.add('hidden'); // Codigo loader
        return totalPage;
    }
}

// Buscador de click boton

let seeSearchID = 0; // ID para multiples paginas a la hora de buscar
btnSearch.addEventListener('click', async () => {
    searchArry = [];
    let totalPage = 0;
    const inputSearch = search.value;
    try {
        document.querySelectorAll('.items').forEach(deleteItems => deleteItems.remove());
        titleAccion.textContent = "";
        for (let i = 1; i <= 3; i++) {
            totalPage = await animeSearch(i, inputSearch);
        };

        history.pushState({search: inputSearch}, '', `?search=${encodeURIComponent(inputSearch)}`); // codigo de actualizacion de pagina
        localStorage.setItem('getText', inputSearch); // codigo de actualizacion de pagina

        if (totalPage > 3) {
            localStorage.setItem('seeSearch', JSON.stringify([totalPage, inputSearch, seeSearchID]));
            seeSearchID ++;
        }; 

    } catch (error) {
        console.log(error);
    };
});

// Codigo del buscador ENTER

search.addEventListener('keydown', async (event) => {
    searchArry = [];
    let totalPage = 0;
    const inputSearch = search.value;
    if (event.key === 'Enter') {
        event.preventDefault();
        try {
            document.querySelectorAll('.items').forEach(deleteItems => deleteItems.remove());
            titleAccion.textContent = "";
            for (let i = 1; i <= 3; i++) {
                totalPage = await animeSearch(i, inputSearch);
            };

            history.pushState({search: inputSearch}, '', `?search=${encodeURIComponent(inputSearch)}`); // codigo de actualizacion de pagina
            localStorage.setItem('getText', inputSearch); // codigo de actualizacion de pagina

            if (totalPage > 3) {
                localStorage.setItem('seeSearch', JSON.stringify([totalPage, inputSearch, seeSearchID]));
                seeSearchID++;
            };

        } catch (error) {
            console.log(error);

        };
    };
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

// Enviar datos a al otro link info.html

container.addEventListener('click', async (event) => {
    const aInfo = event.target.closest('a');
    if (!aInfo) return;
    event.preventDefault();
    const getSearch = localStorage.getItem('getText'); // codigo de actualizacion de pagina
    if (getSearch) {
        window.location.href = `info.html?id=${encodeURIComponent(aInfo.dataset.id)}&title=${encodeURIComponent(aInfo.title)}&search=${encodeURIComponent(getSearch)}`; // codigo de actualizacion de pagina

    } else {
        window.location.href = `info.html?id=${encodeURIComponent(aInfo.dataset.id)}&title=${encodeURIComponent(aInfo.title)}`;
    }

});

// Codigo de busqueda de actualizacion de pagina para otras webs

async function refreshSearch() {
    let totalPage = 0;
    const inputSearch = locationLink.get('search');
    try {
        document.querySelectorAll('.items').forEach(deleteItems => deleteItems.remove());
        titleAccion.textContent = "";
        for (let i = 1; i <= 3; i++) {
                totalPage = await animeSearch(i, inputSearch);
            };

            if (totalPage > 3) {
                localStorage.setItem('seeSearch', JSON.stringify([totalPage, inputSearch, seeSearchID]));
            }
    } catch (error) {
        console.error(error);
    }
};

// Llamada del codigo

const storedData = localStorage.getItem('datosAnime');
const searchParam  = locationLink.get('search');
const localSearch = JSON.parse(localStorage.getItem('search'));
const getText = localStorage.getItem('getText');

if (storedData && !searchParam) {
    
    const loader = document.getElementById('loader'); // Codigo loader
    loader.classList.remove('hidden'); // Codigo loader

    const lsMain = JSON.parse(storedData);
    setTimeout(() => {
        lsMain.forEach(items => {
        container.appendChild(divImg(items));
    });

    loader.classList.add('hidden'); // Codigo loader
    loadMain = true;

    }, 500);
    
    localStorage.removeItem('search');
    localStorage.removeItem('getText');
    localStorage.removeItem('seeSearch');
    
} else if (searchParam){ // Codigo de busqueda de actualizacion de pagina
    //refreshSearch();
    const loader = document.getElementById('loader'); // Codigo loader
    loader.classList.remove('hidden'); // Codigo loader

    const seeRefresh = JSON.parse(localStorage.getItem('seeSearch'));
    if (localSearch && getText === searchParam) {
        setTimeout (() => {
            localSearch.forEach(items => {
                container.appendChild(divImg(items, false));
            });

            if (seeRefresh){
                if (seeRefresh[1] === getText) {loadMain = true};
            }
            loader.classList.add('hidden'); // Codigo loader
        }, 500);
        
    } else {
        refreshSearch();
        localStorage.setItem('getText', searchParam);
    }
   
} else {
    main();
    //localStorage.removeItem('datosAnime');
}

// Codigo del boton de adelante y atras

window.addEventListener('popstate', async(event) => { // Funciona solo cuando usamos los botones de atras y adelante
    searchArry = [];
    let totalPage = 0;
    if (event.state) {
        const inputSearch = event.state.search;
        event.preventDefault();
        try {
            const loader = document.getElementById('loader'); // Codigo loader
            loader.classList.remove('hidden'); // Codigo loader

            document.querySelectorAll('.items').forEach(deleteItems => deleteItems.remove());
            titleAccion.textContent = "";
            for (let i = 1; i <= 3; i++) {
                totalPage = await animeSearch(i, inputSearch);
            };

            localStorage.setItem('getText', inputSearch); // codigo de actualizacion de pagina
            if (totalPage > 3) {
                localStorage.setItem('seeSearch', JSON.stringify([totalPage, inputSearch, seeSearchID]));
                seeSearchID++;
            }

        } catch (error) {
            console.error(error)
        } finally {
            loader.classList.add('hidden'); // Codigo loader
        };

    } else {
        const loader = document.getElementById('loader'); // Codigo loader
        loader.classList.remove('hidden'); // Codigo loader

        document.querySelectorAll('.items').forEach(deleteItems => deleteItems.remove());
        titleAccion.textContent = "";

        const lsMain = JSON.parse(storedData);
        setTimeout(() => {
            lsMain.forEach(items => {
                container.appendChild(divImg(items));
            });

            loader.classList.add('hidden'); // Codigo loader
            loadMain = true;

        }, 500);

        localStorage.removeItem('search');
        localStorage.removeItem('getText');
        localStorage.removeItem('seeSearch');
    }
    
});

// Nueva linea de codigo. Scroll infinito.

const sentinel = document.querySelector('#sentinel');
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        loadMain && loadAnime();
    };
});

let loading = false;
let loadNumbA = 3;
let loadNumbB = 3;
let seeNumbA = 3;
let seeNumbB = 3;
let getSeeSearchId = 0
async function loadAnime() {
    const scrollSearch = localStorage.getItem('getText');
    //if (loading) return;
    if (!loading && !scrollSearch) {
        try {
            loading = true;
            console.log('Entro en el observador');
            loadNumbA += 1;
            loadNumbB += 3;

            for (let i = loadNumbA; i <= loadNumbB; i++) {
                await animeMain(i);
            };

            loadNumbA = loadNumbB;
            

        } catch (error) {
            console.error(error);
        }   
    } else if (scrollSearch) {
        const newSeeSearch = JSON.parse(localStorage.getItem('seeSearch'));
        if (getSeeSearchId !== newSeeSearch[2]) {
            seeNumbA = 3;
            seeNumbB = 3;
            getSeeSearchId = newSeeSearch[2];
        }

        seeNumbA += 1;
        seeNumbB += 3;
        for (let i = seeNumbA; i <= seeNumbB; i++) {

            if (i <= newSeeSearch[0]) {
                await animeSearch(i, newSeeSearch[1]);

            };
            
            if (i == newSeeSearch[0]){
                loadMain = false;
                break;
            };
        };
        console.log(loadMain);

        seeNumbA = seeNumbB;
    }

    loading = false;

    window.scrollBy({
        top: 800,
        behavior: "smooth"
    });
};

observer.observe(sentinel);