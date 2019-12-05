var MOVIE_API_KEY = "b8b1cbd1a650b2275b390798b433b611";

var searchForm = document.getElementById("search-form");
var input = document.getElementById("search-input");
var movieInfo = document.getElementById("movie-info");
var movieTitle = document.getElementById("movie-title");
var movieYear = document.getElementById("movie-year");
var movieGenre = document.getElementById("movie-genre");
var movieRuntime = document.getElementById("movie-runtime");
var productionStudio = document.getElementById("production-studio");
var moviePlot = document.getElementById("movie-plot");
var moviePoster = document.getElementById("moviePoster");
var moviePoster = document.getElementById("movie-poster");
var savedSection = document.getElementById("saved-movie-list");
var movieTrailer = document.getElementById("trailer");
var prompt = document.getElementById("home-prompt");

var movieList = document.getElementById("movie-list");
var searchList = document.getElementById("search-list");
var saveData = document.getElementById("save-data");

var savedMovie = [];
var movieName;
var movieID;
var nowplayingID;

loadDataQueries();
nowPlaying();

function nowPlaying(){
  var url = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + MOVIE_API_KEY + "&language=en-US&page=1";
  queryNowPlayingAPI(url);
}

function integrateUrl(query) {
    var url = "https://api.themoviedb.org/3/search/movie?api_key=" + MOVIE_API_KEY + "&query=" + query;
    queryAPI(url, query);
  }

function queryAPI(url, query) {
  fetch(url)
  .then(function (response) {
    response.json().then(function (data) {
      if (response.status === 200) {
        displaySearchMovie(data.results);
      } else {
        movieInfo.classList.add("hidden");
        console.error('error', data);
      }
    });
  });
}
document.getElementById("collapser").addEventListener("click", function (e){
  console.log("clicky", 1);
  document.getElementById("collapser").classList.toggle("collapsed");
  document.getElementById("collapse-bar").classList.toggle("show");
});

function detailUrl(query) {
    var url = "https://api.themoviedb.org/3/movie/" + query + "?api_key=" + MOVIE_API_KEY;
    queryDetailAPI(url);
    /* var recUrl = "https://api.themoviedb.org/3/movie/" + query + "/recommendations?api_key=" + MOVIE_API_KEY;
    queryRecAPI(recUrl); */
    var trailerUrl = "https://api.themoviedb.org/3/movie/" + query + "/videos?api_key=" + MOVIE_API_KEY + "&language=en-US"
    queryVideoAPI(trailerUrl);
}

function queryDetailAPI(url) {
    fetch(url)
    .then(function (response) {
      response.json().then(function (data) {
        if (response.status === 200) {
          clearSearch();
          movieInfo.classList.remove("hidden");
          movieTitle.textContent = data.original_title;
          movieName = data.original_title;
          movieYear.textContent = data.release_date;
          movieID = data.id;
          console.log('id', data.id);
          moviePlot.textContent = data.overview;
          console.log('photo', data.poster_path);
          if (data.poster_path != null) {
            moviePoster.src = "https://image.tmdb.org/t/p/w500/" + data.poster_path;
          } else {
            moviePoster.src = "No-Photo-Available.png";
          }
            var x = "";
            var studio = "";
            for (i = 0; i < data.genres.length; i++) {
                x += data.genres[i].name;
                if(i < (data.genres.length) - 1){
                  x += ", ";
                }
            }
            movieGenre.textContent = x;
            if (data.runtime == null) {
              movieRuntime.textContent = "Not Avaliable";
            } else {
              movieRuntime.textContent = data.runtime + " minutes";
            }

            for (i = 0; i < data.production_companies.length; i++) {
                studio += data.production_companies[i].name;
                if(i < (data.production_companies.length) - 1){
                  studio += "; ";
                }
            }
            if(data.production_companies.length === 0){
              studio += "information not available";
            }
            productionStudio.textContent = studio;

        } else {
          movieInfo.classList.add("hidden");
          recList.classList.add("hidden");
          console.error('error', data);
        }
      });
    });
  }

function queryNowPlayingAPI(url){
    fetch(url)
      .then(function (response) {
        response.json().then(function (data) {
        if (response.status === 200) {
          for(var x = 0; x < 6; x+=1){
            var rec = "rec-";
            var conStr = rec.concat('', x);
            console.log("concat", conStr);
            var posterButton = document.createElement("button");
            posterButton.setAttribute("id", "pork" + x);
            console.log("title", data.results[x].original_title);
            var poster = document.createElement("img");
            poster.src = "https://image.tmdb.org/t/p/w500/" + data.results[x].poster_path;
            poster.style.width = "100px";
            var movieIDNow = data.results[x].id;
            nowplayingID = movieIDNow;
            console.log("id", movieIDNow);
            posterButton.appendChild(poster);
            posterButton.addEventListener("click", returnButton(movieIDNow));
            document.getElementById(conStr).appendChild(posterButton);
          }
        } else{
          console.log("error", data);
      }
    });
    });
}

