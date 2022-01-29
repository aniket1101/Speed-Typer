const RANDOM_QUOTE_API = 'https://api.quotable.io/random'
const quoteDisplayElement = document.getElementById('quoteDisplay')
const quoteInputElement = document.querySelector('.quote-input')
const timerElement = document.getElementById('timer')
const scoreElement = document.getElementById('score')
const btn = document.querySelector('.playpause');

let numCorrect = 0
let totalTime = 0
let numErrors = 0
let playing = true
let pausedTime = 0

btn.addEventListener('click', () => {
    btn.classList.toggle('playing');
    if (playing) {
        playing = false
        document.body.style.backgroundColor = "#cdc5c2"
        quoteInputElement.classList.toggle('editing');
    }
    else {
        playing = true
        pausedTime = 60 - Number(timerElement.innerText)
        startTimer()
        document.body.style.backgroundColor = "#5cdb95"
        quoteInputElement.classList.toggle('editing');
    }
});

quoteInputElement.addEventListener('input', () => {
    const arrayQuote = quoteDisplayElement.querySelectorAll('span')
    const arrayValue = quoteInputElement.value.split('')
    
    let correct = true

    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index]

        if (character == null) {
            characterSpan.classList.remove('correct')
            characterSpan.classList.remove('incorrect')
            correct = false
        } else if (character === characterSpan.innerText) {
            characterSpan.classList.add('correct')
            characterSpan.classList.remove('incorrect')
        } else {
            characterSpan.classList.remove('correct')
            characterSpan.classList.add('incorrect')
            correct = false
            numErrors+=1
            console.log(numErrors)
            console.log(btn.classList.value)
        }
    })

    if (correct) {
        numCorrect = numCorrect + 1
        totalTime = Number(totalTime) + Number(timerElement.innerText)
        console.log(totalTime)
        scoreElement.innerText = "Score: " + numCorrect
        renderNewQuote()
    }
})

function getQuote() {
    return fetch(RANDOM_QUOTE_API)
    .then(response => response.json())
    .then(data => data.content)
}

function preventBackspace(e) {
    var evt = e || window.event;
    if (evt) {
        var keyCode = evt.charCode || evt.keyCode;
        if (keyCode === 8) {
            if (evt.preventDefault) {
                evt.preventDefault();
            } else {
                evt.returnValue = false;
            }
        }
    }
}

async function renderNewQuote() {
    const quote = await getQuote()
    quoteDisplayElement.innerHTML = ''
    quote.split('').forEach(character => {
        const characterSpan = document.createElement('span')
        characterSpan.innerText = character
        quoteDisplayElement.appendChild(characterSpan)
    })
    quoteInputElement.value = null
    timerElement.innerText = 0
    pausedTime = 0
}

let startTime
function startTimer() {
    startTime = new Date()
    setInterval(() => {
        if (playing) {
            timer.innerText = (60 - pausedTime - getTime())
        }
    }, 1000);
}

function getTime() {
        return Math.floor((new Date() - startTime) / 1000)
}

startTimer()
renderNewQuote()