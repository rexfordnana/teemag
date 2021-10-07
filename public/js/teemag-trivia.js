//Runs once at the beginning
function setup() {
    var googleSheetLink = "1hwGQO0FoafH5HF6Iz2sZ1kkdRfjD56j-vFXgTQadM0w";
    trivia.loadGoogleSheet(googleSheetLink).then(displayWelcome); 
    trivia.categoriesEnabled = true;
  }
  
  //Loops continously for background effects and animations. (p5.js)
//   function draw() {
//     if (trivia.state == "welcome") background("yellow");
//     else if (trivia.state == "question") background("lightblue");
//     else if (trivia.state == "correct") background("green");
//     else if (trivia.state == "incorrect") background("red");
//     else if (trivia.state == "thankyou") background("orange");
//   }
  
  function displayWelcome() {
    $(".screen").hide();
    $("#welcome-screen").show();
    $("#question-count").html(`You have ${trivia.totalQuestions} questions waiting for you.`);
  }

  function displayCategories() {
    $(".screen").hide();
    $("#category-screen").show();
    trivia.insertCategoriesInfo();
  }
  
  function displayQuestion() {
    $(".screen").hide();
    $("#question-screen").show();
    $("#correctAnswer").removeClass("highlight");
    // $("#incorrectAnswer1").removeClass("highlight-wrong");
    // $("#incorrectAnswer2").removeClass("highlight-wrong");
    // $("#incorrectAnswer3").removeClass("highlight-wrong");
    $("#feedback").hide();
    trivia.insertQuestionInfo();
    trivia.shuffleAnswers();
  }
  
  function displayThankyou() {
    $(".screen").hide();
    $("#thankyou-screen").show();
    $("#game-results").html(`You got ${trivia.totalCorrect} of ${trivia.totalAnswered} correct.`);
  }
  
  function onClickedAnswer(isCorrect) {
    $('#score').html(`${trivia.totalCorrect} of ${trivia.totalQuestions} Correct`);
    if (isCorrect) $("#feedback").html(`Way to go!`).show();
    else $("#feedback").html(`Better luck next time.`).show();
    $("#correctAnswer").addClass("highlight"); //highlight right answer
    // $("#incorrectAnswer1").addClass("highlight-wrong"); //highlight wrong answer
    // $("#incorrectAnswer2").addClass("highlight-wrong"); //highlight wrong answer
    // $("#incorrectAnswer3").addClass("highlight-wrong"); //highlight wrong answer
    // $("#feedback").append(`<br><button onclick="trivia.gotoNextQuestion();">Next Question</br>`)
    setTimeout(trivia.gotoNextQuestion, 3000); //wait 3 secs...next question
  }

  function onClickedCategory() {
    displayQuestion();
  }

  function onClickedStart() {
    // displayQuestion();
    displayCategories();
  }