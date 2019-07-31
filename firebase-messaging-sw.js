importScripts('https://www.gstatic.com/firebasejs/6.3.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.3.0/firebase-messaging.js');

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyB6dAkDfLqA790njRSb64IAB9-BmPI6fJY",
    authDomain: "push-test-jav.firebaseapp.com",
    databaseURL: "https://push-test-jav.firebaseio.com",
    projectId: "push-test-jav",
    storageBucket: "push-test-jav.appspot.com",
    messagingSenderId: "971122330221",
    appId: "1:971122330221:web:90872652bf6e2c6b"
};
// Initialize Firebase    
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();