var MOVIE_API_KEY = "b8b1cbd1a650b2275b390798b433b611";

var searchForm = document.querySelectorAll(".search-form");
var input = document.querySelectorAll(".search-input");
var movieInfo = document.querySelectorAll(".movie-info");
var movieTitle = document.querySelectorAll(".movie-title");
var movieYear = document.querySelectorAll(".movie-year");
var movieGenre = document.querySelectorAll(".movie-genre");
var movieRuntime = document.querySelectorAll(".movie-runtime");
var moviePoster = document.querySelectorAll(".moviePoster");
var revenue = document.querySelectorAll(".revenue");
var popularity = document.querySelectorAll(".popularity");
var voteAverage = document.querySelectorAll(".vote-average");
var voteCount = document.querySelectorAll(".vote-count");

//var movieList = document.getElementById("movie-list");

var movieName = [];

//loadDataQueries();
document.getElementById("collapser").addEventListener("click", function (e){
  console.log("clicky", 1);
  document.getElementById("collapser").classList.toggle("collapsed");
  document.getElementById("collapse-bar").classList.toggle("show");
});

function integrateUrl(query, i) {
    var url = "https://api.themoviedb.org/3/search/movie?api_key=" + MOVIE_API_KEY + "&query=" + query;
    queryAPI(url, i, query);
  }

function queryAPI(url, i, query) {
  fetch(url)
  .then(function (response) {
    response.json().then(function (data) {
      if (response.status === 200) {
        var exact = 0;
        var x;
        for(x = 0; x < data.results.length; x++){
          var areEqual = data.results[x].original_title.toUpperCase() === query.toUpperCase();
          if(areEqual){
            exact = x;
            break;
          }
        }
        console.log('index', exact);
        movieInfo[i].classList.remove("hidden");
        movieTitle[i].textContent = data.results[exact].original_title;
        movieName[i] = data.results[exact].original_title;
        movieYear[i].textContent = data.results[exact].release_date;
        console.log('id', data.results[exact].id);
        moviePoster[i].src = "https://image.tmdb.org/t/p/w500/" + data.results[exact].poster_path;
        detailUrl(data.results[exact].id, i);
      } else {
        movieInfo[i].classList.add("hidden");
        console.error('error', data);
      }
    });
  });
}

function detailUrl(query, i) {
    var url = "https://api.themoviedb.org/3/movie/" + query + "?api_key=" + MOVIE_API_KEY;
    queryDetailAPI(url, i);
}

function queryDetailAPI(url, j) {
    fetch(url)
    .then(function (response) {
      response.json().then(function (data) {
        if (response.status === 200) {
            var x = "";
            var studio = "";
            for (i = 0; i < data.genres.length; i++) {
                x += data.genres[i].name;
                if(i < (data.genres.length) - 1){
                  x += ", ";
                }
            }
            movieGenre[j].textContent = x;
            if(data.revenue !== 0){
              revenue[j].textContent = "$" + data.revenue;
            }
            else{
              revenue[j].textContent = "not available";
            }
            popularity[j].textContent = data.popularity;
            voteAverage[j].textContent = data.vote_average;
            voteCount[j].textContent = data.vote_count;
            movieRuntime[j].textContent = data.runtime + " minutes";
        } else {
          movieInfo[j].classList.add("hidden");
          console.error('error', data);
        }
      });
    });
  }

searchForm[0].addEventListener("submit", function (e) {
    e.preventDefault();
    var query = input[0].value;
    integrateUrl(query, 0);
});

searchForm[1].addEventListener("submit", function (e) {
    e.preventDefault();
    var query = input[1].value;
    integrateUrl(query, 1);
});