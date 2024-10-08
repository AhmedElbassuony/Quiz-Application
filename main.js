// Select Elements
let countSpan = document.querySelector(".quiz-info .count span");
let bulletsContainer = document.querySelector(".bullets .spans");
let questionArea = document.querySelector(".question-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let countDownElement = document.querySelector(".countdown");

// Set Options
let currentindex = 0;
let numberOfRightAnswers = 0;
let countDownInterval;

function getQuestinos() {
  let myRequest = new XMLHttpRequest(); // ajax

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questions = JSON.parse(this.responseText); // array of objects
      let questionsNumber = questions.length;

      // Create Bullets + Set Questinos Count
      createBullets(questionsNumber);

      // Add Quesion
      addQuestinoData(questions[currentindex], questionsNumber);

      // When Click The Button
      submitButton.onclick = () => {
        let rightAnswer;
        if (currentindex !== questionsNumber) {
          rightAnswer = questions[currentindex].right_answer;
          currentindex++;
          checkAnswer(rightAnswer, questionsNumber);
          clearInterval(countDownInterval);
          // Remove Previous Question if there is next
          if (currentindex !== questionsNumber) {
            questionArea.innerHTML = "";
            answersArea.innerHTML = "";
            // add next question
            addQuestinoData(questions[currentindex], questionsNumber);
          } else {
            // it is just like hover so i should give it style
            // background-color: black;
            // opacity: 0.4;
            // cursor: no-drop;
            submitButton.disabled = true;
            showResult(questionsNumber);
          }
        }
      };
    }
  };

  myRequest.open("Get", "html_questions.json", true); // the third parameter is Asynchronous or not
  myRequest.send();
  // Asynchronous requests allow your web application to continue
  // running while waiting for a response from the server.
  // This means that the user can still interact with the page,
  // and other scripts can continue to execute without being blocked
  // by the request.
}

getQuestinos();

function createBullets(num) {
  countSpan.innerHTML = num;

  // Create Bullets
  for (let i = 1; i <= num; i++) {
    // Create Bullet
    let spanBullet = document.createElement("span");
    spanBullet.append(i);
    spanBullet.className = `q_${i}`;
    // Checkk First Span
    if (i === 1) {
      spanBullet.classList.add("current");
    }
    // Add It To Container
    bulletsContainer.appendChild(spanBullet);
  }
}

function addQuestinoData(question, num) {
  // Create The Question
  let qHeading = document.createElement("h2");
  qHeading.append(question.title);
  // Add The Question
  questionArea.append(qHeading);

  // Create Answers
  for (let i = 1; i <= 4; i++) {
    // Create Div Answer
    let div = document.createElement("div");
    div.className = "answer";

    // Create Radio Input
    let input = document.createElement("input");
    // Add Attributes
    input.type = "radio";
    input.name = "question";
    input.id = `answer_${i}`;
    input.dataset.answer = question[`answer_${i}`];

    // Create Label
    let label = document.createElement("label");
    label.append(question[`answer_${i}`]);
    // Add for Attribute
    label.htmlFor = `answer_${i}`;

    // Add Input And Label To Answer Div
    div.append(input);
    div.append(label);

    // Add The Answer Div To Answers Area
    answersArea.append(div);
  }

  // make bullete of this question current
  document.querySelector(`.q_${currentindex + 1}`).classList.add("current");

  // add the countdown
  countdown(120);
}

function checkAnswer(rAnswer, num) {
  let Answers = document.getElementsByName("question");
  let answer;
  Answers.forEach((e) => {
    if (e.checked) {
      answer = e.dataset.answer;
    }
  });
  if (answer === rAnswer) {
    numberOfRightAnswers++;
    document.querySelector(`.q_${currentindex}`).classList.add("yes");
  } else {
    document.querySelector(`.q_${currentindex}`).classList.add("no");
  }
}

function showResult(num) {
  let result = document.querySelector(".results");
  let resultSpan = document.querySelector(".results span");
  if (numberOfRightAnswers < num / 2) {
    resultSpan.append("Bad");
    resultSpan.className = "bad";
  } else if (numberOfRightAnswers < (4 * num) / 5) {
    resultSpan.append("Good");
    resultSpan.className = "good";
  } else {
    resultSpan.append("Perfect");
    resultSpan.className = "perfect";
  }
  result.append(`you answerd ${numberOfRightAnswers} from ${num}`);
}

function countdown(duration) {
  let minutes, seconds;
  countDownInterval = setInterval(function () {
    minutes = parseInt(duration / 60);
    seconds = parseInt(duration % 60);

    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    countDownElement.innerHTML = `${minutes}:${seconds}`;

    if (--duration < 0) {
      clearInterval(countDownInterval);
      // click The Button
      submitButton.click();
    }
  }, 1000);
}
