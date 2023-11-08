const gridContainer = document.querySelector('.grid-container');
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0
const savedLowestScore = localStorage.getItem('lowestScore');
let lowestScore = savedLowestScore ? parseInt(savedLowestScore) : Infinity;

document.querySelector('h3 span').textContent = lowestScore;

function updateLowestScore(score) {
    console.log('Updating lowest score with score:', score, 'and lowestScore:', lowestScore);
    if (score < lowestScore) {
        lowestScore = score;
        localStorage.setItem('lowestScore', String(score));
        console.log('New lowest score:', lowestScore);
        document.querySelector('h3 span').textContent = lowestScore;
        return lowestScore;
    }
}

function isGameComplete() {
    const flippedCards = document.querySelectorAll('.card.flipped');
    return flippedCards.length === cards.length;
}

fetch("../data/img.json")
    .then((res) => res.json())
    .then((data) => {
        cards = [...data, ...data];
        shuffleCards();
        generateCards();
    });

function shuffleCards() {
    let currentIndex = cards.length, randomIndex, temporaryValue;
    while(currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] =temporaryValue;
    }
}

function generateCards() {
    for(let card of cards) {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.setAttribute('data-name', card.name);
        cardElement.innerHTML = `
        <div class="front">
            <img class="front-image" src=${card.image} />
        </div>
        <div class="back"></div>
        `;
        gridContainer.appendChild(cardElement);
        cardElement.addEventListener('click', flipCard);
    }
}

function flipCard() {
    if(lockBoard) return;
    if(this === firstCard) return;
    this.classList.add('flipped');
    if(!firstCard) {
        firstCard = this;
        return;
    }
    secondCard = this;
    score++;
    document.querySelector('.score').textContent = score;
    lockBoard = true;
    
    checkForMatch();


}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard)
    secondCard.removeEventListener('click', flipCard)
    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000)
}

function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function restart() {
    if (isGameComplete()) {
        lowestScore = updateLowestScore(score);
    }
    // lowestScore = updateLowestScore(score);
    resetBoard();
    shuffleCards();
    score = 0;
    document.querySelector('.score').textContent = score;
    gridContainer.innerHTML = '';
    generateCards();    
}
