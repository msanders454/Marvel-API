const marvelAPIURL = 'https://gateway.marvel.com/v1/public/characters?';

const privateKey = 'd6e4ae1a3f11ff88b50ee1638b26cef725dc7b5b';
const publicKey = '9e4d4d6d9251b1ecce38840bcb323b5d';
var ts = new Date().getTime();
var hash = md5(ts+privateKey+publicKey).toString();
var characterID = "";


function submitButton(){
	$('#submitButton').on('click', function(event){
    	event.preventDefault();
    	let query = $('.searchBar').val();
    	$('.searchBar').val("");
    	getAPIData_Characters(query, displayAPIData_Chars);
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

function submitButtonRandom(){
	$('#submitButtonRandom').on('click', function(event){
    	event.preventDefault();
    	let randomLetter = randomChar();
    	getAPIData_Characters_Random(randomLetter, displayAPIData_Chars);
    	$('.searchForm').hide();
      $('.results').css('display', 'inline-block');
    	$('.newSearchButton').css('display', 'block');
    	$('.thumbnailContainer').css('display', 'block');
        $('.shield').css('display', 'block');
    	$('.descriptionContainer').css('display', 'block');
    	$('.comicsContainer').css('display', 'inline');
       $('.url').css('display', 'block');
  });
}

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

function getAPIData_Characters(searchTerm, callback){
  const query = {
  		'name': `${searchTerm}`,
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

function displayAPIData_Chars(data){
  if(!data.data.results.length){
    alert('Not a reconizable name. Try another name');
    return;
  }
  if(data.data.results.length>1){
    let randomNum = getRandomIntTwo(0, data.data.results.length);

	let description = data.data.results[randomNum].description;

let name = data.data.results[randomNum].name;

	let imgPath = data.data.results[randomNum].thumbnail.path + "/standard_xlarge." + data.data.results[0].thumbnail.extension;

  let totalNum = data.data.results[randomNum].comics.available;
	let output = '<img src="' + imgPath + '">';
	characterID = data.data.results[randomNum].id;


	if(description === ""|| description === 'undefined'){
		$('#resultsTitle').append(data.data.results[randomNum].name);
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
$('.url').append("<a href='" + data.data.results[randomNum].urls[1].url + "'>Please Click Here for more information on this character");
}

else{
  $('.url').append("No Marvel page on this character. Please try another character.");
}
   
  }
else{

	let description = data.data.results[0].description;

let name = data.data.results[0].name;

	let imgPath = data.data.results[0].thumbnail.path + "/standard_xlarge." + data.data.results[0].thumbnail.extension;

  let totalNum = data.data.results[0].comics.available;
	let output = '<img src="' + imgPath + '">';
	characterID = data.data.results[0].id;


	if(description === ""|| description === 'undefined'){
		$('#resultsTitle').append(data.data.results[0].name);
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
$('.url').append("<a href='" + data.data.results[0].urls[1].url + "'>Please Click Here for more information on this character");
}

else{
  $('.url').append("No Marvel page on this character. Please try another character.");
}
}
}

function randomChar(){
  	var randomLetter = "";
  	var possible = "abcdefghijklmnopqrstuvwxyz";
    const charIndex = getRandomInt(0,25);
	  randomLetter += possible.charAt(charIndex);
  	return randomLetter;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min); 
}

function getRandomIntTwo(min, max) {

    random = Math.floor(Math.random() * (max - min + 1) + min); 
    return random;
}


function start(){
	submitButton();
	submitButtonRandom();
	newSearch();
	randomChar();
}

$(start);






