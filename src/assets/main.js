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
        const animeData = await dataFetch(`${API}top/anime?sfw&page=${count}`);
        //console.log(animeData.data);
        //console.log(animeData.pagination.last_visible_page);
        animeData.data.forEach(items => {
            container.appendChild(divImg(items.title, items.images.jpg.large_image_url));
        });

    } catch (error) {
        console.error(error);
    }
}

async function main() {
    const firstMain = await dataFetch(`${API}top/anime?sfw`); // `${API}top/anime?sfw`
    console.log(firstMain.data);
    firstMain.data.forEach(items => {
        container.appendChild(divImg(items.title, items.images.jpg.large_image_url));
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
                container.appendChild(divImg(items.title, items.images.jpg.large_image_url));
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
function divImg(title, img){

    const div = document.createElement('div');
    div.classList.add('items');
    div.innerHTML = `<a href="#"><img class="images" src="${img}" alt="Cover del Anime ${title}"></a>
        <a href="#"><h2>${title}</h2></a>`

    return div;
}

main();

/* async function animeData(apiUrl, optGet) {
    try {
        const response = await fetch(`${apiUrl}page=1`, optGet);
        const response2 = await fetch(`${apiUrl}page=2`, optGet);
        if (!response.ok || !response2.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const dataApi = await response.json();
        const dataApi2 = await response2.json();

        console.log(dataApi)

        dataApi.data.slice(0,25).forEach(items => {
            container.appendChild(divImg(items.title, items.images.jpg.large_image_url));
            
        });

        dataApi2.data.forEach(items2 => {
            container.appendChild(divImg(items2.title, items2.images.jpg.large_image_url))
        })

        btnSearch.addEventListener('click', () => {
            //console.log(`${search.value}`);
            document.querySelectorAll('.items').forEach(itemDelete => itemDelete.remove());
            
            try {
                if (container.children[1].className === 'not-found') {
                    document.querySelectorAll('.not-found').forEach(notDelete => notDelete.remove());
                }
            } catch (error) {
                console.log(error);
            }

            const optionsFuse = {
            keys: ['title'],
            threshold: 0.4
            };

            const fuse = new Fuse(dataApi.data, optionsFuse);

            const query = search.value;
            result = fuse.search(query);

            if (result.length !== 0) {
                    result.forEach(content => {
                    console.log(content.item.title);
                    console.log(content.item.images.jpg.large_image_url);
                    container.appendChild(divImg(content.item.title, content.item.images.jpg.large_image_url))
                })
            } else {
                container.appendChild(notFound())
            }
        })
        
    } catch (error) {
        console.log(`Un error a ocurrido: ${error}`)
    }
}


function notFound() {
    div = document.createElement('div');
    div.classList.add('not-found');
    div.innerHTML = `<span>Anime no Encontrdo</span>`;

    return div;
}

animeData(API, options); */