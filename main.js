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
    loadCurrentAnswer();
    nextQuestion();
}

function createOptionElement(index) {
    const optionElement = document.createElement("li");
    const inputElement = document.createElement("input");

    inputElement.type = "radio";
    inputElement.name = "a";
    inputElement.checked = answ[currentQuizIndex] === index;

    inputElement.onclick = function() {
        saveAnsw(currentQuizIndex, index);
    };

    optionElement.appendChild(inputElement);
    optionElement.innerHTML += shuffledQuiz[currentQuizIndex].options[index];

    return optionElement;
}

function nextQuestion() {
    if (currentQuizIndex < maxQuestions) {
        if (currentQuizIndex > 0)
            btn2.style.display = 'inline';
        saveCurrentAnswer();
        h1.innerHTML = `${title}`;
        h2.innerHTML = `${currentQuizIndex + 1}` + shuffledQuiz[currentQuizIndex].question;
        ul.innerHTML = "";
        for (let i = 0; i < shuffledQuiz[currentQuizIndex].options.length; i++) 
            ul.appendChild(createOptionElement(i));
        btn1.innerHTML = currentQuizIndex < maxQuestions - 1 ? "Next" : "Submit";
        if (btn1.innerHTML !== "Next") {
            btn1.classList.remove('btn-outline-primary');
            btn1.classList.add('btn-outline-danger');
            finishEx.style.display = 'none';
        } 
        else {
            btn1.classList.remove('btn-outline-danger');
            btn1.classList.add('btn-outline-primary');
        }
        currentQuizIndex++;
        loadCurrentAnswer();
    } else 
        showResults();
}

function backQuestion() {
    if (currentQuizIndex > 0) {
        saveCurrentAnswer();
        currentQuizIndex--;
        h1.innerHTML = `${title}`;
        h2.innerHTML = `${currentQuizIndex + 1}` + shuffledQuiz[currentQuizIndex].question;
        ul.innerHTML = "";
        for (let i = 0; i < shuffledQuiz[currentQuizIndex].options.length; i++) 
            ul.appendChild(createOptionElement(i));
        btn1.innerHTML = currentQuizIndex < maxQuestions - 1 ? "Next" : "Submit";
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
        if (currentQuizIndex === 0) btn2.style.display = 'none';
        loadCurrentAnswer();
    }
}



function finishExam() {
    finishEx.style.display = 'none';
    showResults();
}

function saveAnsw(q, i) {
    userAnswers[q] = i;
}

function saveCurrentAnswer() {
    const selectedOption = document.querySelector(`input[name="a"]:checked`);
    if (selectedOption) {
        const selectedIndex = Array.from(ul.children).indexOf(selectedOption.parentElement);
        saveAnsw(currentQuizIndex-1, selectedIndex);
    }
}

function loadCurrentAnswer() {
    const savedAnswerIndex = userAnswers[currentQuizIndex - 1];
    if (savedAnswerIndex !== undefined) {
        const optionInput = ul.children[savedAnswerIndex].querySelector('input');
        if (optionInput) {
            optionInput.checked = true;
        }
        else {
            const selectedOption = document.querySelector(`input[name="a"]:checked`);
            if (selectedOption) {
                selectedOption.checked = false;
            }
        }
    }
}


function showResults() {
    saveCurrentAnswer();
    clearResults();
    let correctAnswr = 0;
    let falseAnswr = 0;
    let emptyAnswer = 0;

    for (let i = 0; i < maxQuestions; i++) {
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
        const isCorrect = userAnswer !== undefined && userAnswer === question.answer;
        const colorStyle = isCorrect ? 'color:green;' : 'color:red;';
        return `<li>${question.question} - <span style="${colorStyle}">${isCorrect ? 'Correct' : 'Incorrect'}</span></li>`;
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
