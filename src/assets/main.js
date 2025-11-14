const API = 'https://api.jikan.moe/v4/'; // https://api.jikan.moe/v4/anime?

const container = document.querySelector('#container');
const search = document.querySelector('#input-search');
const btnSearch = document.querySelector('#btn-search');
const titleAccion = document.querySelector('.title-accion');
const locationLink = new URLSearchParams(window.location.search);

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
        //console.log(animeData.pagination.current_page);
        //console.log(animeData.pagination.last_visible_page);
        animeData.data.forEach(items => {
            container.appendChild(divImg(items));
            localStorageArray.length <= 74 && localStorageArray.push(items); // Codigo localStorage
            
        });

        if (JSON.parse(localStorage.getItem('datosAnime')) === null && count === 3){ // Codigo localStorage
            localStorage.setItem('datosAnime', JSON.stringify(localStorageArray));
            
        }

    } catch (error) {
        console.error(error);

    } finally {
        loader.classList.add('hidden'); // Codigo loader

    }
}


async function main() {
    
    for (let i = 1; i <= 3; i++) {
        await animeMain(i);
    };
    
    seeMoreDiv();
};

// See more Main
function seeMoreDiv(){
    const div = document.createElement('div');
    div.classList.add('see-more');
    div.innerHTML = `<button class="btn-see-more">Ver Mas</button>`
    container.appendChild(div);
};

// Codigo del buscador

let searchArry = [] // codigo de actualizacion de pagina
async function animeSearch(count, title) {
    try {
        const animeData = await dataFetch(`${API}anime?q=${encodeURIComponent(title)}&sfw&page=${count}`);
        //console.log(animeData.pagination.last_visible_page);
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

    document.querySelector('.see-more') && document.querySelector('.see-more').remove();

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
        document.querySelector('.see-more') && document.querySelector('.see-more').remove();
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

// Enviar datos a la otra web y See more o ver mas

let numbA = 3; //  See more o ver mas
let numbB = 3 // See more o ver mas
container.addEventListener('click', async (event) => {
    const aInfo = event.target.closest('a');
    const seeMore = event.target.closest('button.btn-see-more'); // Codigo See more o ver mas

    if (aInfo) {
        event.preventDefault();
        const getSearch = localStorage.getItem('getText'); // codigo de actualizacion de pagina
        if (getSearch != null) {
            window.location.href = `info.html?id=${encodeURIComponent(aInfo.dataset.id)}&title=${encodeURIComponent(aInfo.title)}&search=${encodeURIComponent(getSearch)}`; // codigo de actualizacion de pagina

        } else {
            window.location.href = `info.html?id=${encodeURIComponent(aInfo.dataset.id)}&title=${encodeURIComponent(aInfo.title)}`;
        }

    } else if (seeMore) { // Codigo See more o ver mas
        event.preventDefault()
        document.querySelector('.see-more').remove();

        numbA += 1;
        numbB += 3;
        for (let i = numbA; i <= numbB; i++) {
            await animeMain(i)
            console.log(numbA, numbB);
        }

        seeMoreDiv();

        numbA = numbB;
        window.scrollBy({
            top: 800,
            behavior: "smooth"
        }); 
    }

});

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

const storedData = localStorage.getItem('datosAnime');
const searchParam  = locationLink.get('search')
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

    seeMoreDiv();
    loader.classList.add('hidden'); // Codigo loader

    }, 500);
    
    localStorage.removeItem('search');
    localStorage.removeItem('getText');

    
} else if (searchParam){ // Codigo de busqueda de actualizacion de pagina
    
    
    if (localSearch && getText === searchParam) {

        localSearch.forEach(items => {
            container.appendChild(divImg(items, false));
        });

    } else {
        refreshSearch();
        localStorage.setItem('getText', searchParam);
    }
        
} else {
    main();
    //localStorage.removeItem('datosAnime');
}