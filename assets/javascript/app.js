// The theme of this program is to randomly select, and then pop the selection out of its array.

let numberOfCorrectAnswers,
    numberOfWrongAnswers,
    numberOfIncompleteAnswers,
    runTheTimeout,
    questionObject,
    timerForQuestion,
    container = $("#trivia"),
    arrayOfQuestions = [];

const millisecondsInASecond = 1000,
    timePerQuestion = 25 * millisecondsInASecond,
    timeUntilNextQuestion = 5 * millisecondsInASecond,
    predefinedQuestions = [
        question1 = {
            question: "If you have a set, what's the name of the least element in the superset that's greater than or equal to all the elements in your set (if it exists)?",
            image: "assets/images/maximal_supremum.png",
            wrongAnswer1: "infimum",
            wrongAnswer2: "greatest lower bound",
            wrongAnswer3: "a big number",
            correctAnswer: "supremum"
        },
        question2 = {
            question: "You can color every country on the world map with no more than ____ unique colors by the ____ color theorem.",
            image: "assets/images/world_map_with_four_colours.png",
            wrongAnswer1: "2",
            wrongAnswer2: "I'm going to use every crayon in the box and you can't stop me.",
            wrongAnswer3: "5",
            correctAnswer: "4"
        },
        question3 = {
            question: "What's the measure of how much a vector field passes through a given surface (e.g. the flow of water through an aquifer)?",
            image: "assets/images/flux_diagram.png",
            wrongAnswer1: "viscosity",
            wrongAnswer2: "current",
            wrongAnswer3: "normal",
            correctAnswer: "flux"
        },
        question4 = {
            question: "What's 2 + 2 in base 4?",
            image: "assets/images/10.png",
            wrongAnswer1: "4",
            wrongAnswer2: "11",
            wrongAnswer3: "undefined",
            correctAnswer: "10"
        },
        question5 = {
            question: "Here's a freebie:",
            image: "assets/images/free.jpg",
            wrongAnswer1: "wrong",
            wrongAnswer2: "wrong",
            wrongAnswer3: "wrong",
            correctAnswer: "correct!"
        }
    ];


// Displays a trivia question and its answers to the screen
function displayQuestion(questionObject) {
    // Displays the question to the screen
    container.append($("<h2>").addClass("p-3").text(questionObject.question));

    // Stores the keys of the key-value pairs in the question object in an array
    let arrayOfAnswers = Object.keys(questionObject);

    // Gets rid of the question and image from the array so only the answers are left
    arrayOfAnswers.splice(0, 2);

    // Randomly assorts the answers
    while (arrayOfAnswers.length) {
        let randomAnswerIndex = Math.floor(Math.random() * arrayOfAnswers.length);

        // Displays an answer to the screen
        let anAnswer = $("<a>").attr("href", "#");
        anAnswer.addClass("answer list-group-item list-group-item-action lead");
        anAnswer.data("answertype", arrayOfAnswers[randomAnswerIndex]);
        anAnswer.text(questionObject[arrayOfAnswers[randomAnswerIndex]]);
        container.append(anAnswer);

        // Pops out the answer from the array
        arrayOfAnswers.splice(randomAnswerIndex, 1);
    };

    // Starts the timer displayed on screen
    timerFunction(timePerQuestion);

    // Starts the countdown for the question
    runTheTimeout = setTimeout(function () {
        // Only executes this if an answer weren't clicked in time
        displayAnswer(questionObject);
    }, timePerQuestion);
};


// Displays the result of answering (or failing to answer) a question
function displayAnswer(questionObject, answer) {
    // Halts the timer for the question
    clearInterval(timerForQuestion);

    // Clears the timeout for the question to prevent it from running if an answer were clicked in time
    clearTimeout(runTheTimeout);

    container.empty();

    // Sets the answer as an optional parameter
    answer = answer || 0;

    if (answer > 0) {
        container.append($("<h2>").addClass("p-3").text("Correct!"));
    } else {
        // Checks whether the user got it wrong or ran out of time
        if (answer < 0) {
            container.append($("<h2>").addClass("p-3").text("Nope!"));
        } else {
            numberOfIncompleteAnswers++;
            container.append($("<h2>").addClass("p-3").text("Out of time!"));
        }

        // Displays the correct answer
        container.append($("<p>").addClass("lead pb-3").text("The correct answer was: " + questionObject.correctAnswer));
    };

    // Displays the image associated with the question
    container.append($("<img>").addClass("img-fluid").attr("src", questionObject.image));

    // Moves onto the next question
    setTimeout(routine, timeUntilNextQuestion);
};


// Counts down how many seconds are left to answer a question
function timerFunction(timer) {
    let timeLeft = timer / millisecondsInASecond;
    timerForQuestion = setInterval(function () {
        timeLeft--;
        $("#timerID").text("Time remaining: " + timeLeft);

        // Halts the timer if zero seconds is reached
        if (timeLeft <= 0) {
            clearInterval(timerForQuestion);
        };
    }, millisecondsInASecond);
};


// Iterates through all the trivia questions
function routine() {
    container.empty();
    if (arrayOfQuestions.length) {
        // Picks a random question from the array
        let randomQuestionIndex = Math.floor(Math.random() * arrayOfQuestions.length);
        questionObject = arrayOfQuestions[randomQuestionIndex];
        displayQuestion(questionObject);

        // Pops out the question from the array
        arrayOfQuestions.splice(randomQuestionIndex, 1);
    } else {
        // Stops the quiz
        gameOver();
    };
};


// Displays the results at the end of the quiz, and restarts it if needed
function gameOver() {
    container.append($("<h2>").addClass("p-3").text("All done, here's how you did!"));
    container.append($("<p>").addClass("lead").text("Correct Answers: " + numberOfCorrectAnswers));
    container.append($("<p>").addClass("lead").text("Incorrect Answers: " + numberOfWrongAnswers));
    container.append($("<p>").addClass("lead").text("Unanswered: " + numberOfIncompleteAnswers));
    container.append($("<button>").addClass("btn btn-primary btn-lg").attr("type", "button").text("Start Over?"));
};


// Initializes the quiz
function gameStart() {
    // Populates the empty question array with predetermined questions
    predefinedQuestions.forEach((question) => {
        arrayOfQuestions.push(question);
    });

    // (Re)sets the counts to zero
    numberOfCorrectAnswers = 0;
    numberOfWrongAnswers = 0;
    numberOfIncompleteAnswers = 0;

    // Iterates over the questions
    routine();
};


// Determines what happens when an answer is clicked
$(document).on("click", ".answer", function () {
    let answerType = $(this).data("answertype");
    if (answerType === "correctAnswer") {
        numberOfCorrectAnswers++;
        displayAnswer(questionObject, 1);
    } else {
        numberOfWrongAnswers++;
        displayAnswer(questionObject, -1);
    };
});


// (Re)starts the program
$(document).on("click", "button", gameStart);