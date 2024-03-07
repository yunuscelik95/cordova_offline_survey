Vue.component('SingleQuestion', {
    props: {
        question:{required:true}
    },
    methods: {
        backCurrentQuestion() {

            this.$emit('questionbackchange');
        },

    },

    computed:{

      /*  filter() {
            /*arrInn(this.searchQ('Q3').answer,valueitem)*/
       /*     let filter = this.question.filter;
            let mainchooise = [];
            if (filter != "") {

                this.question.chooises.forEach(function (chooise) {

                    let dummy = filter.replace("valueitem", chooise.value);
                    if (eval(dummy)) {
                        mainchooise.push(chooise);
                    }
                })
                if (this.question.rotation) {
                    mainchooise = this.shuffle(mainchooise);
                }
                return  mainchooise;
            }
            else {
                mainchooise = this.question.chooises;
                if (this.question.rotation) {
                    mainchooise = this.shuffle();
                }
                return mainchooise;
            }
        },
        shuffle() {
            let array = this.question.chooises;
             var currentIndex = array.length;
                 var temporaryValue, randomIndex;
            while (0 !== currentIndex && currentIndex!=undefined) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }*/

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
