import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyCPrIrDFUcpJwVj1JjRCeXTe_4GzlQt5hI",
    authDomain: "code-camp-showcase.firebaseapp.com",
    databaseURL: "https://code-camp-showcase-default-rtdb.firebaseio.com",
    projectId: "code-camp-showcase",
    storageBucket: "code-camp-showcase.firebasestorage.app",
    messagingSenderId: "1064086262345",
    appId: "1:1064086262345:web:f9f03f1a961408321c2598"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

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
          // Redirect to the main app page after successful sign-in
        //   window.location.href = "/mainAppPage.html";
        })
        .catch((error) => {
          console.error('Error signing in with email link:', error);
        });
    }
  };

var AppName = new Vue({
    el: '#AppName',
    data: {
        test: 'Hello test',
        competitions:[],
        page:"index",
        competition:null,
        entryName: "",
        entryEmails:"",
        youTubeUrl:"",
        gitHubUrl:"",
        projectPasscode:"",
        categoryEntry:"",
        teamNumInput:"",
        entryDescription:""
    },
    methods: {
        myMethod: function () {
        },
        runRoute: function() {
            console.log("here")
            fetch("https://app-ia6miajuua-uc.a.run.app/competitions/all").then( (response)=>{
                response.json().then( (data) => {
                    console.log("important",data.data);
                    this.competitions=data.data;
                    console.log(this.competitions)
            
                });
            })
        },
        goToComp: function (comp, pageChange) {
            this.page='competition';
            this.competition =comp;
        },
        changePage: function (vari) {
            this.page=vari;
        },
        createEntry: function (){
            console.log("here")
            
            //GET BEARER TOKEN SOMEHOW

            fetch(`https://app-ia6miajuua-uc.a.run.app/users/updateInfo`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                  },
                body:JSON.stringify({
                    entryName: this.entryName,
                    entryEmails: this.entryEmails.split(',').map(email => email.trim()),
                    youTubeUrl:this.youTubeUrl,
                    gitHubUrl:this.gitHubUrl,
                    projectPasscode:this.projectPasscode,
                    categoryEntry:this.categoryEntry,
                    teamNumInput:this.teamNumInput,
                    entryDescription:this.entryDescription
                })
                  
            }).then(response => response.json())  // Parse the response as JSON
            .then(data => {
                console.log("Response from server:", data);
            })

        }

    },
    filters: {
        format: function (date) {
        // momentjs
        //return moment(date).format('L');
        }
    },
    created: function () {
        // when app loads run this code
        this.runRoute()
        handleEmailLinkSignIn();
    }
})

 
//
