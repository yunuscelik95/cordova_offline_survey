import Vue from 'vue';
import Vuex from 'vuex';
 
Vue.use(Vuex);
 
export const store = new Vuex.Store({
    state: {
        messageA: 'test'
    },
    getters: {
        getMessageA: state => {
            return state.messageA;
        }
    },
    mutations: {
        setMessageA: (state, n) => {
            state.messageA = n;            
        }
    }
});