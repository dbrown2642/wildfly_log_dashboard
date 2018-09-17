/**
 * @file sets up Vue app
 * @author: dbrown
 */

import Vue from 'vue'
import VueSocketio from 'vue-socket.io';
import App from './App.vue'
import ServerStore from './stores/ServerStore.js';

// UI setup
import BootstrapVue from 'bootstrap-vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faClock, faTimes, faAlignLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueChatScroll from 'vue-chat-scroll'
Vue.use(VueChatScroll)
library.add(faClock, faAlignLeft, faTimes)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false
Vue.use(BootstrapVue);

// Create Websocket
const server = ServerStore.data.serverLocation;
Vue.use(VueSocketio, server);

// Mount Vue
new Vue({
  render: h => h(App)
}).$mount('#app')
