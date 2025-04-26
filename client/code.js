import {
  getAuth,
  onAuthStateChanged,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js";

const apiUrl = "https://app-ia6miajuua-uc.a.run.app";
// const apiUrl = "http://127.0.0.1:5001/code-camp-showcase/us-central1/app";

const getIdToken = async () => {
  const user = auth.currentUser;
  if (user) {
    // Get ID token from Firebase Authentication
    const idToken = await user.getIdToken();
    return idToken;
  }
  return null;
};

const firebaseConfig = {
  apiKey: "AIzaSyCPrIrDFUcpJwVj1JjRCeXTe_4GzlQt5hI",
  authDomain: "code-camp-showcase.firebaseapp.com",
  databaseURL: "https://code-camp-showcase-default-rtdb.firebaseio.com",
  projectId: "code-camp-showcase",
  storageBucket: "code-camp-showcase.firebasestorage.app",
  messagingSenderId: "1064086262345",
  appId: "1:1064086262345:web:f9f03f1a961408321c2598",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

const handleEmailLinkSignIn = () => {
  const currentUrl = window.location.href;

  if (isSignInWithEmailLink(auth, currentUrl)) {
    let email = window.localStorage.getItem("emailForSignIn");
    console.log("Current URL:", currentUrl);
    console.log("Email retrieved from localStorage:", email);

    if (!email) {
      email = window.prompt("Please provide your email for confirmation");
    }

    signInWithEmailLink(auth, email, currentUrl)
      .then((result) => {
        console.log("Successfully signed in!", result.user);
        window.localStorage.removeItem("emailForSignIn");
        // Redirect to the main app page after successful sign-in
        //   window.location.href = "/mainAppPage.html";
      })
      .catch((error) => {
        console.error("Error signing in with email link:", error);
      });
  }
};

var AppName = new Vue({
  el: "#AppName",
  data: {
    test: "Hello test",
    competitions: [],
    isClicked: false,
    showModal: false,
    page: "index",
    competition: null,
    entryName: "",
    teamName: "",
    entryEmails: "",
    featuredImg: "",
    youTubeUrl: "",
    gitHubUrl: "",
    projectPasscode: "",
    categoryEntry: "",
    teamNumInput: "",
    entryDescription: "",
    competitionId: "",
    currentEnt: null,
    menuOpen: false,
    entries: [],
    userCompCode: "",
    errorMessage: "",
    selectedFile: null,
    uploading: false,
    error: null,
    votes: [],
  },
  methods: {
    runRoute: function () {
      console.log("here");
      fetch(`${apiUrl}/competitions/all`).then((response) => {
        response.json().then((data) => {
          console.log("important", data);
          this.competitions = data;
          console.log(this.competitions);
        });
      });
    },
    toggleMenu: function () {
      console.log(menuOpen, "AQUE");
      this.menuOpen = !this.menuOpen;
    },
    getVotes: function (compId) {
      console.log("got them", compId);
      // retreive the votes cast for competition
    },
    castVote: function (userId) {
      //call getVotes and await response
      //check votes to see if user has already voted 3 times
      //if voted less than 3 times post vote
      console.log(userId);
    },
    openImage(imageUrl) {
      this.modalImageUrl = imageUrl;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    extractYouTubeVideoId(url) {
      const match = url?.match(/v=([^&]+)/);
      return match ? match[1] : "dQw4w9WgXcQ"; // Return video ID or null if not found
    },
    goToComp: function (comp) {
      this.page = "competition";
      console.log(comp);
      this.competition = comp;
      this.getAllEntries();
    },
    goToEntry: function (ent) {
      this.page = "singleEntry";
      console.log(ent);
      this.currentEnt = ent;
    },
    vote: function () {
      // pass along currentEnt.entryId
      if (!this.isClicked) {
        this.isClicked = true;
      }
    },
    enterAComp: function () {
      console.log(this.competition);
      if (this.userCompCode == this.competition.passcode) {
        this.changePage("createEntry");
        console.log("passed the test");
      } else {
        this.errorMessage =
          "Something is wrong with your code. Please enter the correct one.";
      }
    },
    goHome: function () {
      console.log("hi");
      window.location.href = "/index.html";
      this.page = "index;";
    },

    changePage: function (vari) {
      if (vari == "enterCompetition") {
        if (!auth.currentUser) {
          window.location.href = "/login.html";
        }
      }
      this.page = vari;
    },
    createEntry: async function () {
      console.log("here");
      console.log(this.competition.id);

      const idToken = await auth.currentUser.getIdToken();
      console.log(`Bearer ${idToken}`);

      fetch(`${apiUrl}/entries/new`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          competitionId: this.competition.id,
          entryName: this.entryName,
          teamName: this.teamName,
          entryEmails: this.entryEmails.split(",").map((email) => email.trim()),
          FeatureImageUrl: this.featuredImg,
          youTubeUrl: this.youTubeUrl,
          gitHubUrl: this.gitHubUrl,
          projectPasscode: this.projectPasscode,
          categoryEntry: this.categoryEntry,
          teamNumInput: this.teamNumInput,
          entryDescription: this.entryDescription,
        }),
      })
        .then((response) => {
          window.location.href = "index.html";
          response.json();
        }) // Parse the response as JSON
        .then((data) => {
          console.log("Response from server:", data);
        });
      //window.location.href = 'index.html';
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        this.error = null;
      }
    },
    async uploadImage() {
      if (!this.selectedFile) {
        this.error = "Please select a file to upload.";
        return;
      }

      const file = this.selectedFile;
      const storageRef = ref(storage, `uploads/${file.name}`);

      this.uploading = true;
      this.error = null;
      this.successMessage = "";

      try {
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Optional: Log upload progress
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            // Handle upload error
            console.error("Upload failed:", error);
            this.error = "Upload failed. Please try again.";
          },
          async () => {
            // Get the download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File available at:", downloadURL);

            // Set the uploaded file URL
            this.featuredImg = downloadURL;
            this.successMessage = "File uploaded successfully!";
            this.error = null;
          }
        );
      } catch (error) {
        console.error("Error uploading file:", error);
        this.error = "An error occurred during file upload.";
        this.successMessage = "";
      } finally {
        this.uploading = false;
      }
    },
    getAllEntries: async function () {
      fetch(`${apiUrl}/competitions/byId/` + this.competition.id).then(
        (response) => {
          response.json().then((data) => {
            console.log("important", data);
            this.entries = data.data.entries;
            console.log(this.entries);
          });
        }
      );
    },
  },
  filters: {
    format: function (date) {
      // momentjs
      //return moment(date).format('L');
    },
  },
  created: function () {
    // when app loads run this code
    this.runRoute();
    handleEmailLinkSignIn();
  },
});

//
