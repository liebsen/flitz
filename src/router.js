import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import axios from 'axios'
import $ from 'jquery'
import Landing from '@/views/Landing'
import Results from '@/views/Results'
import Play from '@/views/Play'
import Live from '@/views/Live'
import Preferences from '@/views/Preferences'
import Stockfish from '@/views/Stockfish'
import Eco from '@/views/Eco'
import PlayEco from '@/views/PlayEco'
import Game from '@/views/Game'
import Group from '@/views/Group'
import Groups from '@/views/Groups'
import Watch from '@/views/Watch'
import Register from '@/views/Register'
import Login from '@/views/Login'
import RegisterSuccess from '@/views/RegisterSuccess'
import ForgotPass from '@/views/ForgotPass'
import Validate from '@/views/Validate'
import NotFound from '@/views/NotFound'

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
      path: '/stockfish',
      name: 'stockfish',
      component: Stockfish
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
  if (!Object.keys(store.state.player).length) {
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
