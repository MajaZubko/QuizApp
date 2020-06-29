const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.querySelector('#progressText');
const scoreText = document.querySelector('#score');
const progressBarFull = document.querySelector('#progressBarFull');
const loader = document.querySelector('#loader');
const game = document.querySelector('#game');
const questionImage = document.querySelector('#questionImage');
const questionSound = document.querySelector('#questionSound');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];
let audio;

let questions = [];

fetch('questions.json')
	.then((res) => {
		return res.json();
	})
	.then((loadedQuestions) => {
		console.log(loadedQuestions);
		questions = loadedQuestions;
		startGame();
	})
	.catch((err) => {
		console.error(err);
	});

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 24;

startGame = () => {
	questionCounter = 0;
	score = 0;
	availableQuesions = [ ...questions ];
	getNewQuestion();
	game.classList.remove('hidden');
	loader.classList.add('hidden');
};

getNewQuestion = () => {
	if (audio) {
		audio.pause();
	}

	if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
		localStorage.setItem('mostRecentScore', score);
		//go to the end page
		return window.location.assign('/end.html');
	}

	if (!questionImage.classList.contains('hidden')) {
		questionImage.classList.add('hidden');
	}

	if (!questionSound.classList.contains('hidden')) {
		questionSound.classList.add('hidden');
	}

	questionCounter++;
	progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
	//Update the progress bar
	progressBarFull.style.width = `${questionCounter / MAX_QUESTIONS * 100}%`;

	const questionIndex = Math.floor(Math.random() * availableQuesions.length);
	currentQuestion = availableQuesions[questionIndex];
	question.innerText = currentQuestion.question;

	if (currentQuestion.image !== '') {
		questionImage.classList.remove('hidden');
		questionImage.innerHTML = `<img src="${currentQuestion.image}" height="250px">`;
	}

	if (currentQuestion.music !== '') {
		questionSound.classList.remove('hidden');
		questionSound.innerHTML = `<audio id="audio" controls>
    <source src="${currentQuestion.music}" type="audio/mpeg">
</audio>`;
		audio = document.querySelector('#audio');
	}

	choices.forEach((choice) => {
		const number = choice.dataset['number'];
		choice.innerText = currentQuestion['choice' + number];
	});

	availableQuesions.splice(questionIndex, 1);
	acceptingAnswers = true;
};

choices.forEach((choice) => {
	choice.addEventListener('click', (e) => {
		if (!acceptingAnswers) return;

		acceptingAnswers = false;
		const selectedChoice = e.target;
		const selectedAnswer = selectedChoice.dataset['number'];

		const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

		if (classToApply === 'correct') {
			incrementScore(CORRECT_BONUS);
		}

		selectedChoice.parentElement.classList.add(classToApply);

		setTimeout(() => {
			selectedChoice.parentElement.classList.remove(classToApply);
			getNewQuestion();
		}, 1000);
	});
});

incrementScore = (num) => {
	score += num;
	scoreText.innerText = score;
};
