
//Marvel API Gateway
const marvelAPIURL = 'https://gateway.marvel.com/v1/public/characters?';

//Private and Public Keys
const privateKey = 'd6e4ae1a3f11ff88b50ee1638b26cef725dc7b5b';
const publicKey = '9e4d4d6d9251b1ecce38840bcb323b5d';

//Parameters need
var ts = new Date().getTime();
var hash = md5(ts+privateKey+publicKey).toString();
var characterID = "";

//Function made to show what happens when search button is pressed.
function searchButton(){
  $('.searchForm').on('submit', function(event){
  event.preventDefault();
  //Empty search list when button is pressed
  $('.searchList').html(``);
  //Allows query to be selected
  const queryEvent = $(event.currentTarget).find('input');
  const queryTerm = (queryEvent.val());
  //Created when user searches nothing
  if(queryTerm === ''){
    alert('Please write something');
     $('.searchResults').css('display', 'none');
  }
  else{
    fetch(marvelAPIURL + `ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=15&nameStartsWith=${queryTerm}`)
    .then(response => response.json())
    .then(responseJson => displaySearchResults(responseJson))
    .catch(err => {
      alert(`Something went wrong: ${err.message}`);
     })
   }
  //Used to empty search box after results load
  queryEvent.val("");
  });
}

//Function used to display user search opitions.
function displaySearchResults(data) {
  console.log(data);
  const list = data.data.results;
  //Used when user searchs not recognizable name.
  if (list.length === 0 ) {
    $('.searchList').append(`
      <div class="search-result">
        Character not found. Please search again.
      </div>
    `);
  }
  //Makes Results not hidden
 $('.searchResults').css('display', 'block');
 //Displays json data for user to click
 for (let i = 0; i < list.length; i++) {
    $('.searchList').append(`
    <div class="search-result">
      <a href="#" class="result-name">${list[i].name}</a>
    </div>
    `);
  }
}


//Find name that the user selects
function watchResultClick() {
  $(document).on('click', '.result-name', function(event) {
    event.preventDefault();
    //Find Parameters for Api
    const queryEvent = $(event.currentTarget);
    const queryTerm = (queryEvent.html());
    //Hides names
    $('.searchResults').css('display', 'none');
    //Calls API
    getAPIData_Characters(queryTerm, displayAPIData_Chars);
    //Shows next page of information
      $('.searchForm').hide();
      $('.results').css('display', 'block');
      $('.newSearchButton').css('display', 'block');
      $('.thumbnailContainer').css('display', 'block');
      $('.shield').css('display', 'block');
      $('.descriptionContainer').css('display', 'block');
      $('.comicsContainer').css('display', 'block');
      $('.url').css('display', 'block');
    
  });
}

//Function used to find random
function searchButtonRandom(){
  $('#searchButtonRandom').on('click', function(event){
  event.preventDefault();
  let randomLetter = randomChar();
  getAPIData_Characters_Random(randomLetter, displayAPIData_CharsRandom);
  $('.searchForm').hide();
  $('.searchResults').hide();
  $('.results').css('display', 'inline-block');
  $('.newSearchButton').css('display', 'block');
  $('.thumbnailContainer').css('display', 'block');
  $('.shield').css('display', 'block');
  $('.descriptionContainer').css('display', 'block');
  $('.comicsContainer').css('display', 'inline');
  $('.url').css('display', 'block');
  });
}

//Function usd to hide and empty all information and return make to search screen.
function newSearch(){
  $('.newSearchButton').on('click', function(event){
  event.preventDefault();
  $('.searchForm').show();
  $('.thumbnailContainer').empty();
  $('.characterDescription').empty();
  $('.numberOfComics').empty();
  $('.comicSeries').empty();
  $('.url').empty();
  $('#resultsTitle').empty();
  $('.results').css('display', 'none');
  $('.newSearchButton').css('display', 'none');
  $('.shield').css('display', 'none');
  $('.thumbnailContainer').css('display', 'none');
  $('.descriptionContainer').css('display', 'none');
  $('.comicsContainer').css('display', 'none');
  $('.url').css('display', 'none');
	});
}
 // Next 2 functions helps call the API so results can be displayed
