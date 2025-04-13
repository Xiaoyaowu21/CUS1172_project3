const startSection = document.getElementById('start-section');
const quizSection = document.getElementById('quiz-section');
const finalSection = document.getElementById('final-section');
const usernameInput = document.getElementById('text');
const submitButton = document.getElementById('submitbn');
const quizButtons = document.querySelectorAll('.quiz-select');
const quizTitle = document.getElementById('quiz-title');
const displayUsername = document.getElementById('display-username');
const questionNumber = document.getElementById('question-number');
const totalQuestions = document.getElementById('total-questions');
const scoreDisplay = document.getElementById('score');
const questionContainer = document.getElementById('question-container');
const nextButton = document.getElementById('next-btn');
const feedbackContainer = document.getElementById('feedback');
const totalScoreDisplay = document.getElementById('totalScore');
const returnButton = document.getElementById('returnbn');

// State for our quiz logic
const state = {
    username: '',
    currentQuiz: '',
    currentQuestionIndex: 0,
    score: 0,
    questions: []
};

// NOTE: Each 'correctAnswer' is the ZERO-BASED INDEX of the correct option in 'options'
const quizzes = {
    quiz1: {
        title: "Mathematics Quiz A",
        questions: [
            {
                question: "Is (2,1) a solution to the equation y = 7x?",
                options: ["yes", "no"],
                correctAnswer: 1, 
                explanation: "For x=2, 7x=14, which is not equal to y=1. So, (2,1) is NOT on y=7x."
            },
            {
                question:"What is the limit of 1/(x - 1) as x approaches infinity?",
                options:["infinity","0","-1","Negative infinity"],
                correctAnswer: 1, 
                explanation:"As x → ∞, (x - 1) becomes very large, so 1/(x-1) → 0."
            },
            {
                question: "What is the derivative of x² + 1 with respect to x?",
                options: ["2x", "x", "x+1", "2x+1"],
                correctAnswer: 0, 
                explanation: "d/dx (x²) = 2x. The derivative of a constant (1) is 0. So total = 2x."
            },
            {
                question: "What is the derivative of f(x) = 1963?",
                options: ["0", "1963", "None of the above", "Not defined"],
                correctAnswer: 0, 
                explanation: "The derivative of a constant function is always 0."
            },
            {
                question: "Calculate the area of this rectangle (width=4cm, length=6cm):",
                image: "https://study.com/cimages/multimages/16/222224971011527207636336.jpg",   
                imageAlt: "Rectangle with width 4cm and length 6cm",
                options: ["18 cm²", "20 cm²", "22 cm²", "24 cm²"],
                correctAnswer: 3, 
                explanation: "Area = length × width = 6 × 4 = 24 cm²."
            }
        ]
    },
    quiz2: {
        title: "Mathematics Quiz B",
        questions: [
            {
                question: "What is the integral of 1 with respect to x?",
                options: ["0.5x", "x+C", "1.25x", "2x"],
                correctAnswer: 1, 
                explanation: "The integral of 1 with respect to x is x + C, where C is the constant of integration. The integral of a constant, such as 1, with respect to a variable, in this case, x, is simply the constant multiplied by x. Therefore, the integral of 1 with respect to x results in x. The constant C represents an arbitrary constant that can be added to the result because there are infinitely many antiderivatives of a function. This is the fundamental concept in indefinite integration."
            },
            {
                question: "If 4y+8 = 12y + 24, then y = ?",
                options: ["2", "1", "-1", "-2"],
                correctAnswer: 3, 
                explanation: "To solve the equation, we need to isolate the variable y. First, we can simplify the equation by subtracting 4y from both sides, which gives us 8 = 8y + 24. Then, we can subtract 24 from both sides to get -16 = 8y. Finally, we divide both sides by 8 to find that y = -2."
            },
            {
                question: "If f(2) = 10 and f(4) = 44, which of the following could be f(x)?",
                options: ["2x+6", "2x^2+12", "3x^2-x", "x-6x"],
                correctAnswer: 2, 
                explanation: "The given answer, 3x2 - x, could be f(x) because it satisfies the given conditions. When x = 2, the equation evaluates to 3(2)2 - 2 = 12 - 2 = 10. Similarly, when x = 4, the equation evaluates to 3(4)2 - 4 = 48 - 4 = 44. Therefore, 3x2 - x is a possible function f(x) that satisfies the given values."
            },
            {
                question: "If the remainder when x is divided by 5 equals the remainder when x is divided by 4, then x could be any of the following except?",
                options: ["20", "22", "24", "21"],
                correctAnswer: 2,
                explanation: "If the remainder when x is divided by 5 equals the remainder when x is divided by 4, it means that x is a multiple of both 5 and 4. Since 24 is divisible by both 5 and 4, it cannot be the value of x. Therefore, x could be any of the other options: 20, 22, or 21."
            },
            {
                question: "If one packager can pack 15 boxes  every two minutes, and another can pack 15 boxes every three minutes, how many minutes will it take these two packagers, working together, to pack 300 boxes?",
                options: ["24", "12", "15", "20"],
                correctAnswer: 0,
                explanation: "If one packager can pack 15 boxes every two minutes and another packager can pack 15 boxes every three minutes, it means that the first packager can pack 7.5 boxes per minute and the second packager can pack 5 boxes per minute. When working together, their combined rate is 12.5 boxes per minute. To pack 300 boxes, it would take them 300 divided by 12.5, which equals 24 minutes."
            }
        ]
    }
};

