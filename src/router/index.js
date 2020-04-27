import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import axios from 'axios'
import $ from 'jquery'
import Landing from '../components/Landing'
import Results from '../components/Results'
import Contact from '../components/Contact'
import Donate from '../components/Donate'
import Play from '../components/Play'
import Lobby from '../components/Lobby'
import Live from '../components/Live'
import Preferences from '../components/Preferences'
import Stockfish from '../components/Stockfish'
import Eco from '../components/Eco'
import PlayEco from '../components/PlayEco'
import Game from '../components/Game'
import Group from '../components/Group'
import Groups from '../components/Groups'
import Watch from '../components/Watch'
import About from '../components/About'
import Register from '../components/Register'
import Login from '../components/Login'
import RegisterSuccess from '../components/RegisterSuccess'
import ForgotPass from '../components/ForgotPass'
import Validate from '../components/Validate'
import NotFound from '../components/NotFound'

window.jQuery = $
window.$ = $

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'landing',
      component: Landing
    },
    {
      path: '/results',
      name: 'results',
      component: Results
    },
    {
      path: '/eco',
      name: 'eco',
      component: Eco
    },
    {
      path: '/eco/:name',
      name: 'playeco',
      component: PlayEco
    },
    {
      path: '/live',
      name: 'live',
      component: Live
    },
    {
      path: '/game/:game',
      name: 'game',
      component: Game
    },
    {
      path: '/play/:game',
      name: 'play',
      component: Play
    },
    {
      path: '/watch/:game',
      name: 'watch',
      component: Watch
    },
    {
      path: '/groups',
      name: 'groups',
      component: Groups
    },
    {
      path: '/group/:group',
      name: 'group',
      component: Group
    },
    {
      path: '/preferences',
      name: 'preferences',
      component: Preferences
    },
    {
      path: '/lobby',
      name: 'lobby',
      component: Lobby
    },
    {
      path: '/stockfish',
      name: 'stockfish',
      component: Stockfish
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact
    },
    {
      path: '/donate',
      name: 'donate',
      component: Donate
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/register-success',
      name: 'register-success',
      component: RegisterSuccess
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPass
    },
    {
      path: '/validate/:code',
      name: 'validate',
      component: Validate
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '*',
      name: 'notfound',
      component: NotFound
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  await Vue.nextTick()
  if (!store.state.player) {
    store
      .dispatch('player')
      .then(res => {
        axios.get(`/json/lang/${res.lang}.json`).then(json => {
          router.app.translations = json.data
          console.log('🙌 Player identification successfully performed')
          router.app.$socket.emit('preferences', res)
          next()
        })
      }).catch(err => {
        console.log(`Algo malo sucedió ` + err)
      })
  } else {
    next()
  }
})

router.afterEach(() => {
  document.querySelector('.menu').classList.remove('fs')
  document.querySelector('.menu-burger').classList.remove('cross')
  if (store.state.menuStatus) {
    store.commit('togglemenu')
  }
})

export default router
