let name, myTeam = 1, roomID = "777";
let gameWords = [], currentWord, qTimer;

// 1. Админ үчүн сөз кошуу
function addWordToDB() {
    let de = document.getElementById("new-de").value.trim();
    let kg = document.getElementById("new-kg").value.trim();
    let ru = document.getElementById("new-ru").value.trim();
    if(de && kg && ru) {
        db.ref('all_words').push({ de, kg, ru });
        alert("Кошулду!");
        document.querySelectorAll(".admin-panel input").forEach(i => i.value = "");
    }
}

// 2. Оюнга кирүү
function joinGame() {
    name = document.getElementById("name-input").value.trim();
    if(!name) return alert("Ат жазыңыз!");

    db.ref('all_words').once('value').then(snap => {
        let data = snap.val();
        if(!data) return alert("База бош! Сөз кошуңуз.");
        gameWords = Object.values(data);
        
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("game-screen").style.display = "block";
        
        listenRoom();
        nextQuestion();
        startGameTimer();
        startAIBot(); // ИИни иштетүү
    });
}

// 3. Суроо чыгаруу (Кыргызча же Орусча)
function nextQuestion() {
    currentWord = gameWords[Math.floor(Math.random() * gameWords.length)];
    let lang = Math.random() > 0.5 ? 'kg' : 'ru';
    document.getElementById("q-text").innerText = currentWord[lang];
    document.getElementById("ans-input").value = "";
    startQTimer();
}

// 4. Жоопту текшерүү
function submitAnswer() {
    let ans = document.getElementById("ans-input").value.trim().toLowerCase();
    let box = document.querySelector(".quiz-box");

    if(ans === currentWord.de.toLowerCase()) {
        updateRope(-50); // Туура болсо солго (биз тарапка)
        nextQuestion();
    } else {
        box.style.animation = "shake 0.4s";
        setTimeout(() => box.style.animation = "", 400);
    }
}

// 5. ИИ (Бот) логикасы
function startAIBot() {
    setInterval(() => {
        if(Math.random() > 0.6) { // 40% мүмкүнчүлүк менен Бот арканды тартат
            updateRope(40); 
            console.log("Бот тартты!");
        }
    }, 8000); // Ар 8 секундда
}

function updateRope(shift) {
    db.ref('rooms/' + roomID).once('value').then(snap => {
        let data = snap.val() || { pos: 0 };
        db.ref('rooms/' + roomID).update({ pos: (data.pos || 0) + shift });
    });
}

function listenRoom() {
    db.ref('rooms/' + roomID).on('value', snap => {
        let pos = snap.val()?.pos || 0;
        document.getElementById("rope").style.transform = `translateX(${pos}px)`;
        if(pos < -200) alert("Сиз жеңдиңиз!");
        if(pos > 200) alert("ИИ жеңди!");
    });
}

// Таймерлер (жөнөкөйлөтүлгөн)
function startQTimer() {
    let t = 20;
    clearInterval(qTimer);
    qTimer = setInterval(() => {
        t--;
        document.getElementById("q-timer").innerText = t;
        if(t <= 0) nextQuestion();
    }, 1000);
}

function startGameTimer() {
    let total = 180;
    setInterval(() => {
        total--;
        let m = Math.floor(total/60), s = total%60;
        document.getElementById("game-timer").innerText = `${m}:${s<10?'0':''}${s}`;
    }, 1000);
}
