let name, myTeam = 1;
let words = [
    {de:"Haus", kg:"Үй", ru:"Дом"},
    {de:"Baum", kg:"Бак", ru:"Дерево"},
    {de:"Buch", kg:"Китеп", ru:"Книга"},
];
let currentWord, ropePos = 0;
let qTimer;

function joinGame() {
    name = document.getElementById("name-input").value.trim();
    if(!name) return alert("Атыңызды жазыңыз!");
    document.querySelector("input").style.display="none";
    document.querySelector("button").style.display="none";
    document.getElementById("game-screen").style.display="block";
    nextQuestion();
    startGameTimer();
}

function nextQuestion() {
    currentWord = words[Math.floor(Math.random()*words.length)];
    document.getElementById("q-text").innerText = currentWord.kg;
    document.getElementById("ans-input").value="";
    startQTimer();
}

function startQTimer() {
    let timeLeft = 20;
    clearInterval(qTimer);
    qTimer = setInterval(() => {
        timeLeft--;
        document.getElementById("q-timer").innerText = timeLeft;
        if(timeLeft <=0) nextQuestion();
    }, 1000);
}

function submitAnswer() {
    let ans = document.getElementById("ans-input").value.trim().toLowerCase();
    if(ans === currentWord.de.toLowerCase()) {
        ropePos += (myTeam===1? -45 : 45);
        document.getElementById("rope").style.transform = `translateX(${ropePos}px)`;
        nextQuestion();
    } else {
        let box = document.querySelector(".quiz-box");
        box.style.background = "rgba(244,63,94,0.2)";
        setTimeout(()=>box.style.background="rgba(255,255,255,0.05)",500);
    }
}

function startGameTimer() {
    let total = 180;
    setInterval(()=>{
        total--;
        let m = Math.floor(total/60), s = total%60;
        document.getElementById("game-timer").innerText = `${m}:${s<10?'0':''}${s}`;
        if(total<=0) alert("Оюн бүттү!");
    },1000);
}