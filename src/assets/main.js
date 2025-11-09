const API = 'https://animedb1.p.rapidapi.com/top/anime?limit=20';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': 'dcff44e6c4mshb0fa2f7d3fb9303p167ac8jsn89b876830305',
		'x-rapidapi-host': 'animedb1.p.rapidapi.com'
	}
};

const container = document.querySelector('#container');
let divs = document.createElement('div');
divs.classList.add('items')

async function animeData(apiUrl, optGet) {
    try {
        const response = await fetch(apiUrl, optGet);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const dataApi = await response.json();

        //console.log(dataApi.data)

        //let dataJson = dataApi.data.map(item => item);
        dataApi.data.slice(0,12).forEach(items => {
            console.log(items.images.jpg.large_image_url)
            container.appendChild(divImg(items.title, items.images.jpg.large_image_url));
            
        });
        
    } catch (error) {
        console.log(`Un error a ocurrido: ${error}`)
    }
}

function divImg(title, img){

    const div = document.createElement('div');

    div.classList.add('items');
    div.innerHTML = `<img class="images" src="${img}" alt="Cover del Anime ${title}">
        <h2>${title}</h2>`

    return div;
}

animeData(API, options);