function getAPIData_Characters(searchTerm, callback){
  const query = {
    'name': searchTerm,
    'ts': ts,
    'apikey': publicKey,
    'hash': hash
  };
  $.getJSON(marvelAPIURL, query, callback);
}


function getAPIData_Characters_Random(randomLetter, callback){
  const query = {
    'nameStartsWith': randomLetter,
    'limit': 100,
    'ts': ts,
    'apikey': publicKey,
    'hash': hash
  };
  $.getJSON(marvelAPIURL, query, callback);
}


//Function used to display API data First part displays random resulst
function displayAPIData_CharsRandom(data){
  let charcterData = data.data.results.length;
  if(charcterData>1){
  let randomNum = getRandomIntTwo(0, (charcterData-1));
  let description = data.data.results[randomNum].description;
  let name = data.data.results[randomNum].name;
  let imgPath = data.data.results[randomNum].thumbnail.path + "/standard_xlarge." + data.data.results[0].thumbnail.extension;
  let totalNum = data.data.results[randomNum].comics.available;
  let output = '<img src="' + imgPath + '">';
  characterID = data.data.results[randomNum].id;
  if(!description){
    $('#resultsTitle').append(name);
    $('.thumbnailContainer').append(output);
    let noDescription = "Marvel does not provide a description for this character. Try clicking on the link below";
    $('.characterDescription').append(noDescription);
   }
  else{
    $('#resultsTitle').append(name);
    $('.thumbnailContainer').append(output);
    $('.characterDescription').append(description);
  }
  $('.numberOfComics').append(data.data.results[randomNum].comics.available);
  for(i = 0; i<data.data.results[randomNum].series.items.length; i++){
    $('.comicSeries').append("<li>"+ data.data.results[randomNum].series.items[i].name + "</li>");
   }
    if(data.data.results[randomNum].urls[1].type === 'wiki'){
    $('.url').append("<a href='" + data.data.results[randomNum].urls[1].url + "' target='_blank'>Please Click Here for more information on this character");
  }
  else{
    $('.url').append("No Marvel page on this character. Please try another character.");
  } 
 }
}

//Used when for submit opition
function displayAPIData_Chars(data){
  let description = data.data.results[0].description;
  let name = data.data.results[0].name;
  let imgPath = data.data.results[0].thumbnail.path + "/standard_xlarge." + data.data.results[0].thumbnail.extension;
  let totalNum = data.data.results[0].comics.available;
  let output = '<img src="' + imgPath + '">';
  characterID = data.data.results[0].id;
  if(description === ""|| description === 'undefined'){
    $('#resultsTitle').append(name);
    $('.thumbnailContainer').append(output);
    let noDescription = "Marvel does not provide a description for this character. Try again later";
    $('.characterDescription').append(noDescription);
   }
   else{
     $('#resultsTitle').append(name);
     $('.thumbnailContainer').append(output);
     $('.characterDescription').append(description);
   }
    $('.numberOfComics').append(data.data.results[0].comics.available); 
    for(i = 0; i<data.data.results[0].series.items.length; i++){
      $('.comicSeries').append("<li>"+ data.data.results[0].series.items[i].name + "</li>");
    }
    if(data.data.results[0].urls[1].type === 'wiki'){
      $('.url').append("<a href='" + data.data.results[0].urls[1].url + "' ' target='_blank'>Please Click Here for more information on this character");
    }
    else{
      $('.url').append("No Marvel page on this character. Please try another character.");
    }
  }


//Function to find random letter
function randomChar(){
  var randomLetter = "";
  var possible = "abcdefghijklmnopqrstuvwxyz";
  const charIndex = getRandomInt(0,25);
  randomLetter += possible.charAt(charIndex);
  return randomLetter;
}


//Function used to find random number to locat random letter
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min); 
}


//Random letter number 2 for second round to help find random
function getRandomIntTwo(min, max) {
  random = Math.floor(Math.random() * (max - min + 1) + min); 
  return random;
}

//Function used to start other functions
function start(){
  watchResultClick()
  searchButton();
  searchButtonRandom();
  newSearch();
  randomChar();
}

$(start);






