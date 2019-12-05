var MOVIE_API_KEY = "a21e4186";

var searchForm = document.getElementById("search-form");
var input = document.getElementById("search-input");

var movieTitle = document.getElementById("movie-title");
var movieYear = document.getElementById("movie-year");
var movieGenre = document.getElementById("movie-genre");
var movieRuntime = document.getElementById("movie-runtime");
var productionStudio = document.getElementById("production-studio");
var moviePlot = document.getElementById("movie-plot");
var moviePoster = document.getElementById("moviePoster");

var movieList = document.getElementById("movie-list");
var saveData = document.getElementById("save-data");

var savedMovie = [];
var movieName;

function integrateUrl(query) {
  var url = "http://www.omdbapi.com/?&apikey=" + MOVIE_API_KEY + "&t=" + query + "&plot=full";
  queryAPI(url);
}

function queryAPI(url) {
  fetch(url)
  .then(function (response) {
    response.json().then(function (data) {
      if (response.status === 200) {
        movieTitle.textContent = data.Title;
        movieName = data.Title;
        movieYear.textContent = data.Released;
        movieGenre.textContent = data.Genre;
        movieRuntime.textContent = data.Runtime;
        moviePlot.textContent = data.Plot;
        productionStudio.textContent = data.Production;
        moviePoster.src = data.Poster;
      } else {
        console.error('error', data);
      }
    });
  });
}

searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var query = input.value;
    integrateUrl(query);
});

saveData.addEventListener("click", function(e) {
  e.preventDefault();

  var name = movieName;
  writeDataQueries(name);
});

function writeDataQueries(query) {
  savedMovie.push(query);
  /* if (savedMovie.length === 1) {
      boxTitle.classList.remove("hidden");
  } */
  changeQueries();
}

function removeMovieList(inputValue) {
  var filteredList = savedMovie.filter(function (item) {
      return inputValue !== item;
  });
  savedMovie = filteredList;
  /* if (savedMovie.length < 1) {
      boxTitle.classList.add("hidden");
  } */
  changeQueries();
}

function changeQueries() {
  var queryJson = JSON.stringify(savedMovie);
  localStorage.setItem("movie-query", queryJson);
  displaySavedMovie();
}

function displaySavedMovie() {
  movieList.innerHTML = "";
  savedMovie.forEach(function (item) {
      var movieElement = document.createElement("li");
      var listName = document.createElement("a");
      listName.setAttribute("href", "#");
      listName.setAttribute("class", "btn btn-light");
      listName.innerHTML = item;
      listName.addEventListener("click", function(e) {
          integrateUrl(item);
          movieName = item;
          input.value = item;
      });
      listName.classList.add("place-left");

      var removeMovie = document.createElement("a");
      removeMovie.setAttribute("href", "#");
      removeMovie.setAttribute("class", "btn btn-secondary");
      removeMovie.innerHTML = "Remove";
      removeMovie.addEventListener("click", function (e) {
          removeMovieList(item);
      });
      removeMovie.classList.add("place-right");

      movieElement.appendChild(listName);
      movieElement.appendChild(removeMovie);
      movieList.appendChild(movieElement);
  });
}

function loadDataQueries() {
  try {
      var queryJson = localStorage.getItem("movie-query");
      var queries = JSON.parse(queryJson) || [];
      savedMovie = queries;
      if (savedMovie.length > 0) {
          displayWeather(savedMovie[0]);
          inputData = savedMovie[0];
          boxTitle.classList.remove("hidden");
      }
  } catch(e) {
      savedMovie = [];
  }
  displaySavedMovie();
}