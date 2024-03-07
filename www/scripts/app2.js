window.addEventListener("load" , () => {
    window.vue = new Vue({
        el: "#app",
        data: {
            isLoggenIn: true,
            cart:[],
            message:[]
        },
        computed: {
            cartTotal() {
                let total = 0;
                this.cart.forEach((item)=>{
                    total += item.price;
                })

            }
        },
        created() {
            fetch('data.json')
                .then((res) => {return res.json() })
                .then((res) => {
                    this.cart = res.cart;
                    this.isLoggenIn = false;
                })
        }


    })
})