import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCPrIrDFUcpJwVj1JjRCeXTe_4GzlQt5hI",
  authDomain: "code-camp-showcase.firebaseapp.com",
  databaseURL: "https://code-camp-showcase-default-rtdb.firebaseio.com",
  projectId: "code-camp-showcase",
  storageBucket: "code-camp-showcase.firebasestorage.app",
  messagingSenderId: "1064086262345",
  appId: "1:1064086262345:web:f9f03f1a961408321c2598"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  // Pass the initialized app to getAuth

// Dashboard Vue instance
var dashboardApp = new Vue({
  el: '#dashboardApp',
  data: {
    user: null
  },
  methods: {
    checkSignIn: function () {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.user = user;
          console.log('User is signed in:', user);
        } else {
          window.location.href = "/login.html"; // Redirect to login if not signed in
        }
      });
    },
  },
  created: function () {
    // Automatically check for sign-in on app load
    this.checkSignIn();
  }
});