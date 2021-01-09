import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueTypedJs from 'vue-typed-js'

// Socket.io
import io from 'socket.io-client'
import VueSocketIOExt from 'vue-socket.io-extended'


// To set/change the port, modify the .env files
Vue.use(VueSocketIOExt, io(process.env.VUE_APP_HOST))
Vue.use(VueTypedJs)

new Vue({
    vuetify,
    render: (h) => h(App)
}).$mount('#app')
