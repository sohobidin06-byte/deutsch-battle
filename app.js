let userName, myTeam = 1, roomID = "777";
let gameWords = [], currentWord, qTimer, gameInterval;

// --- 1. МАССАЛЫК СӨЗ КОШУУ ---
function addBulkWords() {
    const text = document.getElementById("bulk-text").value.trim();
    if (!text) return alert("Текстти жазыңыз!");

    const lines = text.split('\n');
    let count = 0;

    lines.forEach(line => {
        const parts = line.split(/[-/]/).map(item => item.trim()); // "-" же "/" аркылуу бөлөт
        if (parts.length >= 3) {
            db.ref('all_words').push({ de: parts[0], kg: parts[1], ru: parts[2] });
            count++;
        }
    });

    if (count > 0) {
        alert(`${count} сөз ийгиликтүү кошулду!`);
        document.getElementById("bulk-text").value = "";
    } else {
        alert("Ката! Формат: Немисче - Кыргызча - Орусча");
    }
}

// --- 2. ОЮНГА КИРҮҮ ---
function joinGame() {
    userName = document.getElementById("name-input").value.trim();
    if (!userName) return alert("Атыңызды жазыңыз!");

    db.ref('all_words').once('value').then(snap => {
        const data = snap.val();
        if (!data) return alert("Базада сөз жок! Алдын ала кошуңуз.");
        
        gameWords = Object.values(data);
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("game-screen").style.display = "block";

        startRoomSync();
        nextQuestion();
        startGameTimer();
        startAIBot(); // ИИ Ботту иштетүү
    });
}

// --- 3. СУРОО-ЖООП ЛОГИКАСЫ ---
function nextQuestion() {
    currentWord = gameWords[Math.floor(Math.random() * gameWords.length)];
    let lang = Math.random() > 0.5 ? 'kg' : 'ru';
    document.getElementById("q-text").innerText = `${currentWord[lang]} (${lang.toUpperCase()})`;
    document.getElementById("ans-input").value = "";
    document.getElementById("ans-input").focus();
    resetQuestionTimer();
}

function submitAnswer() {
    let ans = document.getElementById("ans-input").value.trim().toLowerCase();
    if (ans === currentWord.de.toLowerCase()) {
        updateRope(-40); // Туура болсо биз тарапка (солго)
        nextQuestion();
    } else {
        document.querySelector(".quiz-box").style.boxShadow = "0 0 20px red";
        setTimeout(() => document.querySelector(".quiz-box").style.boxShadow = "none", 500);
    }
}

// --- 4. ИИ БОТ (Каршылаш) ---
function startAIBot() {
    setInterval(() => {
        // Бот 40% ийгилик менен ар 7 секундда арканды тартат
        if (Math.random() < 0.4) {
            updateRope(30); 
            console.log("Бот тартты!");
        }
    }, 7000);
}

// --- 5. ФИРEБАСЕ СИНХРОНИЗАЦИЯ ---
function updateRope(shift) {
    db.ref('rooms/' + roomID).once('value').then(snap => {
        let pos = (snap.val()?.pos || 0) + shift;
        db.ref('rooms/' + roomID).update({ pos: pos });
    });
}

function startRoomSync() {
    db.ref('rooms/' + roomID).on('value', snap => {
        let pos = snap.val()?.pos || 0;
        document.getElementById("rope").style.transform = `translateX(${pos}px)`;
        
        if (pos < -250) endGame("Сиз жеңдиңиз! 🎉");
        if (pos > 250) endGame("ИИ Бот жеңди! 🤖");
    });
}

// --- 6. ТАЙМЕРЛЕР ---
function startGameTimer() {
    let timeLeft = 180;
    gameInterval = setInterval(() => {
        timeLeft--;
        let m = Math.floor(timeLeft/60), s = timeLeft%60;
        document.getElementById("game-timer").innerText = `${m}:${s<10?'0':''}${s}`;
        if (timeLeft <= 0) endGame("Убакыт бүттү!");
    }, 1000);
}

function resetQuestionTimer() {
    let t = 20;
    clearInterval(qTimer);
    qTimer = setInterval(() => {
        t--;
        document.getElementById("q-timer").innerText = t;
        if (t <= 0) nextQuestion();
    }, 1000);
}

function endGame(msg) {
    alert(msg);
    location.reload();
}
