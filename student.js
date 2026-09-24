const sentences = {
  easy: [
    "The sun is shining today.",
    "I like to read books.",
    "My school is very nice."
  ],

  medium: [
    "Learning to type quickly can save a lot of time.",
    "Practice every day to improve your typing skills.",
    "English typing becomes easier with regular practice."
  ],

  hard: [
    "Accurate typing requires concentration, patience, and consistent practice.",
    "Technology has changed the way students learn and communicate.",
    "Developing excellent typing skills can help students work more efficiently."
  ]
};

const level = document.getElementById("level");
const lesson = document.getElementById("lesson");
const timeLimit = document.getElementById("timeLimit");

const lessonTitle = document.getElementById("lessonTitle");
const sentenceBox = document.getElementById("sentence");
const typingInput = document.getElementById("typingInput");

const startBtn = document.getElementById("startBtn");
const finishBtn = document.getElementById("finishBtn");

const timeDisplay = document.getElementById("time");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const errorsDisplay = document.getElementById("errors");

const resultBox = document.getElementById("result");
const studentName = document.getElementById("studentName");
const studentClass = document.getElementById("studentClass");
const submitBtn = document.getElementById("submitBtn");

let timer = null;
let startTime = null;
let elapsedSeconds = 0;
let isRunning = false;

function loadLesson() {

  const selectedLevel = level.value;
  const lessonNumber = Number(lesson.value);

  const sentence = sentences[selectedLevel][lessonNumber - 1];

  sentenceBox.textContent = sentence;

  lessonTitle.textContent =
    `Lesson ${lessonNumber} - ${
      selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)
    }`;

}

function startTyping() {

  if (isRunning) return;

  isRunning = true;

  typingInput.disabled = false;
  typingInput.focus();

  startBtn.disabled = true;
  finishBtn.disabled = false;

  resultBox.classList.add("hidden");

  startTime = Date.now();

  timer = setInterval(() => {

    elapsedSeconds = Math.floor(
      (Date.now() - startTime) / 1000
    );

    updateTime();

    calculateStats();

    if (elapsedSeconds >= Number(timeLimit.value)) {
      finishTyping();
    }

  }, 200);

}

function finishTyping() {

  if (!isRunning) return;

  isRunning = false;

  clearInterval(timer);

  typingInput.disabled = true;
  finishBtn.disabled = true;
  startBtn.disabled = false;

  calculateStats();

  resultBox.classList.remove("hidden");

}

function updateTime() {

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  timeDisplay.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}

function calculateStats() {

  const target = sentenceBox.textContent;
  const typed = typingInput.value;

  let errors = 0;

  for (let i = 0; i < typed.length; i++) {

    if (typed[i] !== target[i]) {
      errors++;
    }

  }

  errorsDisplay.textContent = errors;

  const correctCharacters = Math.max(
    0,
    typed.length - errors
  );

  const accuracy =
    typed.length === 0
      ? 100
      : Math.round(
          (correctCharacters / typed.length) * 100
        );

  accuracyDisplay.textContent = `${accuracy}%`;

  const minutes = elapsedSeconds / 60;

  const wpm =
    minutes > 0
      ? Math.round((correctCharacters / 5) / minutes)
      : 0;

  wpmDisplay.textContent = wpm;

}

level.addEventListener("change", () => {

  lesson.value = "1";
  loadLesson();

});

lesson.addEventListener("change", loadLesson);

timeLimit.addEventListener("change", () => {

  if (!isRunning) {
    elapsedSeconds = 0;
    updateTime();
  }

});

startBtn.addEventListener("click", startTyping);

finishBtn.addEventListener("click", finishTyping);

typingInput.addEventListener("input", calculateStats);

submitBtn.addEventListener("click", () => {

  const name = studentName.value.trim();
  const studentClassValue = studentClass.value.trim();

  if (!name || !studentClassValue) {

    alert("Please enter your name and class.");

    return;
  }

  const data = {

    name: name,

    class: studentClassValue,

    level: level.value,

    lesson: lesson.value,

    wpm: Number(wpmDisplay.textContent),

    accuracy: accuracyDisplay.textContent,

    errors: Number(errorsDisplay.textContent),

    time: timeDisplay.textContent,

    date: new Date().toISOString()

  };

  console.log("Student Result:", data);

  alert("Result saved successfully!");

  studentName.value = "";
  studentClass.value = "";

});

loadLesson();