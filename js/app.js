//Global Scope				
var flippedCard = []; 
var leaderboard = [];
var moves = 0;
var clockOff = true;
var clockId;
var time = 0;
var matched = 0;
var minutes = 0;
var seconds = 0;
var	starRemoved = 0;
var starCount = 3;
const deck = document.querySelector('.deck');
const leaderboardPanel = document.querySelector('.leaderboard');
const leaderboardTable = document.querySelector('.leaderboard-table');

//Localstorage inizialization
localStorage.setItem('moves', 0);
localStorage.setItem('stars', 0); 
localStorage.setItem('time', 0);



//Objects of the deck
const objects = ['fa-diamond', 'fa-diamond', 
				'fa-paper-plane-o', 'fa-paper-plane-o', 
				'fa-anchor', 'fa-anchor', 
				'fa-bolt', 'fa-bolt', 
				'fa-cube', 'fa-cube', 
				'fa-leaf', 'fa-leaf', 
				'fa-bomb', 'fa-bomb',
				'fa-bicycle', 'fa-bicycle'];

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//Keylister, press R to reload the game
document.addEventListener('keypress', (event) => {
  const toggleStatus = document.querySelector('.modal__background');
  var keyName = event.key;
  if(keyName == 'r'){
	  if(!toggleStatus.classList.contains('modal__hide')) {
		  toggleStatus.classList.add('modal__hide');
	  }
	  resetGame();

  }
});

//Event Listener for the modal button
document.querySelector('.modal__cancel').addEventListener('click', () => {
	toggleModal();
})
document.querySelector('.modal__retry').addEventListener('click', () => {
	resetGame();
	toggleModal();
})

//Event Listener for the reset button
document.querySelector('.restart').addEventListener('click', () => {
	resetGame();
})
 
//Get objects, pass them to the shuffle function, generate a new LI and append it to the deck  
function shuffleDeck() {
  const shuffledCards = shuffle(objects);
  for(card of shuffledCards){
    var newCard = document.createElement("li");
	newCard.classList.add('card');
	newCard.innerHTML = `<i class="fa ${card}"></i>`;
	deck.appendChild(newCard);
  }
} 

//First shuffle
shuffleDeck();

//Listen to the card inside the class deck
deck.addEventListener('click', event =>  {
	const clickTarget = event.target;
	if(clickValid(clickTarget)){
		//Start the clock on the first click
		if(clockOff) {
			startClock();
			clockOff = false;
		}
		flipCard(clickTarget);
		addflipCard(clickTarget);
		//If the user has clicked two cards, check if the match, add a new move and check the score to update the stars
		if (flippedCard.length === 2){
			checkForMatch(clickTarget);
			addMove();
			checkScore();
		}
	}
});

//Simulate the flip of the card on the user click, I use toggle instead of add and remove
function flipCard(card) {
	card.classList.toggle('open');
	card.classList.toggle('show');
	card.classList.remove('wrong');
}

//Push the Flipped Card to the array, to check later if they match;
function addflipCard(card) {
	flippedCard.push(card);
}

//Check for match, if the className are the same
function checkForMatch() {
	if (flippedCard[0].firstElementChild.className === flippedCard[1].firstElementChild.className) {
		flippedCard[0].classList.toggle('match');
		flippedCard[1].classList.toggle('match');
		matched++;
		if(matched === 8){
				youWin();
			}
		flippedCard = []
	} else {
			flippedCard[0].classList.add('wrong');
			flippedCard[1].classList.add('wrong');
			setTimeout(() => {
			flipCard(flippedCard[0]);
			flipCard(flippedCard[1]);
			flippedCard = [];
		}, 500);
	}
}


//Check if the click contains a class called card and it's not already matched. Also it works only if the array is less than two
function clickValid(clickTarget) {
	return (
		clickTarget.classList.contains('card') && !clickTarget.classList.contains('match') && flippedCard.length < 2 && !flippedCard.includes(clickTarget)
	);
}

