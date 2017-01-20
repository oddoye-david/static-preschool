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
    var randomlyChosenIndex = getRandomNumber(questions.length)
    if (questions.length) {
        var question = questions[randomlyChosenIndex]
        questions.splice(randomlyChosenIndex, 1)
        return question;
    }

    return null;
}

function getRandomEntranceAnimation() {
    var animation = animations[getRandomNumber(animations.length)];
    return animation + '1.5s'
}

function animateInQuestion(questionDOMNode) {
    return new Promise(function (resolve) {
        questionDOMNode.classList.add('shown')
        questionDOMNode.querySelector('img').style.animation = getRandomEntranceAnimation()
        resolve()
    });
}

function showFeedBack(questionDOMNode, correct, question) {
    if (correct || question.triesLeft <= 0) {
        var badges = [];
        if (correct) {
            for (var i = 1; i <= question.triesLeft + 1; i++) {
                badges.push('<span class = "badge animated bounceIn" style = "animation-delay: ' + i * badgeDelay + 's"></span>')
            }
        }
        questionDOMNode.querySelector('p.narration').innerText = correct ? narrations.right : narrations.wrong
        questionDOMNode.querySelector('div.question__score').innerHTML = badges.join('')
        questionDOMNode.querySelector('div.question__explanation').classList.add('active')
        questionDOMNode.querySelector('.question__explanation-close').addEventListener('click', function () {
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
    return new Promise(function (resolve) {
        var questionOptions = questionDOMNode.querySelectorAll('li.question__option-item')
        questionOptions.forEach(function (questionOption) {
            questionOption.addEventListener('click', function () {
                question.triesLeft--;
                showFeedBack(questionDOMNode, questionOption.innerText.toLowerCase() === question.answer.toLowerCase(), question)
            })
        })
        question.triesLeft = question.options.length - 1
        resolve()
    });
}

function speak(text) {
    var textToSpeech = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(textToSpeech);
}

function nextQuestion() {
    if (questions.length) {
        var randomlyChosenQuestion = getRandomQuestion();
        var questionDOMNode = document.querySelector('[data-question-id="' + randomlyChosenQuestion.id +'"]')
        animateInQuestion(questionDOMNode)
            .then(function () {return setupOptionListeners(questionDOMNode, randomlyChosenQuestion)})
            .then(function () {return  speak(randomlyChosenQuestion.question)})
        return;
    }

    return;
}

const playButton = document.querySelector('#play-button')
const welcomeScreen = document.querySelector('div.welcome')

playButton.addEventListener('click', function () {
    welcomeScreen.classList.add('hidden')
    nextQuestion()
})