submitButton.addEventListener('click', handleUsernameSubmit);
quizButtons.forEach(button => {
    button.addEventListener('click', handleQuizSelection);
});
nextButton.addEventListener('click', handleNextQuestion);
returnButton.addEventListener('click', returnToMain);


function handleUsernameSubmit() {
    const username = usernameInput.value.trim();
    if (username === '') {
        alert('Please enter your name');
        return;
    }
    
    state.username = username;
    displayUsername.textContent = username;
}

function handleQuizSelection(event) {
    const quizId = event.target.getAttribute('data-quiz');

    if (state.username === '') {
        alert('Please enter your name first');
        return;
    }
    
    state.currentQuiz = quizId;
    state.questions = quizzes[quizId].questions;
    state.currentQuestionIndex = 0;
    state.score = 0;

    quizTitle.textContent = quizzes[quizId].title;
    totalQuestions.textContent = state.questions.length;
    scoreDisplay.textContent = state.score;
    
    startSection.style.display = 'none';
    quizSection.style.display = 'block';
    finalSection.style.display = 'none';
    
    loadQuestion();
}

function loadQuestion() {
    questionNumber.textContent = state.currentQuestionIndex + 1;
    const currentQuestion = state.questions[state.currentQuestionIndex];

    questionContainer.innerHTML = '';
    feedbackContainer.innerHTML = '';
  
    const questionElement = document.createElement('div');
    questionElement.className = 'question';
    questionElement.innerHTML = `<h3>${currentQuestion.question}</h3>`;
    
    if (currentQuestion.image) {
      const img = document.createElement('img');
      img.src = currentQuestion.image;
      img.alt = currentQuestion.imageAlt || "Question image";
      img.style.maxWidth = '200px'; // Example styling
      questionElement.appendChild(img);
    }
    
    const optionsElement = document.createElement('div');
    optionsElement.className = 'options';
    
    currentQuestion.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.innerHTML = `
            <input type="radio" name="answer" id="option${index}" value="${index}">
            <label for="option${index}">${option}</label>
        `;
        optionsElement.appendChild(optionElement);
    });
    
    const submitAnswerButton = document.createElement('button');
    submitAnswerButton.textContent = 'Submit Answer';
    submitAnswerButton.addEventListener('click', function() {
        handleAnswerSubmission(currentQuestion);
    });

    questionContainer.appendChild(questionElement);
    questionContainer.appendChild(optionsElement);
    questionContainer.appendChild(submitAnswerButton);
    
    nextButton.style.display = 'none';
}

function handleAnswerSubmission(question) {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    
    if (!selectedOption) {
        alert('Please select an answer');
        return;
    }

    const userAnswer = parseInt(selectedOption.value);
    const isCorrect = userAnswer === question.correctAnswer;

    feedbackContainer.innerHTML = '';
    const feedbackElement = document.createElement('div');
    
    if (isCorrect) {
        state.score++;
        scoreDisplay.textContent = state.score;
        
        feedbackElement.className = 'feedback-correct';
        feedbackElement.innerHTML = `
            <h3>Correct!</h3>
            <p>Great job!</p>
        `;
      
        setTimeout(() => {
            moveToNextQuestion();
        }, 1000);
    } else {
        feedbackElement.className = 'feedback-incorrect';
        feedbackElement.innerHTML = `
            <h3>Incorrect</h3>
            <p>${question.explanation}</p>
            <button id="got-it-btn">Got it</button>
        `;
        
        feedbackElement.querySelector('#got-it-btn').addEventListener('click', () => {
            moveToNextQuestion();
        });
        
        nextButton.style.display = 'block';
    }
    
    feedbackContainer.appendChild(feedbackElement);

    document.querySelectorAll('input[name="answer"]').forEach(input => {
        input.disabled = true;
    });
 
    const submitButton = questionContainer.querySelector('button');
    if (submitButton) {
        submitButton.style.display = 'none';
    }
}

function moveToNextQuestion() {
    state.currentQuestionIndex++;
    
    if (state.currentQuestionIndex < state.questions.length) {
        loadQuestion();
    } else {
        showFinalResults();
    }
}

function handleNextQuestion() {
    moveToNextQuestion();
}

function showFinalResults() {
    const percentage = Math.round((state.score / state.questions.length) * 100);
    totalScoreDisplay.textContent = `${state.score} out of ${state.questions.length} (${percentage}%)`;
    
    if (percentage >= 80) {
        // pass
        const passMsg = document.createElement('h2');
        passMsg.textContent = `Congratulations ${state.username}! You passed the quiz!`;
        finalSection.insertBefore(passMsg, finalSection.firstChild);
    } else {
        // fail
        const failMsg = document.createElement('h2');
        failMsg.textContent = `Sorry ${state.username}, you failed the quiz.`;
        finalSection.insertBefore(failMsg, finalSection.firstChild);
    }
    quizSection.style.display = 'none';
    finalSection.style.display = 'block';
}
//reset 
function returnToMain() {
    finalSection.innerHTML = `
        <h3>Quiz finished!</h3>
        <h3>Your score is: <span id="totalScore"></span></h3>
        <button id="returnbn">Return to Main Page</button>
    `;
    finalSection.querySelector('#returnbn').addEventListener('click', returnToMain);
    
    usernameInput.value = '';
    
    state.username = '';
    state.currentQuiz = '';
    state.currentQuestionIndex = 0;
    state.score = 0;
    state.questions = [];
    
    startSection.style.display = 'block';
    quizSection.style.display = 'none';
    finalSection.style.display = 'none';
}
function init() {
    startSection.style.display = 'block';
    quizSection.style.display = 'none';
    finalSection.style.display = 'none';
}

init();
