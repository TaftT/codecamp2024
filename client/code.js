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
    }
})

 
//
