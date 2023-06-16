const h1 = document.querySelector("h1");
const h2 = document.querySelector("h2");
const ul = document.querySelector("ul");
const btn1 = document.getElementById("btnNext");
const btn2=document.getElementById("backBtn");
const btn3=document.getElementById("refreshBtn");
const answ = [];
let title = "";
let quiz = [];
let x = 0;

fetch('data/quiz.json')
    .then(resp => resp.json())
    .then(json => {
        title = json.title
        quiz = json.quiz
        h2.innerHTML = title
})

btn1.onclick = nextQuestion;
btn2.onclick=backQuestion;
btn3.onclick = ()=>location.reload();

function nextQuestion() {
    if ( x < quiz.length ) {
        h1.innerHTML = `Question: ${x + 1}`
        h2.innerHTML = quiz[x].question
        ul.innerHTML = quiz[x].options.reduce( (code, o, i) => code += `<li><input onclick="saveAnsw(${x},${i})" name="a" type="radio">${o}</li>` , '' );
        btn1.innerHTML = x < quiz.length - 1 ? "Next" : "Submit";
        btn1.style.background = btn1.innerHTML != "Next" ? "red" : "#464D77";
        x++
        if(x>1) btn2.style.display='inline';
    } else showResults()
} 

function backQuestion(){
    if(x > 1)
    {
        x--;
        h1.innerHTML = `Question: ${x}`
        h2.innerHTML = quiz[x-1].question
        ul.innerHTML = quiz[x-1].options.reduce( (code, o, i) => code += `<li><input onclick="saveAnsw(${x-1},${i})" name="a" type="radio" ${answ[x - 1] === i ? ' checked' : ''}>${o}</li>` , '' );
        btn1.innerHTML = "Next";
        btn1.style.background="#464D77";
        btn2.innerHTML = "back";
        if(x==1) btn2.style.display='none';
    }
}

function saveAnsw(q, i) {
    answ[q] = i
}

function showResults() {
    console.log(answ);
    let correctAnswr=0;
    let falseAnswr=0;
    let emptyAnswer=0;
    
    for (let i = 0; i < quiz.length; i++) {
        answ[i]!=undefined ?(answ[i]==quiz[i].answer ? correctAnswr++ :falseAnswr++):emptyAnswer++; 
    }

    h1.innerHTML = `Quiz: ${title}`
    h2.innerHTML = 'Results'
    ul.innerHTML = `
        <li>True:${correctAnswr} </li>
        <li>False:${falseAnswr} </li>
        <li>Empty:${emptyAnswer} </li>
        `
    btn1.style.display = "none";
    btn2.style.display = "none";
    btn3.style.display="inline";

}