// Leading letters constant for answer labeling
const ANSWER_LETTERS = ['a', 'b', 'c', 'd'];

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

// Create questions, options and correct answer in an array
const questions = [
    new Question("What is the rate of acceleration of gravity at the Earth's surface?",['11.2 m/s2', '9.8 m/s2', '7.8 m/s2', '6.7 m/s2'], '9.8 m/s2'),
    new Question("What is the smallest particle of an element that retains the properties of that element?", ['Molecule', 'Atom', 'Proton', 'Electron'], 'Atom'),
    new Question("What is the process by which plants convert sunlight into chemical energy?", ['Respiration', 'Photosynthesis', 'Fermentation', 'Combustion'], 'Photosynthesis'),
    new Question("What is the chemical symbol for gold?", ['Go', 'Ag', 'Au', 'Hg'], 'Au'),
    new Question("Which gas makes up the majority of Earth's atmosphere?", ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'], 'Nitrogen'),
    new Question("What is the study of earthquakes and the movement of the Earth's crust called?", ['Seismology', 'Geology', 'Astronomy', 'Meteorology'], 'Seismology'),
    new Question("What is the process by which plants lose water vapor through small openings in their leaves?", ['Transpiration', 'Condensation', 'Precipitation', 'Evaporation'], 'Transpiration'),
    new Question("What is the SI unit of electric current?", ['Volt', 'Ampere', 'Ohm', 'Watt'], 'Ampere'),
    new Question("Which of the following is the largest mammal on Earth?", ['African elephant', 'Blue whale', 'Giraffe', 'Polar bear'], 'Blue whale'),
    new Question("What is the chemical formula for water?", ['H2O', 'CO2', 'CH4', 'O2'], 'H2O'),
    new Question("What is the main constituent of the sun?", ['Hydrogen', 'Helium', 'Oxygen', 'Carbon'], 'Hydrogen'),
    new Question("Which vitamin is produced by the human skin in response to sunlight?", ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'], 'Vitamin D'),
    new Question("What phenomenon causes the tail of a comet to always point away from the sun?", ['Gravity', 'Solar wind', 'Magnetic field', 'Radiation pressure'], 'Solar wind'),
    new Question("What is the term for the amount of matter in an object?", ['Weight', 'Density', 'Mass', 'Volume'], 'Mass'),
    new Question("Which element has the highest melting point?", ['Iron', 'Carbon', 'Tungsten', 'Uranium'], 'Tungsten'),
    new Question("What is the name of the galaxy that contains our solar system?", ['Andromeda', 'Milky Way', 'Whirlpool', 'Triangulum'], 'Milky Way'),
    new Question("What is the term for a reaction in which an atom loses an electron?", ['Reduction', 'Oxidation', 'Hydrolysis', 'Neutralization'], 'Oxidation'),
    new Question("Which layer of the Earth is made up of tectonic plates?", ['Crust', 'Mantle', 'Outer core', 'Inner core'], 'Crust'),
    new Question("What is the basic unit of life?", ['Organ', 'Cell', 'Tissue', 'Molecule'], 'Cell'),
    new Question("What is the name of the force that keeps objects in orbit around each other?", ['Centrifugal force', 'Gravitational force', 'Electromagnetic force', 'Nuclear force'], 'Gravitational force')
];

// Utility function to shuffle an array (used for randomizing questions and choices)
function shuffleArray(array) {
    for (let i = array.length -1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [array[i], array[j]] = [array[j], array[i]];
    }
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
        button.innerText = `${answerLetters[index]}) ${question.choices[index]}`;
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
function setupGame() {
    shuffleArray(questions);
    questions.forEach(question => question.shuffleChoices());
    currentQuestionIndex = 0;
    score = 0;
    showQuestion(currentQuestionIndex);
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

// Hide the final-score section and reset button
function hideQuizEndContainer() {
    const quizEndContainer = document.getElementById('quiz-end-container');
    quizEndContainer.style.display = 'none';
}

// Handle the quiz restart logic
function restartQuiz() {
    setupGame();
    resetProgressBar();
    hideQuizEndContainer();
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
    setupGame();
    setupEventListeners();
}

// Start the quiz
initializeQuiz(questions);

