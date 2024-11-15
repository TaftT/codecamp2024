var AppName = new Vue({
    el: '#AppName',
    data: {
        test: 'Hello test',
        competitions:[],
        page:"index",
        competition:null
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
