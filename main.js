const h1 = document.querySelector("h1"),h2 = document.querySelector("h2"),
ul = document.querySelector("ul"),btn1 = document.getElementById("btnNext"),
btn2 = document.getElementById("backBtn"),btn3 = document.getElementById("refreshBtn"),
btnContainer = document.getElementById("btnContainer"),showAnswersBtn = document.getElementById("showAnswersBtn"),
answ = [],userAnswers = [],maxQuestions = 50;
let title = "",quiz = [],shuffledQuiz = [],currentQuizIndex = 0;



btn1.onclick = nextQuestion;
btn2.onclick = backQuestion;
btn3.onclick = () => location.reload();
document.getElementById("showAnswersBtn").onclick = showAnswers;
const quizzes = [
    { title: 'Felsefe', file: 'data/felsefe.json' },
    { title: 'Parca', file: 'data/quiz.json' },
    { title: 'texnkmex}', file: 'data/texnkmex.json'},
    { title: 'Iqtsadyat', file: 'data/iqtsadyat.json'}
];

quizzes.forEach((quiz, index) => {
    const btnStart = document.createElement("button");
    btnStart.className = "btn btn-warning mb-2"; 
    btnStart.textContent = `Start ${quiz.title}`;
    btnStart.onclick = () => loadAndStartQuiz(index);
    btnContainer.appendChild(btnStart);
});



function loadAndStartQuiz(quizIndex) {
    currentQuizIndex = quizIndex;
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
            startQuiz();
        })
        .catch(error => {
            console.error(error);
            alert("Failed to load quiz. Please try again.");
        });
}




function startQuiz() {
    clearResults();
    ul.style.display = 'inline'
    btn1.style.display = 'inline';
    showAnswersBtn.style.display = 'none';
    btn2.style.display = 'none';
    btn1.style.display = 'inline';
    btn1.innerHTML = "Start";
    btn1.style.background = "#464D77";
    currentQuizIndex = 0;
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
        btn1.style.background = btn1.innerHTML !== "Next" ? "red" : "#464D77";
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
        btn1.style.background = "#464D77";
        btn2.innerHTML = "back";
        if (currentQuizIndex === 1) btn2.style.display = 'none';
    }
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