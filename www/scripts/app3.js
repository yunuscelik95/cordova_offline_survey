let globalData = new Vue({
    data: {
        $questions: [],
         $question:"" 
    }
});

var jsques = [];

Vue.mixin({
    computed: {
        $questions: {
            get: function () { return globalData.$data.$questions },
            set: function (newColor) { globalData.$data.$questions = newColor; }
        },
        $question: {
            get: function () { return globalData.$data.$question },
            set: function (newColor) { globalData.$data.$question = newColor; }
        }
    }
})

/*Vue.prototype.$searchQ = function (name) {

    let elem = this.$questions.filter(x => x.num == name)[0];
    return elem;
}*/


Vue.component('SingleQuestion', {
    props: {
        question: { required: true }
    },
    methods: {
        backCurrentQuestion() {

            this.$emit('questionbackchange');
        },

    },

    computed: {

    }, mounted() {

    }
    ,
    template: `<div>
    <h1> {{question.text }}</h1>
    <div v-for="choise in question.chooises">
        <div>

            <input type="radio" :name="question.num" :id="question.num  + '_' + choise.value" :value="choise.value" v-model="question.answer" />
            <label :for="question.num  + '_' + choise.value">   {{ choise.text }}</label>
            <input type="text" v-if="choise.open" :name="question.num + '_O'" :id="question.num  + '_' + choise.value + '_O'" v-model="choise.openAnswer" />

        </div>
    </div>

</div>`
})


Vue.component('TextQuestion', {
    props: {
        question: { required: true }
    },

    template: `
            <div>
                <h1> {{question.text }}</h1>
                <div v-for="choise in question.chooises">
                    <div><textarea type="text" :name="question.num" v-model="question.answer" :placeholder="choise.text" > </textarea></div>
                </div>
            </div>
`
})


