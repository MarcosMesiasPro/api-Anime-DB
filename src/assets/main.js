const API = 'https://animedb1.p.rapidapi.com/top/anime?'; //https://animedb1.p.rapidapi.com/top/anime?limit=24 page=1
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': 'dcff44e6c4mshb0fa2f7d3fb9303p167ac8jsn89b876830305',
		'x-rapidapi-host': 'animedb1.p.rapidapi.com'
	}
};

const container = document.querySelector('#container');
const search = document.querySelector('#input-search');
const btnSearch = document.querySelector('#btn-search');

async function animeData(apiUrl, optGet) {
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

function divImg(title, img){

    const div = document.createElement('div');
    div.classList.add('items');
    div.innerHTML = `<a href="#"><img class="images" src="${img}" alt="Cover del Anime ${title}"></a>
        <a href="#"><h2>${title}</h2></a>`

    return div;
}

function notFound() {
    div = document.createElement('div');
    div.classList.add('not-found');
    div.innerHTML = `<span>Anime no Encontrdo</span>`;

    return div;
}

animeData(API, options);