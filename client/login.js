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
    url: window.location.origin, 
    handleCodeInApp: true,
  };
  console.log(actionCodeSettings)
  sendSignInLinkToEmail(auth, email, actionCodeSettings)
    .then(() => {
      window.localStorage.setItem('emailForSignIn', email);
      console.log('Email link sent!',actionCodeSettings);
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
    console.log('Current URL:', currentUrl);
    console.log('Email retrieved from localStorage:', email);
  
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
        email: 'baprice01@gmail.com', // Input for the user's email address
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


