var AppName = new Vue({
    el: '#AppName',
    data: {
        test: 'Hello test',
    },
    methods: {
        myMethod: function () {
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
    }
})
