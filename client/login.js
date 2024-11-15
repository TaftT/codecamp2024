import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

// Your Firebase config
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
const auth = getAuth(app);

// Send email link for passwordless login
const sendEmailLink = (email) => {
  const actionCodeSettings = {
    url: "http://localhost:8000/login.html",  // The URL you want to redirect to after clicking the email link
    handleCodeInApp: true,
  };

  sendSignInLinkToEmail(auth, email, actionCodeSettings)
    .then(() => {
      window.localStorage.setItem('emailForSignIn', email);
      console.log('Email link sent!');
    })
    .catch((error) => {
      console.error('Error sending email link:', error);
    });
};

// Handle email link sign-in
const handleEmailLinkSignIn = () => {
  const currentUrl = window.location.href;

  if (isSignInWithEmailLink(auth, currentUrl)) {
    let email = window.localStorage.getItem('emailForSignIn');
    
    if (!email) {
      email = window.prompt('Please provide your email for confirmation');
    }

    signInWithEmailLink(auth, email, currentUrl)
      .then((result) => {
        console.log('Successfully signed in!', result.user);
        window.localStorage.removeItem('emailForSignIn');
        window.location.href = "/"; // Redirect to a page after sign-in
      })
      .catch((error) => {
        console.error('Error signing in with email link:', error);
      });
  }
};

// Check authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User is signed in:', user);
    window.location.href = "/createCompetition.html"; // Redirect if already signed in
  }
});

var AppName = new Vue({
    el: '#AppName',
    data: {
        email: 'thistaft@gmail.com', // Input for the user's email address
        error:'',
    },
    methods: {
        sendLink: function () {
            if (this.email) {
                sendEmailLink(this.email); // Call the Firebase method to send an email link
            } else {
                this.error = 'Email is required!';
            }
        },
        checkSignIn: function () {
            handleEmailLinkSignIn(); // Handle sign-in if redirected back
        },
        resetError: function () {
            // Reset the error message when a key is pressed
            this.error = '';
        }
    },
    created: function () {
        // Automatically check for sign-in on app load
        this.checkSignIn();
    }
});


