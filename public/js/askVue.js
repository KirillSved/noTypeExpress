
const app = {

}

Vue.createApp({
    // data(){

    // }


    data:() => ({

         title:"i am title" ,    // <= return { }  es6
         foron:"Не кликнуто",
         donot:"Нет ни одного елемента",
         fhtml:"<h1> actach </h1>",
         fplaceFolder:"Ведите данные",
         subFolder:"Enter sub_data",
         subInput:"",

         person:{
             firstName:"Kirill",
             LastName:"Shved",
             lastWord:"InvestohillsVesta",
             age:21
         },
         items:[1,{ask:"Alter"},3,4,5,6],
         subItem:[],


    }),
    methods:{
        // stopPropagation(event){
        //      event.stopPropagation()     // метод который защищает от постороних методов которые могут воздейстоввать на елмет, можно во вью заменить на click.stop

        // },
        addItem(event){
            this.items.unshift(this.$refs.myInput.value);
            this.$refs.myInput.value="";
            console.log(event.key );
        },
        addSubItem(event,item){
           
        
            
           // this.$refs.subInput.value="";
            //console.log(subItem)
            console.log(item)
            console.log(event)
        },

        remove(i){
            this.items.splice(i,1)
        },

        log(item){
            console.log("Log delete item ", item,"=>", moment (new Date()).format('HH:mm:ss'))
        }
    },

    computed:{
        eventItems(){
            return this.items.filter(i => typeof(i)=="object")  // в этот метод помещаються либо гетеры либо сетеры, TODO сделать поиск 
        }
    }

}).mount("#app")