function returnButton(id){
  return function(e){
    detailUrl(id)};
}

function queryVideoAPI(url) {
  fetch(url)
  .then(function (response) {
    response.json().then(function (data) {
      if (response.status === 200) {

        console.log('trailer', data.results[0].key);
        movieTrailer.setAttribute("src", "https://www.youtube.com/embed/" + data.results[0].key + "?autoplay=1&mute=1")
      } else {

        console.error('error', data);
      }
    });
  });
}

  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var query = input.value;
    movieInfo.setAttribute("class", "hidden");
    clearSearch();
    integrateUrl(query);
  });

  saveData.addEventListener("click", function(e) {
    e.preventDefault();

    var name = movieName;
    var id = movieID;

    if (!savedMovie.some(function(item){return item[name] === id;})) {
      console.log("nope", id)
      console.log("nope2", Object.keys(savedMovie))
      writeDataQueries(name, id);
    } 
  });


function writeDataQueries(queryName, queryID) {
  savedMovie.push({[queryName]: queryID});
  console.log("saved", savedMovie);

  changeQueries();
}

function removeMovieList(inputValue) {
  console.log("key", inputValue)
  var filteredList = savedMovie.filter(function (item) {
      return Object.values(item).includes(inputValue) === false;
  });
  savedMovie = filteredList;

  changeQueries();
}

function changeQueries() {
  var queryJson = JSON.stringify(savedMovie);
  localStorage.setItem("movie-query", queryJson);
  displaySavedMovie();
}

function displaySavedMovie() {
  if (savedMovie.length === 0) {
    savedSection.classList.add("hidden");
  } else {
    savedSection.classList.remove("hidden");
  }
  movieList.innerHTML = "";
  savedMovie.forEach(function (item) {
      var movieElement = document.createElement("li");
      movieElement.setAttribute("class", "list-group-item")
      var listName = document.createElement("button");
      listName.setAttribute("class", "btn btn-link shift");
      var keyName;
      var id;
      for (var key in item) {
        console.log(key, item[key])
        keyName = key;
        id = item[key];
      }
      listName.innerHTML = keyName;
      listName.addEventListener("click", function(e) {
          detailUrl(id);
          movieName = keyName;
          input.value = keyName;
      });

      var removeMovie = document.createElement("button");
      removeMovie.setAttribute("class", "btn btn-danger remove");
      removeMovie.innerHTML = "Remove";
      removeMovie.addEventListener("click", function (e) {
          removeMovieList(id);
      });

      movieElement.appendChild(listName);
      movieElement.appendChild(removeMovie);
      movieList.appendChild(movieElement);
  });
}


function displaySearchMovie(inputResults) {
  console.log("result", inputResults);
  inputResults.forEach(function (item) {
      var searchElement = document.createElement("div");
      searchElement.setAttribute("class", "col-md-6 col-lg-6");
      var clickImg = document.createElement("div");
      var resultImg = document.createElement("img");

      if (item.poster_path != null) {
        resultImg.setAttribute("src", "https://image.tmdb.org/t/p/w500/" + item.poster_path);
      } else {
        resultImg.setAttribute("src", "No-Photo-Available.png");
      }
      
      resultImg.setAttribute("class", "search-image");
      clickImg.setAttribute("class", "img-wrap")
      var box = document.createElement("div");
      box.setAttribute("class", "img-text");

      var clickTitle = document.createElement("a");
      var resultTitle = document.createElement("h2");
      resultTitle.setAttribute("class", "search-title");
      
      resultTitle.textContent = item.original_title;
      var resultVote = document.createElement("h3");
      resultVote.textContent = "Score: " + item.vote_average;
      var resultDate = document.createElement("h4");
      resultDate.textContent = "Release Date: " + item.release_date;

      clickImg.appendChild(resultImg);
      clickTitle.appendChild(resultTitle);
      
      box.appendChild(resultVote);
      box.appendChild(resultDate);
      clickImg.appendChild(box);
      searchElement.appendChild(clickImg);
      searchElement.appendChild(clickTitle);
      searchList.appendChild(searchElement);
      clickImg.addEventListener("click", function(e) {
        detailUrl(item.id);
      });
      clickTitle.addEventListener("click", function(e) {
        detailUrl(item.id);
      });
      
  });
}

function loadDataQueries() {
  try {
      var queryJson = localStorage.getItem("movie-query");
      var queries = JSON.parse(queryJson) || [];
      savedMovie = queries;
  } catch(e) {
      savedMovie = [];
  }
  displaySavedMovie();
}

function clearSearch() {searchList.innerHTML = ""} 

function $(x) {
  return document.getElementById(x);
}
