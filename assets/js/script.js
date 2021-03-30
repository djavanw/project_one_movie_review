const movieApiKey = "f3192513";
//Reminder, below tow line are pure JavaScript variables
var searchInputEl = document.querySelector("#searchInput");
var searchNewBtnEl = document.querySelector("#searchBtn");

var thumbnailEl = $("#thumbnail");
var yearEl = $("#year");
var titleEl = $("#title");
var ratingsEl0 = $("#ratings0");
var ratingsEl1 = $("#ratings1")
var ratingsEl2 = $("#ratings2")
var plotSumEl = $("#plot");
var plotText;

var modalEl = document.getElementById("errorModal");
var closeModalEl = document.getElementById("closeModal");

//Globabl variables for local storage for movie names
var storageMovie = [];
var previousSearchesBox = $("#previousSearches");
var userSelection;

// var requestOptions = {
//     method: "Get",
//     redirect: "Follow"
// };

//Function to start the movie from text search
function textSearch(event) {
    console.log(event);
    resetPage();
    var omdbUrlFront = "https://www.omdbapi.com/?apikey=" + movieApiKey + "&t=";
    userSelection = searchInputEl.value;
    var completeUrl = omdbUrlFront + userSelection;
    console.log(userSelection);

    //Checking localstorage for match & storage pull
    if(storageMovie.indexOf(userSelection) === -1) {
        storageMovie.push(userSelection);
        localStorage.setItem("storageMovie", JSON.stringify(storageMovie));
        pullStorageMovie();
    }

    fetch(completeUrl)
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        console.log(data);
       if (data.Response === "True") {
            plotText = data.Plot;
            thumbnailEl.attr("src", data.Poster);
            titleEl.text(data.Title);
            yearEl.text(data.Released);
            plotSumEl.text(plotText);
            for (var i = 0; i < data.Ratings.length; i++) {
                $(`#ratings${i}`).text(`${data.Ratings[i].Source}: ${data.Ratings[i].Value}`);
           }
        } else {
            //Modal error message for wrong information
             modalEl.style.display = "block";
             closeModalEl.addEventListener("click", turnModalOff);
             window.addEventListener("click", turnModalOff);
        }

        function turnModalOff() {
            modalEl.style.display = "none";
        }

        //Movie Trailer Pull from text search
        const imdbKey = "k_ogun1xnq/";
        var imdbFront = "https://imdb-api.com/en/API/Trailer/" + imdbKey;
        var trailerId = data.imdbID;
        var imdbUrl = imdbFront + trailerId;
        console.log(trailerId);
        console.log(imdbUrl);
        fetch(imdbUrl)
            .then(function (response) {
                return response.json()
            })
            .then(function (data) {
                console.log(data);
                var movieTrailerEl = $("#trailer-url");
                movieTrailerEl.attr("href", data.link);
                console.log(movieTrailerEl.attr);
            });
    })
}

//Function to start the movie search with button
function searching(event) {
    resetPage();
    console.log(event);
    var omdbUrlFront = "https://www.omdbapi.com/?apikey=" + movieApiKey + "&t=";
    var completeUrl = omdbUrlFront + event.target.outerText;
    console.log(completeUrl);
    console.log(userSelection);

    pullStorageMovie();  //You may need to put this back in the above function


    fetch(completeUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log(data);
           if (data.Response === "True") {
                plotText = data.Plot;
                thumbnailEl.attr("src", data.Poster);
                titleEl.text(data.Title);
                yearEl.text(data.Released);
                plotSumEl.text(plotText);
                for (var i = 0; i < data.Ratings.length; i++) {
                    $(`#ratings${i}`).text(`${data.Ratings[i].Source}: ${data.Ratings[i].Value}`);
               }
            } else {
                 modalEl.style.display = "block";
                 closeModalEl.addEventListener("click", turnModalOff);
                 window.addEventListener("click", turnModalOff);

           }

            function turnModalOff() {
                modalEl.style.display = "none";
            }

            //imdbipa pull from previous button pull
            const imdbKey = "k_ogun1xnq/";
            var imdbFront = "https://imdb-api.com/en/API/Trailer/" + imdbKey;
            var trailerId = data.imdbID;
            var imdbUrl = imdbFront + trailerId;
            fetch(imdbUrl)
                .then(function (response) {
                    return response.json()
                })
                .then(function (data) {
                    // console.log(data);
                    var movieTrailerEl = $("#trailer-url");
                    movieTrailerEl.attr("href", data.link);
                    // console.log(movieTrailerEl.attr);
                });
        });
}


//Function to pull movie name from storage
function pullStorageMovie() {
    previousSearchesBox.html("");
    if(localStorage.getItem("storageMovie")) {
        storageMovie = JSON.parse(localStorage.getItem("storageMovie"));
        for (let k = 0; k < storageMovie.length; k++) {
            var userInputTrimmed = $('<button class="previousSearchItemBtn" type="button">');
            console.log(userInputTrimmed);
            var value = $(this).text();
            console.log(value);
            userInputTrimmed.text(storageMovie[k]);
            userInputTrimmed.on("click", searching);
            previousSearchesBox.append(userInputTrimmed);    
        }
    }
}

pullStorageMovie();

//Starts a search from the text input field
searchNewBtnEl.addEventListener("click", textSearch);

//Page Reset
function resetPage() {
    $("#thumbnail").attr("src", "assets/images/posterPlaceholderImg.png");
    $("#title").text("");
    $("#year").text("");
    $("#plot").text("");
    $("#ratings0").text("");
    $("#ratings1").text("");
    $("#ratings2").text("");
    $("#plotTranslate").text("");
}


//Yoda Translation
function translateYoda() {
    var URL = `https://api.funtranslations.com/translate/yoda.json?text=${plotText}`
    axios.get(URL)
        .then(function (response) {
            $("#plotTranslate")
                .css("display", "inline")
                .text(response.data.contents.translated)
        })
}

$("#yodaBtn").on("click", function () {
    translateYoda();
})

//Minion Translation
function translateMinion() {
    var URL = `https://api.funtranslations.com/translate/minion.json?text=${plotText}`
    axios.get(URL)
        .then(function (response) {
            $("#plotTranslate")
                .css("display", "inline")
                .text(response.data.contents.translated)
        })
}

$("#minionBtn").on("click", function () {
    translateMinion();
})

//Pirate Translation
function translatePirate() {
    var URL = `https://api.funtranslations.com/translate/pirate.json?text=${plotText}`
    axios.get(URL)
        .then(function (response) {
            $("#plotTranslate")
                .css("display", "inline")
                .text(response.data.contents.translated)
        })
}

$("#pirateBtn").on("click", function () {
    translatePirate();
})

//Klingon Translation
function translateKlingon() {
    var URL = `https://api.funtranslations.com/translate/klingon.json?text=${plotText}`
    axios.get(URL)
        .then(function (response) {
            $("#plotTranslate")
                .css("display", "inline")
                .text(response.data.contents.translated)
        })
}

$("#klingonBtn").on("click", function () {
    translateKlingon();
})

//Groot Translation
function translateGroot() {
    var URL = `https://api.funtranslations.com/translate/groot.json?text=${plotText}`
    axios.get(URL)
        .then(function (response) {
            $("#plotTranslate")
                .css("display", "inline")
                .text(response.data.contents.translated)
        })
}

$("#grootBtn").on("click", function () {
    translateGroot();
})