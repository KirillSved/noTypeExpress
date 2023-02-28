
const App = { 
// data : () {} // for common js
data() {  // ecma script syntax // create method 

    return {
        counter : 0,
        titleforfun:"Порядок приколов",
        title:"Коды оных приколов",
        placeholderForFun:"Создать заметку...",
        inputValue:"",
        active:"",
        notes:["тестовая","заметка"],



    }
},

methods:{
    addNote(){
        if(this.inputValue!==""){
        this.notes.push(this.inputValue);
        this.inputValue = ``;
        }
    },
   
    // возмжно заменить функционал , изятия значения из объекта события, которое извлекает его из дом атрибута с помощью v-model
    // inputChangeHandler(event){
    //     this.inputValue = event.target.value; //  Для изменения значения надо методами манипулировать полями объекта data() которые находяться в контексте
    // },
    // inputKeyPress(event){
    //     if(event.key == "Enter"){     // Возможно реализовать в форме интреполяции 
    //         this.addNote();
    //     }
    // },
    buttonDeletePrikol(note,idx,event){
         arr = this.notes.filter(item => item !== note)
        this.notes = arr;
        // this.notes.splice(1,idx); // minnin meth
    },
    
},

computed:{

doubleCount(){                            //вычислямые типы по факту гетер-сетеры вызываемые изменением состояния прослушиваемой переменой из кореннного объекста дата
    console.log("DoUble Count ");
    return this.notes.length * 2;
},

},

watch:{
inputValue(value){
    if(value.length>30){
        this.inputValue = "Wrong";
    }
   // console.log( "input value change ", value);   // Пролушиватель измений состояния перменной, реагирует на изменения
}

},

};
// const app = Vue.createApp(App) // obj into 
// app.mount('#app'); //css селектор корневого узла как аргумент 

const nav = { 
    // data : () {} // for common js
    data() {  // ecma script syntax // create method 
    
        return {
            counter : 0,
          
    
    
        }
    }
}
    
 Vue.createApp(App).mount('#app'); //css селектор корневого узла как аргумент 

 Vue.createApp(nav).mount('#nav'); //css селектор корневого узла как аргумент 
