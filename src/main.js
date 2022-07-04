import { createApp } from 'vue'
import App from './App.vue'
import socketIOClient from 'socket.io-client';
import VueSocketIO from 'vue-3-socket.io'

import router from './router.js';
import store from './store/index.js';

import './assets/fonts/Montserrat/stylesheet.css';

import './style/variables.scss';
import './style/default.scss';

const client = socketIOClient('http://localhost:3001', {
    transports: ['websocket', 'polling', 'flashsocket']
});

const socket = new VueSocketIO({
    debug: true,
    connection: client, 
    options: { path: 'socket' }
    /* vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_"
    } */
});

createApp(App)
    .use(router)
    .use(store)
    .use(socket)
    .mount('#app')
