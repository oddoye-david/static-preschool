'use strict'
const answeredQuestions = [];
const animations = [
    'zoomIn', 'flipInY',
    'fadeIn', 'bounceIn',
    'flipInX', 'lightSpeedIn'
];
const narrations = {
    wrong: "Oh no! You got this one wrong",
    right: "That's Right!"
};
const badgeDelay = 0.5

function getRandomNumber(max) {
    return Math.floor(Math.random() * max);
}

function getRandomQuestion() {
    let randomlyChosenIndex = getRandomNumber(questions.length)
    if (questions.length) {
        let question = questions[randomlyChosenIndex]
        questions.splice(randomlyChosenIndex, 1)
        return question;
    }

    return null;
}

function addMoreClasses(element, arrayOfClasses) {
    element.setAttribute('class', element.getAttribute('class') + ` ${arrayOfClasses.join(' ')}`)
    return
}

function getRandomEntranceAnimation() {
    let animation = animations[getRandomNumber(animations.length)];
    return `${animation} 1.5s`
}

function animateInQuestion(questionDOMNode) {
    return new Promise((resolve) => {
        questionDOMNode.classList.add('shown')
        questionDOMNode.querySelector('img').style.animation = getRandomEntranceAnimation()
        resolve()
    });
}

function showFeedBack(questionDOMNode, correct, question) {
    if (correct || question.triesLeft <= 0) {
        let badges = [];
        if (correct) {
            for (let i = 1; i <= question.triesLeft + 1; i++) {
                badges.push(`<span class = "badge animated bounceIn"
            style = "animation-delay: ${i * badgeDelay}s"></span>`)
            }
        }
        questionDOMNode.querySelector('p.narration').innerText = correct ? narrations.right : narrations.wrong
        questionDOMNode.querySelector('div.question__score').innerHTML = badges.join('')
        questionDOMNode.querySelector('div.question__explanation').classList.add('active')
        questionDOMNode.querySelector('.question__explanation-close').addEventListener('click', () => {
            questionDOMNode.querySelector('div.question__explanation').classList.remove('active')
            questionDOMNode.classList.remove('shown')
            // remove Node
            // Add new one
            nextQuestion()
        })
        return
    }

    return
}

function setupOptionListeners(questionDOMNode, question) {
    return new Promise((resolve) => {
        let questionOptions = questionDOMNode.querySelectorAll('li.question__option-item')
        questionOptions.forEach(questionOption => {
            questionOption.addEventListener('click', () => {
                question.triesLeft--;
                showFeedBack(questionDOMNode, questionOption.innerText.toLowerCase() === question.answer.toLowerCase(), question)
            })
        })
        question.triesLeft = question.options.length - 1
        resolve()
    });
}

function speak(text) {
    let textToSpeech = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(textToSpeech);
}

function nextQuestion() {
    if (questions.length) {
        let randomlyChosenQuestion = getRandomQuestion();
        let questionDOMNode = document.querySelector(`[data-question-id='${randomlyChosenQuestion.id}']`)
        animateInQuestion(questionDOMNode)
            .then(() => setupOptionListeners(questionDOMNode, randomlyChosenQuestion))
            .then(() => speak(randomlyChosenQuestion.question))
        return;
    }

    return;
}

const playButton = document.querySelector('#play-button')
const welcomeScreen = document.querySelector('div.welcome')

playButton.addEventListener('click', () => {
    welcomeScreen.classList.add('hidden')
    nextQuestion()
})