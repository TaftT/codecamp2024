import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";


const apiUrl = "https://app-ia6miajuua-uc.a.run.app"
// const apiUrl =  "http://127.0.0.1:5001/code-camp-showcase/us-central1/app"
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

function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
}

// Dashboard Vue instance
var dashboardApp = new Vue({
    el: '#dashboardApp',
    data: {
      user: null,
      isClicked:false,
      competitionName: "",
      imageUrl: "",
      judgeEmails:"",
      competitionPasscode:"",
      competitionDescription:"",
      errorMessage:"",
      menuOpen:false
    },
    methods: {
      checkSignIn: function () {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            this.user = user;
            console.log('User is signed in:', user);
            const idToken = await auth.currentUser.getIdToken();
            console.log(`Bearer ${idToken}`)
          } else {
            window.location.href = "/login.html"; // Redirect to login if not signed in
          }
        });
      },
      submitNewComp: async function () {
        console.log("Button clicked");
        // Check if the user is logged in
        if (auth.currentUser && !this.isClicked) {
          try {
            if (
              this.competitionName.trim() !== "" &&
              this.judgeEmails.trim() !== "" &&
              this.competitionPasscode.trim() !== "" &&
              this.competitionDescription.trim() !== "" &&
              isValidURL(this.imageUrl.trim())
          ){
            this.isClicked=true;
             // Get the ID token
             const idToken = await auth.currentUser.getIdToken();
             console.log(`Bearer ${idToken}`)
             // If we have the token, send the request
             const response = await fetch("https://app-ia6miajuua-uc.a.run.app/competitions/new", { // replace with your actual API URL
               method: 'PUT',
               headers: {
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${idToken}`, // Send the ID token in the Authorization header
               },
               body: JSON.stringify({
                 name: this.competitionName,
                 description:this.competitionDescription,
                 FeatureImageUrl: this.imageUrl,
                 passcode:this.competitionPasscode,
                 judgeEmails:this.judgeEmails
                 
                 
             })
               
             });
   
             const data = await response.json();
             console.log('Server Response:', data); // Handle the response from the server 
             window.location.href = 'index.html';
            
          }
          else{
            this.errorMessage="Please fill in all fields or check that emails/urls are correct."
          }
           
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