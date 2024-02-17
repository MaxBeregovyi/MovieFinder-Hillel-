document.addEventListener("DOMContentLoaded", function () {
    const BASE_URL = "http://www.omdbapi.com/?apikey=f32b9214&";
    const searchMovieForm = document.forms.searchMovieForm;
    const queryField = document.querySelector('.form__input');
    const results = document.querySelector('.search-results');
    const findFilmsList = document.querySelector('.find__films--list');

    let loading = false;
    let searchHistory = [];

    const wsUri = "wss://socketsbay.com/wss/v2/1/c7a704f42144ac9d0338cc7b42f7065e/";
    let searchSocket = new WebSocket(wsUri);

    searchSocket.onopen = function (event) {
        console.log('Connected to the WebSocket server');
    };

    searchSocket.onmessage = function (event) {
        console.log('Message from server:', event.data);
        let data = JSON.parse(event.data);
        let query = data.query;
        displayLastSearch(query);
    };

    searchSocket.onerror = function (event) {
        console.error('WebSocket error:', event);
    };

    searchSocket.onclose = function (event) {
        console.log('WebSocket connection closed:', event);
    };

    async function searchMovie(query) {
        loading = true;
        let res = await fetch(`${BASE_URL}s=${query}`);
        let data = await res.json();
        renderSearchResults(data.Search);
        loading = false;
        addToSearchHistory(query);

        searchSocket.send(JSON.stringify({query: query}));
        return data;
    }

    function renderSearchResults(searchResults) {
        results.innerHTML = "";
        searchResults.forEach(item => {
            results.appendChild(renderSearchItem(item));
        });
    }

    function renderSearchItem(item) {
        let wrap = document.createElement('li');
        wrap.classList.add('search-results__item');

        let poster = document.createElement('img');
        poster.classList.add('search-results__poster');
        poster.src = item.Poster;
        poster.alt = item.Title;
        wrap.appendChild(poster);

        let title = document.createElement('h2');
        title.classList.add('search-results__title');
        title.innerText = item.Title;
        wrap.appendChild(title);

        let about = document.createElement('p');
        about.classList.add('search-results__about');
        about.innerHTML += `<span class="search-results__year">${item.Year}</span>`;
        about.innerHTML += `<span class="search-results__type">${item.Type}</span>`;
        wrap.appendChild(about);

        let link = document.createElement('a');
        link.setAttribute('href', `single.html?i=${item.imdbID}`);
        link.innerText = 'About';
        link.innerHTML += '<span class="material-symbols-outlined">arrow_forward_ios</span>';
        wrap.appendChild(link);

        return wrap;
    }

    function addToSearchHistory(query) {
        searchHistory.unshift(query);
        if (searchHistory.length > 5) {
            searchHistory.pop();
        }
        renderSearchHistory();
    }

    function renderSearchHistory() {
        findFilmsList.innerHTML = "";
        const recentSearches = searchHistory.slice(0, 5);
        recentSearches.forEach(item => {
            let li = document.createElement('li');
            li.textContent = item;
            findFilmsList.appendChild(li);
        });
    }

    function displayLastSearch(query) {
        findFilmsList.innerHTML = "";
        let li = document.createElement('li');
        li.textContent = query;
        findFilmsList.appendChild(li);
    }

    searchMovieForm.addEventListener('submit', function (event) {
        event.preventDefault();
        let query = event.target.elements.query.value.trim();
        if (query.length > 2) {
            searchMovie(query);
        }
    });

    renderSearchHistory();
});
