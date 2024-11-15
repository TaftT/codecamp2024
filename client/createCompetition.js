import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";


// const apiUrl = "https://app-ia6miajuua-uc.a.run.app"
const apiUrl =  "http://127.0.0.1:5001/code-camp-showcase/us-central1/app"
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

const getIdToken = async () => {
    const user = auth.currentUser;
    if (user) {
      // Get ID token from Firebase Authentication
      const idToken = await user.getIdToken();
      return idToken;
    }
    return null;
  };

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
            // window.location.href = "/login.html"; // Redirect to login if not signed in
          }
        });
      },
      submitNewComp: async function () {
        console.log("Button clicked");
        // Check if the user is logged in
        if (auth.currentUser) {
          try {
            // Get the ID token
            const idToken = await auth.currentUser.getIdToken();
            console.log(`Bearer ${idToken}`)
            // If we have the token, send the request
            const response = await fetch(apiUrl+'/test', { // replace with your actual API URL
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`, // Send the ID token in the Authorization header
              }
              
            });
  
            const data = await response.json();
            console.log('Server Response:', data); // Handle the response from the server
            
          } catch (error) {
            console.error('Error in submitting new competition:', error);
          }
        } else {
          console.error('User is not authenticated.');
          window.location.href = "/login.html"; // Redirect to login if not authenticated
        }
      }
    },
    created: function () {
      // Automatically check for sign-in on app load
      this.checkSignIn();
    }
  });