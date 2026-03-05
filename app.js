let name, myTeam, roomID;
let words = [
  {de:"Haus", kg:"Үй", ru:"Дом"},
  {de:"Baum", kg:"Бак", ru:"Дерево"},
  {de:"Buch", kg:"Китеп", ru:"Книга"}
];
let currentWord, qTimer;

// Кирүү
function joinGame() {
    name = document.getElementById("name-input").value.trim();
    roomID = "777"; // мисалы бөлмө коду
    myTeam = 1; // мисалы, сиздин команда
    if(!name) return alert("Атыңызды жазыңыз!");
    
    // Firebase базага оюнчу кошуу
    db.ref('rooms/' + roomID + '/players/' + name).set({team: myTeam, name: name});
    
    document.querySelector("input").style.display="none";
    document.querySelector("button").style.display="none";
    document.getElementById("game-screen").style.display="block";

    listenRoom();   // реал тайм угуу
    nextQuestion(); // биринчи суроо
    startGameTimer(); 
}

// Реал тайм угуу
function listenRoom() {
    db.ref('rooms/' + roomID).on('value', snapshot => {
        const data = snapshot.val() || {};
        let pos = data.pos || 0;
        document.getElementById("rope").style.transform = `translateX(${pos}px)`;
    });
}

// Суроо чыгуу
function nextQuestion() {
    currentWord = words[Math.floor(Math.random()*words.length)];
    document.getElementById("q-text").innerText = currentWord.kg;
    document.getElementById("ans-input").value="";
    startQTimer();
}

// Суроо таймери
function startQTimer() {
    let timeLeft = 20;
    clearInterval(qTimer);
    qTimer = setInterval(() => {
        timeLeft--;
        document.getElementById("q-timer").innerText = timeLeft;
        if(timeLeft <=0) nextQuestion();
    },1000);
}

// Жооп жөнөтүү
function submitAnswer() {
    let ans = document.getElementById("ans-input").value.trim().toLowerCase();
    if(ans === currentWord.de.toLowerCase()) {
        // Firebaseге rope позициясын жаңылоо
        db.ref('rooms/' + roomID).once('value').then(snap=>{
            let data = snap.val() || {pos:0};
            data.pos = data.pos || 0;
            data.pos += (myTeam===1 ? -45 : 45);
            db.ref('rooms/' + roomID).update({pos: data.pos});
            nextQuestion();
        });
    } else {
        let box = document.querySelector(".quiz-box");
        box.style.background = "rgba(244,63,94,0.2)";
        setTimeout(()=>box.style.background="rgba(255,255,255,0.05)",500);
    }
}

// Оюн таймери
function startGameTimer() {
    let total = 180;
    setInterval(()=>{
        total--;
        let m = Math.floor(total/60), s = total%60;
        document.getElementById("game-timer").innerText = `${m}:${s<10?'0':''}${s}`;
        if(total<=0) alert("Оюн бүттү!");
    },1000);
}