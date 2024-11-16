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



var AppName = new Vue({
    el: '#AppName',
    data: {
        userName: '',
        linkedIn: ""
    },
    methods: {
        myMethod: function () {
        },
        postUserInfo: async function() {
            console.log("here")
            
            const idToken = await auth.currentUser.getIdToken();
            console.log(`Bearer ${idToken}`)

            fetch(`https://app-ia6miajuua-uc.a.run.app/users/updateInfo`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                  },
                body:JSON.stringify({
                    "username": this.userName,
                    "linkedInURL": this.linkedIn
                })
                  
            }).then(response => response.json())  // Parse the response as JSON
            .then(data => {
                console.log("Response from server:", data);
            })
        },
    },
    filters: {
        format: function (date) {
        // momentjs
        //return moment(date).format('L');
        }
    },
    created: function () {
        // when app loads run this code
    }
})