//Add a new move after that two cards are flipped
function addMove(){
	moves++;
	const movesText = document.querySelector('.moves');
	movesText.innerHTML = moves;
}

//Check if the moves are equals to 15,25,30 and trigger the function
function checkScore() {
	if (moves === 15 || moves === 25 || moves == 30){
		removeStar();
	}
}

//remove star
function removeStar(){
	const starList = document.querySelectorAll('.stars i');
	for(star of starList){
		if (!star.classList.contains('star__hide')) {
		star.classList.add('star__hide');
		starCount--;
		break;
		}
	}
}

//start clock on first click
function startClock() {
	clockId = setInterval(() => {
		time++;
		displayTime();
	}, 1000);
}

//update time
function displayTime() {
	const clock = document.querySelector('.clock');
	minutes = Math.floor(time / 60);
	seconds = time % 60;
 	if (seconds < 10) {
		clock.innerHTML = `${minutes}:0${seconds}`;
	} else {
		clock.innerHTML = `${minutes}:${seconds}`;
	} 
}

//stopclock
function stopClock() {
	clearInterval(clockId);
}

//show or hide modal
function toggleModal() {
	const modal = document.querySelector('.modal__background');
	modal.classList.toggle('modal__hide');
}


//write stats into modal
function writeModalStats() {
	const timeStat = document.querySelector('.modal__time');
	const clockTime = document.querySelector('.clock').innerHTML;
	const movesStat = document.querySelector('.modal__moves');
	const starsStat = document.querySelector('.modal__stars');
	
	const stars = getStars();
	
	starsStat.innerHTML = `Stars: ${stars}`;
	movesStat.innerHTML = `Moves: ${moves}`;
	timeStat.innerHTML = `Time = ${clockTime}`;
}

//get the number of stars
function getStars() {
	stars = document.querySelectorAll('.stars i');
	for (star of stars) {
		if(!star.classList.contains('star__hide')){
			starRemoved++;
		}
	}
	return starRemoved;
}

//reset the game, the time and moves counter, stops the clock and reset the stars. Also reset the flippedCard
function resetGame() {
	stopClock();
	clockOff = true;
	time = 0;
	moves = 0;
	seconds = 0;
	starRemoved = 0;
	displayTime();
	document.querySelector('.moves').innerHTML = moves;
	stars = 0;
	const starList = document.querySelectorAll('.stars i');
	for(star of starList) {
		star.classList.remove('star__hide');
	}
	resetCards(); 
	flippedCard = []; 
} 



//Game over
function youWin(){
 	winningGame();
	saveScores();	
	showLeaderboard();
	stopClock();
	toggleModal();
	writeModalStats();
}
 
//remove the deck and create e new one
function resetCards(){
	const cards = document.querySelectorAll('.deck li');
	for (let card of cards){
		card.remove();
	}
	shuffleDeck();
} 
 
//Add the new class if you win the game 
function winningGame(){
	const cards = document.querySelectorAll('.deck li');
	for (let card of cards){
		card.classList.toggle('win');
	}
}
//Save to local storage
function saveScores(){
	let score = {moves:moves, time:time, stars:starCount};
	leaderboard.push(score);
	localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}
 

 
 function showLeaderboard(){
  leaderboardTable.innerHTML = '';
  var scoreFragment = document.createDocumentFragment();
  var firstRow = document.createElement('tr');
  firstRow.innerHTML = `
  <td>Rating</td>
  <td>Moves</td>
  <td>Time (seconds)</td>`;
  scoreFragment.appendChild(firstRow);
  for (score of leaderboard) {
    let newRow = document.createElement('tr');
    newRow.innerHTML = `
    <td>${score.stars} <i class="fa fa-star"></i></td>
    <td>${score.moves}</td>
    <td>${score.time}</td>`;
    scoreFragment.appendChild(newRow);
  }
  leaderboardTable.appendChild(scoreFragment);

  leaderboardPanel.style.display = 'block';
}
 
 
 
 
 
 
 
 

