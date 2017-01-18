'use strict';

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
    const randomlyChosenIndex = getRandomNumber(questions.length)
    if (questions.length) {
        const question = questions[randomlyChosenIndex]
        questions.splice(randomlyChosenIndex, 1)
        return question;
    }

    return null;
}

function getRandomEntranceAnimation() {
    const animation = animations[getRandomNumber(animations.length)];
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
    console.log(question.triesLeft)
    if (correct || question.triesLeft <= 0) {
        const badges = [];
        if (correct) {
            for (const i = 1; i <= question.triesLeft + 1; i++) {
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
            nextQuestion()
        })
        return
    }

    console.log('More tries')
    return
}

function setupOptionListeners(questionDOMNode, question) {
    return new Promise((resolve) => {
        const questionOptions = questionDOMNode.querySelectorAll('li.question__option-item')
        questionOptions.forEach(questionOption => {
            questionOption.addEventListener('click', () => {
                question.triesLeft--;
                showFeedBack(questionDOMNode, questionOption.innerText === question.answer, question)
            })
        })
        question.triesLeft = question.options.length - 1
        resolve()
    });
}

function speak(text) {
    const textToSpeech = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(textToSpeech);
}

function nextQuestion() {
    if (questions.length) {
        const randomlyChosenQuestion = getRandomQuestion();
        const questionDOMNode = document.querySelector(`[data-question-id='${randomlyChosenQuestion.id}']`)
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