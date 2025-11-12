const API = 'https://api.jikan.moe/v4/'; // https://api.jikan.moe/v4/anime?

const container = document.querySelector('#container');
const search = document.querySelector('#input-search');
const btnSearch = document.querySelector('#btn-search');


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
            container.appendChild(divImg(items.title, items.images.jpg.large_image_url, items.mal_id));
            
        });

    } catch (error) {
        console.error(error);
    }
}

async function main() {
    const firstMain = await dataFetch(`${API}top/anime?sfw`); // `${API}top/anime?sfw`
    //console.log(firstMain.pagination.current_page);
    firstMain.data.forEach(items => {
        container.appendChild(divImg(items.title, items.images.jpg.large_image_url, items.mal_id));
    });

    for (let i = 2; i <= 4; i++) {
        setTimeout(() => {
            animeMain(i);
        }, i * 600);
    }
}

// Codigo del buscador

async function animeSearch(count, title) {
    try {
        const query = title;
        const animeData = await dataFetch(`${API}anime?q=${encodeURIComponent(query)}&sfw&page=${count}`);

        if (animeData.pagination.last_visible_page >= count) {
            animeData.data.forEach(items => {
                container.appendChild(divImg(items.title, items.images.jpg.large_image_url, items.mal_id));
            });
        }

    } catch (error) {
        console.error(error)
    }
    
}

btnSearch.addEventListener('click', () => {
    try {
        document.querySelectorAll('.items').forEach(deleteItems => deleteItems.remove());
        for (let i = 1; i <= 10; i++) {
            setTimeout(() => {
            animeSearch(i, search.value)

            }, i * 1000)
        }
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
            for (let i = 1; i <= 10; i++) {
                setTimeout(() => {
                    animeSearch(i, search.value)

                }, i * 1000)
            }
        } catch (error) {
            console.log(error);
        }
    }
});

// Template HTML
function divImg(title, img, id){

    const div = document.createElement('div');
    div.classList.add('items');
    div.innerHTML = `<a title="${title}" data-id="${id}" href="info.html"><img class="images" src="${img}" alt="Cover del Anime ${title}"></a>
        <a title="${title}" data-id="${id}" href="info.html"><h2>${title}</h2></a>`

    return div;
}

// Enviar datos a la otra web
container.addEventListener('click', (event) => {
    const aInfo = event.target.closest('a');
    event.preventDefault();
    //console.log(aInfo.dataset.id)

    window.location.href = `info.html?id=${encodeURIComponent(aInfo.dataset.id)}&title=${encodeURIComponent(aInfo.title)}`;
});

//main();

/* const newMain = JSON.parse(localStorage.getItem('datosAnime'));
console.log(newMain); */

// LocalStorage Codigo

let localAnimeArray = [];
async function localAnimeMain(count) {
    try {
        const animeData = await dataFetch(`${API}top/anime?sfw&page=${count}`);
        animeData.data.forEach(items => {
            localAnimeArray.push(items);
            
        });
        console.log(localAnimeArray);
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

if (JSON.parse(localStorage.getItem('datosAnime')) !== null) {
    //console.log(JSON.parse(localStorage.getItem('datosAnime')))
    const lsMain = JSON.parse(localStorage.getItem('datosAnime'));
    lsMain.forEach(items => {
        container.appendChild(divImg(items.title, items.images.jpg.large_image_url, items.mal_id));
    });
    

} else {
    main();
    storageAnimeMain()
}