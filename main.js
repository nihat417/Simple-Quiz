const h1 = document.querySelector("h1"),
    h2 = document.getElementById("QuestionText"),
    ul = document.querySelector("ul"),
    btn1 = document.getElementById("btnNext"),
    btn2 = document.getElementById("backBtn"),
    btn3 = document.getElementById("refreshBtn"),
    btnContainer = document.getElementById("btnContainer"),
    showAnswersBtn = document.getElementById("showAnswersBtn"),
    finishEx = document.getElementById("finishExam"),
    answ = [],
    userAnswers = [];
let title = "",
    quiz = [],
    shuffledQuiz = [],
    currentQuizIndex = 0,
    maxQuestions = 0;

btn1.onclick = nextQuestion;
btn2.onclick = backQuestion;
finishEx.onclick = finishExam;
btn3.onclick = () => location.reload();
showAnswersBtn.onclick = showAnswers;

const quizzes = [
    { title: 'Felsefe', file: 'data/felsefe.json' },
    { title: 'Parca', file: 'data/quiz.json' },
    { title: 'texnkmex}', file: 'data/texnkmex.json' },
    { title: 'Iqtsadyat', file: 'data/iqtsadyat.json' }
];

quizzes.forEach((quiz, index) => {
    const btnStart = document.createElement("a");
    btnStart.className = "btn btn-outline-primary";
    btnStart.textContent = `Start ${quiz.title}`;
    btnStart.onclick = () => startQuiz(index);
    btnContainer.appendChild(btnStart);
});

function startQuiz(quizIndex) {
    currentQuizIndex = quizIndex;
    maxQuestions = prompt(`Enter the number of questions for ${quizzes[quizIndex].title} (default: 50):`) || 50;

    fetch(quizzes[quizIndex].file)
        .then(resp => {
            if (!resp.ok)
                throw new Error(`Failed to load quiz: ${resp.statusText}`);
            return resp.json();
        })
        .then(json => {
            title = json.title;
            quiz = json.quiz;
            shuffledQuiz = shuffleArray([...quiz]);
            h2.innerHTML = title;
            clearResults();
            ul.style.display = 'none';
            finishEx.style.display = 'none';
            showAnswersBtn.style.display = 'none';
            btn2.style.display = 'none';
            btn1.style.display = 'inline';
            btn1.innerHTML = "Start";
            btn1.style.background = "#464D77";
            currentQuizIndex = 0;
            btnContainer.style.display = 'none';
            btnContainer.classList.remove('d-flex', 'flex-column');
            startQuizWithQuestions();
        })
        .catch(error => {
            console.error(error);
            alert("Failed to load quiz. Please try again.");
        });
}

function startQuizWithQuestions() {
    ul.style.display = 'inline';
    finishEx.style.display = 'inline';
    btn1.style.display = 'inline';
    showAnswersBtn.style.display = 'none';
    btn2.style.display = 'none';
    btn1.style.display = 'inline';
    btn1.innerHTML = "Start";
    btn1.style.background = "#464D77";
    btnContainer.style.display = 'none';
    btnContainer.classList.remove('d-flex', 'flex-column');
    nextQuestion();
}

function nextQuestion() {
    if (currentQuizIndex < maxQuestions) {
        if (currentQuizIndex > 0)
            btn2.style.display = 'inline';
        h1.innerHTML = `${title}`;
        h2.innerHTML = `${currentQuizIndex + 1}` + shuffledQuiz[currentQuizIndex].question;
        ul.innerHTML = shuffledQuiz[currentQuizIndex].options.reduce((code, o, i) =>
            code += `<li><input onclick="saveAnsw(${currentQuizIndex},${i})" name="a" type="radio" ${answ[currentQuizIndex] === i ? ' checked' : ''} >${o}</li>`, '');
        btn1.innerHTML = currentQuizIndex < maxQuestions - 1 ? "Next" : "Submit";
        if (btn1.innerHTML !== "Next") {
            btn1.classList.remove('btn-outline-primary');
            btn1.classList.add('btn-outline-danger');
            finishEx.style.display = 'none';
        } else {
            btn1.classList.remove('btn-outline-danger');
            btn1.classList.add('btn-outline-primary');
        }
        currentQuizIndex++;
    } else
        showResults();
}

function backQuestion() {
    if (currentQuizIndex > 1) {
        currentQuizIndex--;
        h1.innerHTML = `${title}`;
        h2.innerHTML = `${currentQuizIndex}` + shuffledQuiz[currentQuizIndex - 1].question;
        ul.innerHTML = shuffledQuiz[currentQuizIndex - 1].options.reduce((code, o, i) =>
            code += `<li><input onclick="saveAnsw(${currentQuizIndex - 1},${i})" name="a" type="radio" ${answ[currentQuizIndex - 1] === i ? ' checked' : ''}>${o}</li>`, '');
        btn1.innerHTML = "Next";
        if (btn1.innerHTML !== "Next") {
            btn1.classList.remove('btn-outline-primary');
            btn1.classList.add('btn-outline-danger');
            finishEx.style.display = 'none';
        } else {
            btn1.classList.remove('btn-outline-danger');
            btn1.classList.add('btn-outline-primary');
            finishEx.style.display = 'inline';
        }
        btn2.innerHTML = "back";
        if (currentQuizIndex === 1) btn2.style.display = 'none';
    }
}

function finishExam() {
    finishEx.style.display = 'none';
    showResults();
}

function saveAnsw(q, i) {
    userAnswers[q] = i;
}

function showResults() {
    clearResults();
    let correctAnswr = 0;
    let falseAnswr = 0;
    let emptyAnswer = 0;

    for (let i = 0; i < userAnswers.length; i++) {
        userAnswers[i] != undefined ? (userAnswers[i] == shuffledQuiz[i].answer ? correctAnswr++ : falseAnswr++) : emptyAnswer++;
    }

    h1.innerHTML = `Quiz: ${title}`;
    h2.innerHTML = 'Results';
    ul.innerHTML = `
        <li style = "color:green;">True:${correctAnswr} </li>
        <li style = "color:red;">False:${falseAnswr} </li>
        <li style = "color:yellow;">Empty:${emptyAnswer} </li>
    `;
    btn1.style.display = "none";
    btn2.style.display = "none";
    showAnswersBtn.style.display = 'inline';
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function showAnswers() {
    h2.innerHTML = 'Correct and Incorrect Answers';
    ul.innerHTML = userAnswers.map((userAnswer, index) => {
        const question = shuffledQuiz[index];
        const isCorrect = userAnswer != undefined && userAnswer == question.answer;
        return `<li>${question.question} - ${isCorrect ? 'Correct' : 'Incorrect'}</li>`;
    }).join('');
    showAnswersBtn.style.display = 'none';
    btn3.style.display = 'inline';
}

function clearResults() {
    h1.innerHTML = "Quiz";
    h2.innerHTML = "";
    ul.innerHTML = "";
    btn1.style.display = "none";
    btn2.style.display = "none";
    btn3.style.display = "none";
    showAnswersBtn.style.display = 'none';
}
