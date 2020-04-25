import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import ObjectId from '@/components/ObjectId'
import languages from '@/components/Languages'

Vue.use(Vuex)

let games = JSON.parse(localStorage.getItem('games')) || []
export default new Vuex.Store({
  state: {
    player: null,
    players: null,
    games: games,
    status: null,
    auth: JSON.parse(localStorage.getItem('auth')) || {},
    endpoint: process.env.ENDPOINT
  },
  mutations: {
    /* A fit-them-all commit */
    basic (state, payload) {
      state[payload.key] = payload.value
    },

    /* Auth */
    auth (state, payload) {
      if (payload) {
        state.auth = payload
      }
    },
    /* Auth */
    auth_request (state) {
      state.status = 'loading'
    },
    auth_success(state, auth) {
      state.status = 'success'
      state.auth = auth
    },
    auth_error(state) {
      state.status = 'error'
    },
    logout(state) {
      state.status = ''
      state.auth = {}
    },
    preferences_success (state, data) {
      state.player = data
      localStorage.setItem('player', JSON.stringify(data))
    },
    preferences_error (state) {
      state.status = 'error'
      localStorage.removeItem('player')
    },
    player_success (state, data) {
      state.player = data
      localStorage.setItem('player', JSON.stringify(data))
    },
    player_error (state) {
      state.status = 'error'
      localStorage.removeItem('player')
    },
    games_success (state, data) {
      state.games.push(data)
      localStorage.setItem('games', JSON.stringify(state.games))
    },
    games_error (state) {
      state.status = 'error'
      localStorage.removeItem('games')
    },
    app_success (state, data) {
      state.app = data
      localStorage.setItem('app', JSON.stringify(data))
    },
    app_error (state) {
      state.status = 'error'
      localStorage.removeItem('app')
    },
    players_success (state, data) {
      state.players = data
      localStorage.setItem('players', JSON.stringify(data))
    },
    players_error (state) {
      state.status = 'error'
      localStorage.removeItem('players')
    }
  },
  getters: {
    nombre (state) {
      return state.userName
    }
  },
  actions: {
    players ({ commit }, data) {
      if (data) {
        commit('players_success', data)
      } else {
        commit('players_error')
      }
    },
    games ({ commit }, data) {
      if (data) {
        commit('games_success', data)
      } else {
        commit('games_error') 
      }
    },
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios.post( this.state.endpoint + '/account/login', user ).then((res) => {
          const auth = res.data
          localStorage.setItem('auth', JSON.stringify(auth))
          axios.defaults.headers.common['Authorization'] = auth.token
          commit('auth_success', auth)
          resolve(res)
        })
        .catch(err => {
          commit('auth_error')
          localStorage.removeItem('auth')
          reject(err)
        })
      })
    },
    register({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios.post( this.state.endpoint + '/account/create', user ).then((res) => {
          const auth = res.data
          localStorage.setItem('auth', JSON.stringify(auth))
          axios.defaults.headers.common['Authorization'] = auth.token
          commit('auth_success', auth)
          resolve(res)
        })
        .catch(err => {
          commit('auth_error', err)
          localStorage.removeItem('auth')
          reject(err)
        })
      })
    },
    validate({ commit }, code) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios.post( this.state.endpoint + '/account/validate/' + code, {}).then((res) => {
          const auth = res.data
          localStorage.setItem('auth', JSON.stringify(auth))
          axios.defaults.headers.common['Authorization'] = auth.token
          commit('auth_success', auth)
          resolve(res)
        })
        .catch(err => {
          commit('auth_error', err)
          localStorage.removeItem('auth')
          reject(err)
        })
      })
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        const user = this.state.auth.user
        commit('logout')
        delete axios.defaults.headers.common['Authorization']
        resolve(user)
      })
    },
    player ({ commit }, data) {
      return new Promise((resolve, reject) => {
        const stored = data || JSON.parse(localStorage.getItem('player')) || {}
        if(Object.keys(stored).length && stored._id){
          if(stored.darkmode){
            document.documentElement.classList.add('dark-mode')
          }

          commit('player_success', stored)
          resolve(stored)
        } else {
          let detected = navigator.languages
            ? navigator.languages[0]
            : (navigator.language || navigator.userLanguage)
          detected = detected.split('-')[0].toLowerCase()

          const lang = languages[detected] ? detected : Object.keys(languages)[0]
          const code = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5)
          var preferences = {
            _id: ObjectId(),
            code: code,
            flag: '🇷🇪',
            country: '🇷🇪',
            lang: lang,
            observe: false,
            autoaccept: false,
            strongnotification: false,
            darkmode: false,
            sound: true,
            pieces: 'classic',
            board:'classic'
          }

          axios.post('https://ipapi.co/json').then(json => {
            axios.get('/json/flags.json').then(flags => {
              if (flags.data[json.data.country_code]) {
                preferences.flag = flags.data[json.data.country_code].emoji || ''
                preferences.country = flags.data[json.data.country_code].name || ''
              }
              commit('player_success', preferences)
              resolve(preferences)
            })
          })
        }
      })
    }
  }
})
