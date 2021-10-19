const API_KEY = "38230659-ecd9-4a50-b17e-253983dcaa50";

const API_URL = "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_250_BEST_FILMS&page=";

const API_URL_SEARCH = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";

const API_FILMS_INFO = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";

const API_INFO_DIRECTORS = "https://kinopoiskapiunofficial.tech/api/v1/staff?filmId=";

const API_INFO_FRAMES = "https://kinopoiskapiunofficial.tech/api/v2.1/films/"

const filmInformation = [];

const paginatorInformation = [];


getMovie(API_URL+1,false)

async function getMovie(url,poisk) {
    const paginators = document.querySelector(".pereklyuchatel-stranits");
    document.querySelector(".pereklyuchatel-stranits").innerHTML = "";

    document.querySelector(".movies").innerHTML = `<div class="spin-wrapper">
    <div class="spinner">
    </div>
  </div>`;
    const resp = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
        },
    });
    const respData = await resp.json();
    for(i = 1; i<=respData.pagesCount;i++)
    {
        const paginatorsEl = document.createElement("li");
        console.log(url);
        paginatorsEl.innerHTML = poisk ? `<a onClick=(getMovie("${url + "&page=" + i }",${true}))><i>${i}</i></a>` : `<a onClick=(getMovie("${API_URL + i}",${poisk}))><i>${i}</i></a>`;
        console.log(poisk)
        paginators.appendChild(paginatorsEl);
    }
    showMovies(respData);
    console.log(respData.pagesCount)
}

function getClassRate(rating) {
    if(rating >= 7){
        return "green"
    }
    else if(rating >= 5){
        return "orange";
    }
    else {
        return "red"
    }
}

async function getInformation(id) {
    const moviesInfo = document.querySelector(".movies_info");
    document.querySelector(".movies").style.display = "none";
    document.querySelector(".pereklyuchatel-stranits").style.display = "none";
    moviesInfo.style.display = "block";
    const respInfo = await fetch(API_FILMS_INFO + id, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
        },
    });
    const respDirectors = await fetch(API_INFO_DIRECTORS + id, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
        },
    });
    const respDataInfo = await respInfo.json();
    let respDataDirectors = await respDirectors.json();
    console.log(respDataInfo);
    console.log(respDataDirectors);
   respDataDirectors =  respDataDirectors.filter((arr) => arr.professionKey === "DIRECTOR");
    console.log(respDataDirectors);
    const minutes = respDataInfo.filmLength % 60;
    const hours = Math.trunc(respDataInfo.filmLength/60);
    moviesInfo.innerHTML = `
    <div class="movies_info--top">
                <img src="${respDataInfo.posterUrlPreview}" class="movies_info--top--left">
                <div class="movies_info--top--right">
                    <div><span class="info-left">Название:</span><span class="info-right">${respDataInfo.nameRu}</span></div>
                    <div><span class="info-left">Оригинальное название:</span><span class="info-right">${respDataInfo.nameOriginal}</span></div>
                    <div><span class="info-left">Слоган:</span><span class="info-right">${respDataInfo.slogan}</span></div>
                    <div><span class="info-left">Режиссер:</span><span class="info-right">${respDataDirectors.map(directors => `${directors.nameRu}`)}</span></div>
                    <div><span class="info-left">Жанр:</span><span class="info-right">${respDataInfo.genres.map(genre => `${genre.genre}`)}</span></div>
                    <div><span class="info-left">Год выхода:</span><span class="info-right">${respDataInfo.year}</span></div>
                    <div><span class="info-left">Производство:</span><span class="info-right">${respDataInfo.countries.map(country => `${country.country}`)}</span></div>
                    <div><span class="info-left">Продолжительность:</span><span class="info-right">${respDataInfo.filmLength} минут / ${hours}:${minutes}</span></div>
                </div>
                </div>
                <button onClick=(backGetInformation()) class="back-to"><a>назад</a></button>
    `
}

function backGetInformation() {
    document.querySelector(".movies").style.display = "flex";
    document.querySelector(".pereklyuchatel-stranits").style.display = "flex";
    document.querySelector(".movies_info").style.display = "none";
    document.querySelector(".movies_info").innerHTML = `
    <div class="spin-wrapper">
                    <div class="spinner">
                    </div>
                  </div>
    `
}
function showMovies(data) {
    const moviesEl = document.querySelector(".movies");

    document.querySelector(".movies").innerHTML = "";
   if(data.films.length != 0)
    data.films.forEach(movie => {
        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");
        movieEl.innerHTML = `
        <div class="movie_cover-inner" onClick=(getInformation(${movie.filmId}))>
                        <img src=${movie.posterUrlPreview} class="movie_cover" alt=${movie.nameRu}>
                        <div class="movie_cover--darkened">

                        </div>
                    </div>
                    <div class="movie_info">
                        <div class="movie_title">${movie.nameRu}</div>
                        <div class="movie_category">${movie.genres.map(genre => `${genre.genre}`)}</div>
                        <div class="movie_average movie_average--${getClassRate(movie.rating)}">${movie.rating}</div>
                    </div>
        `;
        moviesEl.appendChild(movieEl);
    });
    else moviesEl.innerHTML =`<div>
                <div><img src="./img/nothing-found.svg"</div>
            <div class="nichego_ne_naideno">ПО ВАШЕМУ ЗАПРОСУ НИЧЕГО НЕ НАЙДЕНО</div>
            </div>`
}

const form = document.querySelector("form");
const search = document.querySelector(".header_search");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    backGetInformation();
    const ApiSearchUrl = `${API_URL_SEARCH}${search.value}`;
    console.log(ApiSearchUrl)
    if(search.value) {
        getMovie(ApiSearchUrl,true);
        search.value = "";
    }
})