// Define class for create questions
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

// Create Questions in an array
const questions = [
    new Question("What is the rate of acceleration of gravity at the Earth's surface?",['a) 11.2 m/s2', 'b) 9.8 m/s2', 'c) 7.8 m/s2', 'd) 6.7 m/s2'], 'b) 9.8 m/s2'),
    new Question("What is the smallest particle of an element that retains the properties of that element?", ['a) Molecule', 'b) Atom', 'c) Proton', 'd) Electron'], 'b) Atom'),
    new Question("Which planet in our solar system is known as the 'Red Planet'?", ['a) Venus', 'b) Mars', 'c) Jupiter', 'd) Saturn'], 'b) Mars'),
    new Question("What is the process by which plants convert sunlight into chemical energy?", ['a) Respiration', 'b) Photosynthesis', 'c) Fermentation', 'd) Combustion'], 'b) Photosynthesis'),
    new Question("What is the chemical symbol for gold?", ['a) Go', 'b) Ag', 'c) Au', 'd) Hg'], 'c) Au'),
    new Question("Which gas makes up the majority of Earth's atmosphere?", ['a) Oxygen', 'b) Carbon dioxide', 'c) Nitrogen', 'd) Hydrogen'], 'c) Nitrogen'),
    new Question("What is the study of earthquakes and the movement of the Earth's crust called?", ['a) Seismology', 'b) Geology', 'c) Astronomy', 'd) Meteorology'], 'a) Seismology'),
    new Question("What is the process by which plants lose water vapor through small openings in their leaves?", ['a) Transpiration', 'b) Condensation', 'c) Precipitation', 'd) Evaporation'], 'a) Transpiration'),
    new Question("What is the SI unit of electric current?", ['a) Volt', 'b) Ampere', 'c) Ohm', 'd) Watt'], 'b) Ampere'),
    new Question("Which of the following is the largest mammal on Earth?", ['a) African elephant', 'b) Blue whale', 'c) Giraffe', 'd) Polar bear'], 'b) Blue whale'),
    new Question("What is the chemical formula for water?", ['a) H2O', 'b) CO2', 'c) CH4', 'd) O2'], 'a) H2O')
]

// Function for randomly shuffle questions and answers
function shuffleArray(array) {
    for (let i = array.length -1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function for handle question's functionality
function showQuestion(question) {
    const questionElement = document.getElementById('question');
    questionElement.innerText = question.text;

    const buttons = document.querySelectorAll("#answer-buttons .btn");
    buttons.forEach((button, index) => {
        button.innerText = question.choices[index];
        button.className = 'btn';
        button.disabled = false;
    });

    // Clear feedback
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.textContent = '';
    feedbackElement.className = 'feedback';
}

// Function for evaluate if the selected answer is correct or not.
function selectAnswer(question, choice, button) {
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
            showQuestion(questions[currentQuestionIndex]);
        } else {
            showFinalScore();
        }
    }, 1000);
}

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

function setupGame() {
    shuffleArray(questions);
    questions.forEach(question => question.shuffleChoices());
    currentQuestionIndex = 0;
    score = 0;
    showQuestion(questions[currentQuestionIndex]);

}
function restartQuiz() {
    setupGame(questions);

    // Hide the quiz end container
    const quizEndContainer = document.getElementById('quiz-end-container');
    quizEndContainer.style.display = 'none';
}

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

function initializeQuiz() {
    setupGame(questions);
    setupEventListeners();
}

// Start the quiz
initializeQuiz(questions);

