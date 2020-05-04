import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import defaultSettings from '@/components/defaultSettings'

Vue.use(Vuex)

let games = JSON.parse(localStorage.getItem('games')) || []
export default new Vuex.Store({
  state: {
    menuState: false,
    player: {},
    players: null,
    games: games,
    status: null,
    auth: JSON.parse(localStorage.getItem('auth')) || {},
    endpoint: (process.env.NODE_ENV === 'production' ? 'https://flitzapi.herokuapp.com' : 'http://localhost:4000') // http://192.168.2.13:4000
  },
  mutations: {
    /* A fit-them-all commit */
    basic (state, payload) {
      state[payload.key] = payload.value
    },
    togglemenu () {
      this.state.menuState = !this.state.menuState
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
    auth_success (state, auth) {
      state.status = 'success'
      state.auth = auth
    },
    auth_error (state) {
      state.status = 'error'
    },
    logout (state) {
      state.status = ''
      state.auth = {}
    },
    settings_success (state, data) {
      state.player = data
      axios.post('/account', data)
      localStorage.setItem('player', JSON.stringify(data))
    },
    settings_error (state) {
      state.status = 'error'
      localStorage.removeItem('player')
    },
    player_success (state, data) {
      state.player = data
      axios.post('/account', data)
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
    },
    menuState (state) {
      return state.menuState
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
    login ({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios.post('/account/login', user).then((res) => {
          const auth = res.data
          localStorage.setItem('auth', JSON.stringify(auth))
          axios.defaults.headers.common['Authorization'] = auth.token
          commit('auth_success', auth)
          resolve(res)
        }).catch(err => {
          commit('auth_error')
          localStorage.removeItem('auth')
          reject(err)
        })
      })
    },
    register ({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios.post('/account/create', user).then((res) => {
          const auth = res.data
          localStorage.setItem('auth', JSON.stringify(auth))
          axios.defaults.headers.common['Authorization'] = auth.token
          commit('auth_success', auth)
          resolve(res)
        }).catch(err => {
          commit('auth_error', err)
          localStorage.removeItem('auth')
          reject(err)
        })
      })
    },
    validate ({ commit }, code) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios.post('/account/validate/' + code, {}).then((res) => {
          const auth = res.data
          localStorage.setItem('auth', JSON.stringify(auth))
          axios.defaults.headers.common['Authorization'] = auth.token
          commit('auth_success', auth)
          resolve(res)
        }).catch(err => {
          commit('auth_error', err)
          localStorage.removeItem('auth')
          reject(err)
        })
      })
    },
    logout ({ commit }) {
      return new Promise((resolve, reject) => {
        const user = this.state.auth.user
        commit('logout')
        delete axios.defaults.headers.common['Authorization']
        resolve(user)
      })
    },
    player ({ commit }, data) {
      return new Promise((resolve, reject) => {
        const stored = JSON.parse(localStorage.getItem('player')) || {}
        const props = data || {}

        if (Object.keys(stored).length && stored._id) {
          if (!stored.elo) {
            stored.elo = 1500
          }

          if (Object.keys(props).length) {
            Object.keys(props).map(i => {
              stored[i] = props[i]
            })
          }

          if (stored.darkmode) {
            document.documentElement.classList.add('dark-mode')
          }

          commit('player_success', stored)
          resolve(stored)
        } else {
          var settings = defaultSettings
          axios.post('https://ipapi.co/json').then(json => {
            axios.get('/json/flags.json').then(flags => {
              if (flags.data[json.data.country_code]) {
                settings.flag = flags.data[json.data.country_code].emoji || ''
                settings.country = flags.data[json.data.country_code].name || ''
              }
              commit('player_success', settings)
              resolve(settings)
            })
          })
        }
      })
    }
  }
})
