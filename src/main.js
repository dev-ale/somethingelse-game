import Vue from 'vue'
import App from './App.vue'

// Socket.io
import io from 'socket.io-client'
import VueSocketIOExt from 'vue-socket.io-extended'

import vuetify from './plugins/vuetify'

import VueTypedJs from 'vue-typed-js'

// To set/change the port, modify the .env files
// eslint-disable-next-line no-undef
Vue.use(VueSocketIOExt, io(process.env.VUE_APP_HOST))
Vue.use(VueTypedJs)

Vue.config.productionTip = false;

new Vue({
    vuetify,
    render: function(h) {
        return h(App);
    }
}).$mount("#app");





