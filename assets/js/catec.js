var app= new Vue({
    el: "#app",
    data:{
        ponentes:[]
    },
    methods:{
        async listponentes(){
            const response = await fetch('assets/json/ponentes.json');
            const data = await response.json();
            this.ponentes = data.ponentes;
        },
    },
    created:function(){
        this.listponentes()
        
    }
})