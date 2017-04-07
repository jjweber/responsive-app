// Variables
var submit = document.querySelector('.js-search-button');
var searchField = document.querySelector('.js-search-field');
//var resultEl = document.querySelector('.results');
var apiKey = "89629247aa3c362dd969166b19dec207";

// Defining a variable to hold the location of which page you are on.
var page = document.location.pathname;

// Creating on load event to add default comics to screen when page loads.
function setup() {
  defaultRequest(`https://gateway.marvel.com:443/v1/public/characters?apikey=${apiKey}&name=avengers&limit=10&offset=0`);
}
window.addEventListener("load", setup, true);


// Creating a keyup event to handle a case where the user presses enter instead of clicking the button.
window.addEventListener("keyup", function(e) {
  document.getElementById("searchField");
  event.preventDefault();
  if (event.keyCode == 13) {
    submit.click();
  }
});

// Creating event listener that listens for the click of the search button.
submit.addEventListener('click', function(e) {
  if (!searchField.value == "" ) {
    // Calling my makeRequest function and passing it api url with perameters and apikey.
    makeRequest(`https://gateway.marvel.com:443/v1/public/characters?apikey=${apiKey}&name=${searchField.value}&limit=10&offset=0`);
  } else {
    alert("Sorry, You left the input blank Please enter a name to search for!");
    searchField.focus();
  }
})


// Creating a function to make a request to get the default comics for onload event.
function defaultRequest(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var apiData = JSON.parse(request.responseText)
      console.log(apiData.data.results);
      renderDefault(apiData.data.results);
    }
    else {
      console.log('response error', request);
    }
  }
  request.onerror = function() {
  console.log('connection error');
}

request.send();
}

// Creating function to display my default data to the screen.
// Loops through each comic found and performs api call for each with addBookInfoToPageFromUrl function.
function renderDefault(characters) {
  characters.forEach( (character, index, array) => {
    console.log(character.name);
    // Creating for loop to add the comics found, but only display a max of 10.
    for (var i = 0; i < character.comics.items.length && i < 10; i++) {
      // To get comics it needs a character id. Calling function that will retrieve the comic covers
      //from marvel api and passing it a url with the id and my apikey.
      addBookInfoToPageFromUrl(`${character.comics.items[i].resourceURI}?apikey=${apiKey}`);
    }
  })
}


// Creating a function to make a request and get data from marvel api.
function makeRequest(url) {
  // Creating request.
  var request = new XMLHttpRequest();
  // Opening the request and performing a get request.
  request.open('GET', url, true);

  // Creating onload function to handle request status.
  request.onload = function() {
    // If it recieves a request between 200 and 400 it will continue.
    if (request.status >= 200 && request.status < 400) {
      // Creating a variable to hold my parsed json data.
      var apiData = JSON.parse(request.responseText)
      console.log(apiData.data.results);
      if (apiData.data.results.length > 0) {
        // Calling function to render results
        renderPage(apiData.data.results);
        document.getElementById("textarea").value="";
      }
      else {
        alert("Sorry we couldn't find anything by that in the database. Please try something else or check the grammer!");
        searchField.focus();
      }
    }
    else {
      console.log('response error', request);
    }
  }
  request.onerror = function() {
    console.log('connection error');
  }

  request.send();
}


// Creating function to display my data to the screen.
function renderPage(characters) {
  characters.forEach( (character, index, array) => {
    // Getting the h1 span by id and adding the searched name to it.
    document.getElementById('searchTitle').innerHTML = character.name;
    console.log(character.name);
    // Creating for loop to add the comics found, but only display a max of 10.
    for (var i = 0; i < character.comics.items.length && i < 10; i++) {
      // To get comics it needs a character id. Calling function that will retrieve the comic covers
      //from marvel api and passing it a url with the id and my apikey.
      addBookInfoToPageFromUrl(`${character.comics.items[i].resourceURI}?apikey=${apiKey}`);
    }
  })
}

// Need additional info so doing another call to marvel api for comic covers.
// Creating a function that is passed a url containing my apikey and the characters id.
function addBookInfoToPageFromUrl(url) {
  // Getting ul element by its id of bookcontainer.
  var bookContainer = document.getElementById('bookContainer');
  // Removing old searched data from bookcontainer if it exists.
  while (bookContainer.hasChildNodes()) {
    bookContainer.removeChild(bookContainer.firstChild);
  }
  // Creating a new request.
  var request = new XMLHttpRequest();
  // Opening the request and performing a get request.
  request.open('GET', url, true);

  // Creating onload function to handle request status.
  request.onload = function() {
    // If it recieves a request between 200 and 400 it will continue.
    if (request.status >= 200 && request.status < 400) {
      // Creating a variable to hold my parsed json data.
      var comic = JSON.parse(request.responseText);
      // Creating variable to hold an array of all the comic covers
      var comicInfo = comic.data.results[0];

      console.log("Comic Info to build from: ", comicInfo);

      // If the array holds any comic covers this will build an li for it.
      if(comicInfo.images.length > 0) {
        // Creating a variable to hold the comic covers url path with large size and adding the file type with .extention from data.
        var imgPath = comicInfo.images[0].path + '/standard_xlarge.' + comicInfo.images[0].extension;
        // Creating variable to hold the built img element.
        var imgHtml = '<img src="' + imgPath + '">'+ '<h3>' + comicInfo.title + '</h3>';

        // Creating variable to hold the new created li.
        var listItem = document.createElement('li');
        // Setting the html for the li to the <img> saved in imgHtml variable.
        listItem.innerHTML = imgHtml;
        // Appending the new html to the bookContainer ul.
        bookContainer.appendChild(listItem);
      }

    }
    else {
      console.log('response error', request);
    }
  }
  request.onerror = function() {
    console.log('connection error');
  }

  request.send();
}
