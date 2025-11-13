const API = 'https://api.jikan.moe/v4/'; // https://api.jikan.moe/v4/anime?

const container = document.querySelector('#container');
const titleAnime = document.querySelector('.title-anime');
const itemImg = document.querySelector('.item-img');
const itemList = document.querySelector('.item-list');
const itemSyn = document.querySelector('.item-syn');
const backLink = document.querySelector('.back-link');

const infoId = new URLSearchParams(window.location.search);
const getInfoId = infoId.get('id');
console.log(infoId.get('title'));
console.log('Busqueda', infoId.get('search'));

async function dataFetch(apiUrl) {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

async function animeInfoMain() {
    const dataInfo = await dataFetch(`${API}seasons/upcoming`); //now?sfw
    console.log(dataInfo);
    const randomNum = Math.floor(Math.random() * 25);
    const item = dataInfo.data[randomNum];
    animeTemplate(item);
    
}

function animeTemplate(info){

    titleAnime.innerHTML = `<h1>${info.title}</h1>`;
    itemImg.innerHTML = `<img class="image" title="${info.title}" src="${info.images.jpg.large_image_url}" alt="Cover del anime ${info.title}">`;

    genString = '<span class="span-title">Genero:</span> |';
    info.genres.forEach(gen => {
        genString += ` ${gen.name} |`;
    });

    let titleEpisodes = 0;
    if (info.episodes !== null) {
        titleEpisodes = info.episodes;
    } else {
        titleEpisodes = 'Ninguno';
    }

    itemList.innerHTML = `<ul class="item-ul">
                <li class="title-li"> <span class="span-title">Titulos:</span> ${info.title}
                    <ul>
                        <li>${info.title_english}</li>
                        <li>${info.title_japanese}</li>
                    </ul>
                </li>
                <li><span class="span-title">Tipo:</span> ${info.type}</li>
                <li><span class="span-title">Espisodios:</span> ${titleEpisodes}</li>
                <li><span class="span-title">Temporada:</span> ${info.season}</li>
                <li><span class="span-title">Rating:</span> ${info.rating}</li>
                <li><span class="span-title">Score:</span> ${info.score}</li>
                <li>${genString}</li>
                <li><span class="span-title">Duración:</span> ${info.duration}</li>
                <li><span class="span-title">Estado:</span> ${info.status}</li>
                <li><span class="span-title">Estudio:</span> ${info.studios[0].name}</li>
                <li><span class="span-title">Fuente:</span> ${info.source}</li>
                <li><span class="span-title">Año:</span> ${info.year}</li>
            </ul>`;

    itemSyn.innerHTML = ` <h1>Singnosis</h1>
            <p>${info.synopsis}</p>`;
}


async function getId(id) {
    const searchId = await dataFetch(`${API}anime/${id}`)
    console.log(searchId.data);
    animeTemplate(searchId.data);

}


// Volver a la pagina anterios con los datos de busquedas

backLink.addEventListener('click', (event) => {

    event.preventDefault();

    backSearch = infoId.get('search');
    if (backSearch != null) {
        window.location.href = `index.html?search=${encodeURIComponent(backSearch)}`;
        
    } else {
        window.location.href = `index.html`;
    } 
    
})

// Llamada del codigo

if (getInfoId !== null){
    getId(getInfoId);

} else {
    animeInfoMain();
};