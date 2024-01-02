// Initialize global variables
const ANSWER_LETTERS = ['a', 'b', 'c', 'd'];
let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Question class to create question objects with text, choices, and the correct answer
class Question {
    constructor(text, choices, answer) {
        this.text = text;
        this.choices = choices;
        this.answer = answer;
    }

    isCorrectAnswer(choice) {
        return this.answer === choice;
    }

    shuffleChoices() {
        shuffleArray(this.choices);
    }
}

// Utility function to shuffle an array (used for randomizing questions and choices)
function shuffleArray(array) {
    for (let i = array.length -1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Fetch questions from Open Trivia Database API
async function fetchQuestions(amount, category, difficulty) {
    const apiURL = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple&encode=url3986`;
    try {
        const response = await fetch(apiURL);
        if (response.ok) {
            const data = await response.json();
            console.log(data.results);
            return data.results.map((question) => formatQuestion(question));
        } 
            throw new Error(`HTTP error! status: ${response.status}`);
        } catch(error) {
            console.error('Fetching questions failed:', error);
        }

}

// Format question from API to match the Question class
function formatQuestion(questionItem) {
    const decodedQuestion = decodeURIComponent(questionItem.question);
    const decodedChoices = questionItem.incorrect_answers.map(answer => decodeURIComponent(answer));
    const decodedCorrectAnswer = decodeURIComponent(questionItem.correct_answer);

    return new Question(
        decodedQuestion,
        [...decodedChoices, decodedCorrectAnswer],
        decodedCorrectAnswer
    );
}

// Displays the current question on the quiz interface
function displayQuestion(currentQuestionIndex) {
    const question = questions[currentQuestionIndex];
    const questionElement = document.getElementById('question');
    const questionNumber = currentQuestionIndex +1;
    questionElement.innerText = `Question ${questionNumber}: ${question.text}`;
}

// Update answer buttons based on current question
function initializeAnswerButtons(question) {
    const buttons = document.querySelectorAll("#answer-buttons .btn");
    buttons.forEach((button, index) => {
        button.innerText = `${ANSWER_LETTERS[index]}) ${question.choices[index]}`;
        button.className = 'btn';
        button.disabled = false;
    });
}

// Clear the feedback message from the previous question
function clearFeedback() {
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.textContent = '';
    feedbackElement.className = 'feedback';
}

// Display the current question and its choices
function showQuestion(currentQuestionIndex) {
    displayQuestion(currentQuestionIndex);
    initializeAnswerButtons(questions[currentQuestionIndex]);
    clearFeedback();
}

// Evaluate the selected answer and update the UI accordingly
function selectAnswer(question, choiceText, button) {
    const choice = choiceText.substring(3);
    const feedbackElement = document.getElementById('feedback');
    const isCorrect = question.isCorrectAnswer(choice);

    if (isCorrect) {
        feedbackElement.textContent = 'Correct!';
        feedbackElement.className = 'feedback correct';
        button.className = 'btn correct';
        score++;
    } else {
        feedbackElement.textContent = 'Wrong!';
        feedbackElement.className = 'feedback wrong';
        button.className = 'btn wrong';
    }

    // Move to the next question or finish the quiz
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            updateProgressBar(currentQuestionIndex);
            showQuestion(currentQuestionIndex);
        } else {
            showFinalScore();
        }
    }, 700);
}

// Update the progress bar based on the current question index
function updateProgressBar(currentQuestionIndex) {
    const totalQuestions = questions.length;
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = ((currentQuestionIndex + 1) /  totalQuestions) * 100;
    progressBar.style.width = progressPercentage + '%';
}

// Handle quiz form submission
async function getQuestions() {
    const quizOptionsForm = document.getElementById('quiz-options-form');
    quizOptionsForm.addEventListener('submit', async function(e) {e.preventDefault();
        
        displayQuizContainer();

        const amount = document.getElementById('question-amount').value;
        const category = document.getElementById('category-select').value;
        const difficulty = document.getElementById('difficulty-select').value;
    
        questions = await fetchQuestions(amount, category, difficulty);
    
        if (questions && questions.length > 0 ) {
            console.log(questions);
            setupGame();
        } else {
        console.error('No questions were returned from the API.');
        }
    });
}

// Reset state and shuffle questions and answers 
function setupQuestions() {
    currentQuestionIndex = 0;
    score = 0;
    shuffleArray(questions);
    questions.forEach(question => question.shuffleChoices());
}
// Setup event listeners for answer buttons and the restart button
function setupEventListeners() {
    const answerButtonsElement = document.getElementById('answer-buttons');
    answerButtonsElement.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON') {
            selectAnswer(questions[currentQuestionIndex], e.target.textContent, e.target);
        }
    });

    // Attach event listener to restart button
    document.getElementById('restart-button').addEventListener('click', restartQuiz);
}

// Initialize the game by shuffling questions and resetting the state
async function setupGame() {
    if (questions && Array.isArray(questions)) {
        setupQuestions();
        showQuestion(currentQuestionIndex);
    } else {
        console.error('No questions were returned from the API.');
    }
}

// Reset the progress bar to its initial state
function resetProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';

    // Re-enable the smooth transition after a short delay
    setTimeout(() => {
        progressBar.style.transition = 'width 0.4s ease-in-out';
    }, 10); 
}

// Hide the quiz setup form and show quiz container
function displayQuizContainer() {
    document.getElementById('quiz-setup').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
}

// Hide the quiz container and show quiz setup form
function displayQuizSetup() {
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('quiz-setup').style.display = 'block';
    
}
// Hide the final-score section and reset button
function hideQuizEndContainer() {
    const quizEndContainer = document.getElementById('quiz-end-container');
    quizEndContainer.style.display = 'none';
}

// Handle the quiz restart logic
function restartQuiz() {
    setupQuestions();
    resetProgressBar();
    hideQuizEndContainer();
    displayQuizContainer();
    showQuestion(currentQuestionIndex);


}

// Display the final score at the end of the quiz
function showFinalScore() {
    const finalScoreElement = document.getElementById('final-score');
    const quizEndContainer = document.getElementById('quiz-end-container');
    const scorePercentage = (score / questions.length) * 100;
    
    finalScoreElement.textContent = `Your final score: ${score}/${questions.length} (${scorePercentage.toFixed(1)}%)`;
    
    if (scorePercentage >= 80) {
        finalScoreElement.className = 'final-score correct';
    } else if (scorePercentage >= 60) { 
        finalScoreElement.className = 'final-score good';
    } else if (scorePercentage > 30) {
        finalScoreElement.className = 'final-score regular';
    } else {
        finalScoreElement.className = 'final-score wrong';
    }
    
    quizEndContainer.style.display = 'block';
}

// Initial function to start the quiz
function initializeQuiz() {
    getQuestions();
    setupEventListeners();
}

// Start the quiz
initializeQuiz(questions);