let backCount = 1;
window.addEventListener('load', () => {

    window.vue = new Vue({
        el: "#Project",
        data: {
            projectname: "",
            questions: [],
            question: [],
            currentquestion: 0

        },
        methods: {
            selectQ(name) {
                alert(name)
                return this.$questions.filter(t => t.num == name);
             },
            singleclick(choise) {
                if (this.question.type == "Multi") {
                    if (choise.single) {
                        let value = choise.value;
                        if (this.question.answer.includes(value)) {
                            this.question.answer = [value];
                        }
                    }
                }
            },
       

            matrissingleclick(choise, listID) {
                    if (this.question.type == "MultiMatris") {
                        if (choise.single) {
                            let value = choise.value;
                            let list = this.question.list.filter(x => x.id == listID)[0];
                            if (list.answer.includes(value)) {
                                list.answer = [value];
                            }
                        }
                        else
                        {
                        }
                    }
            },
            nextCurrentQuestion() {
             
                if (this.$questions.length > 0 && this.$questions.length > this.currentquestion)
                {
                    let control = false;
                    if (this.question.type == "Single" && this.question.answer != "") {
                        control = true;
                    }
                    else if (this.question.type == "Text" && this.question.answer != "")
                    {
                        control = true;
                    }
                    else if (this.question.type == "Multi" && this.question.answer.length>0) {
                        control = true;
                    }
                    else if (this.question.type == "SingleMatris" || this.question.type == "MultiMatris") {
                        control = true;
                        control = true;
                        for (var i = 0; i < this.question.list.length; i++) {
                            if (this.question.list[i].answer.length < 1)
                            {
                                control = false;
                                break;
                            }
                        }
                       
                    }
                
                //    console.log(eval('arrInn(this.$questions.searchQ("Q3").answer,"1")'));
                    if (control) {
                        if (this.currentquestion >= this.$questions.length - 1)
                        {
                            window.location.href = "response.html";
                        }
                        else {
                          
                            this.currentquestion++;
                            this.question = this.$questions[this.currentquestion];
                            this.filterRotation();
                            if (this.question.type == "SingleMatris" || this.question.type == "MultiMatris") {
                                this.filterListRotation();
                            }
                        }
                    //    console.log(eval('inn(this.$questions.searchQ("Q3").answer,"1")'));
                    //    if (eval("inn(this.$questions.searchQ('Q3').answer,1)"))
                         
                      
                        
                    }
                    else
                    {
                        alert("Lütfen Soruyu Cevaplayın");
                        return;
                    }
                 //   this.question = $questions[this.currentquestion];
                }
         
            },

            backCurrentQuestion() {
                if (this.$questions.length > 0 && this.currentquestion > 0) {
                    if (this.currentquestion >= backCount)
                    {
                        this.currentquestion -= backCount;
                      //  this.filterRotation();
                    }
                    this.question = this.$questions[this.currentquestion];
                }
            },
            filterListRotation() {

                let filter = this.question.listfilter;
                let chooises = [];
                if (filter != "") {
                    //    var q = this.$question;
                    this.question.list.forEach(function (chooise) {
                        let dummy = filter.replace("valueitem", chooise.id);
                        if (eval(dummy)) {
                            chooises.push(chooise);
                        }
                    })
                    this.question.list = chooises;
                }

                else {

                    // return this.question.chooises;
                }
                if (this.question.rotation) {
                    this.question.list = this.shuffle(false);
                }
            },

            filterRotation() {

                let filter = this.question.filter;
                let chooises = [];
                if (filter != "") {
                //    var q = this.$question;
                    this.question.chooises.forEach(function (chooise) {
                        let dummy = filter.replace("valueitem", chooise.value);
                        if (eval(dummy)) {
                            chooises.push(chooise);
                        }
                    })
                    this.question.chooises = chooises;
                }
                
                else {
                 
                   // return this.question.chooises;
                }
                if (this.question.rotation) {
                    this.question.chooises = this.shuffle(true);
                }
            },
            shuffle(isChooise) {
                let array;
                if (isChooise)
                {
                    array = this.question.chooises;
                }
                else
                {
                    array = this.question.list;
                }
                 
                var currentIndex = array.length;
                var temporaryValue, randomIndex;
                while (0 !== currentIndex && currentIndex != undefined) {

                    // Pick a remaining element...
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;

                    // And swap it with the current element.
                    temporaryValue = array[currentIndex];
                    array[currentIndex] = array[randomIndex];
                    array[randomIndex] = temporaryValue;
                }

                return array;
            }

           
        },
        computed: {
            filteredquestion() {
                if (this.question == null || this.question == "") {
                    
                    this.question = this.$questions[this.currentquestion];
                }
                 
                 //   this.question = this.$question;
            },
          /*  filter() {
                let filter = this.question.filter;
                let chooise = [];
                if (filter != "") {
                    this.question.chooises.forEach(function (chooise) {
                        let dummy = filter.replace("valueitem", chooise.value);
                        if (eval(dummy)) {
                            chooise.push(chooise);
                        }
                    })
                    return chooise;
                }
                else {
                    return this.question.chooises;
                }
            },*/
            singlekontrol()
            {
                  if (this.question.chooises.filter(x => x.single == true).length > 0) {
                        let value = this.question.chooises.filter(x => x.single == true)[0].value;
                        //console.log("value:" + value);
                        if (this.question.answer.includes(value)) {
                         //   console.log("return:true" );
                            return true;
                        }
                    }
                    else {
                     //   console.log("return:false");
                        return false;
                    }
              
              //  }
                return false;
            },

            matrissinglekontrol() {
                if (this.question.chooises.filter(x => x.single == true).length > 0) {
                    return true;
                    /*  let question = this.question;
                    this.question.list.forEach(function (list2) {

                        let value = question.chooises.filter(x => x.single == true)[0].value;
                        //console.log("value:" + value);
                        if (list2.answer.includes(value)) {
                            //   console.log("return:true" );
                            return true;
                        }


                    });*/
                }
                else {
                    //   console.log("return:false");
                    return false;
                }

                //  }
                return false;
            }
        
        },
        created() {
            fetch('project.json')
                .then((res) => { return res.json() })
                .then((res) => {
                    this.projectname = res.project.projectname;
                    this.$questions = res.project.questions;
                    this.questions = res.project.questions;
                    jsques = res.project.questions;
                    if (this.questions.length > 0) {
                        this.question = this.questions[0];
                        this.filterRotation();
                    }
                })
    
/*            console.log("test1");
            this.setCurrentQuestion();
            this.$nextTick(() => {
                console.log($questions.length);
                if ($questions.length > 0) {
                    this.question = $questions[this.currentquestion];
                }
            })*/
        },
        mounted: function () {
        
      /*      this.$questions.prototype.select =
                function (name) {
                    return this.$questions.filter(t => t.num == name);
                };
            */
        }
    })
})