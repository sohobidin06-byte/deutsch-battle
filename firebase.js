// firebase.js
const firebaseConfig = {
  apiKey: "ТВОЙ_API_KEY",
  authDomain: "твой-проект.firebaseapp.com",
  
  // Для региона США (US Central) формат ссылки обычно такой:
  databaseURL: "https://germangame-b5626-default-rtdb.firebaseio.com/", 
  
  projectId: "твой-проект",
  storageBucket: "твой-проект.appspot.com",
  messagingSenderId: "твой-id",
  appId: "твой-app-id"
};

// Инициализация
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
