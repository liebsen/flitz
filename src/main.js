import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
import axios from 'axios'
import swal from 'sweetalert'
import moment from 'moment'
import snackbar from '@/components/Snackbar'
import { mapState } from 'vuex'

import '@mdi/font/css/materialdesignicons.css'
import '@/scss/main.scss'

/* Router & Store */
import router from './router'
import store from './store'

/* Service Worker */
import './registerServiceWorker'

/* Vue. Main component */
import App from './App.vue'

axios.defaults.baseURL = store.state.endpoint

Vue.use(new VueSocketIO({
  // debug: process.env.NODE_ENV === 'development',
  debug: true,
  connection: store.state.endpoint
}))

Vue.filter('fn', function (value) {
  if (!value) return ''
  value = value.toString()
  return moment(value).fromNow(false)
})

Vue.filter('humanReadableTime', function (value) {
  if (!value) return ''
  value = value.toString()
  return moment(value).format(router.app.translations.timeFormat)
})

Vue.filter('t', function (value) {
  if (!value) return ''
  return router.app.translations[value] || value.charAt(0).toUpperCase() + value.slice(1)
})

new Vue({ // eslint-disable-line no-new
  el: '#app',
  router,
  store,
  watch: {
    onLine (status) {
      if (status) {
        snackbar('success', 'Se restauró la conexión a internet.')
      } else {
        snackbar('error', 'No hay conexión a internet. Por favor revise la configuración de la red.')
      }
    }
  },
  computed: {
    ...mapState([
      'player',
      'players'
    ])
  },
  created () {
    this.documentTitle = document.title

    document.querySelector('body').addEventListener('click', function (event) {
      var target = event.target
      if (target.classList.contains('is-toggle')) {
        target.parentNode.childNodes.forEach((item) => {
          if (item.classList && item.classList.contains('is-toggle')) {
            item.classList.remove('has-background-success')
          }
        })
        target.classList.add('has-background-success')
      }
    })

    window.addEventListener('click', event => {
      let { target } = event
      while (target && target.tagName !== 'A') target = target.parentNode
      if (target && target.matches('a:not([href*="://"])') && target.href) {
        const { altKey, ctrlKey, metaKey, shiftKey, button, defaultPrevented } = event
        if (metaKey || altKey || ctrlKey || shiftKey) return
        if (defaultPrevented) return
        if (button !== undefined && button !== 0) return
        if (target && target.getAttribute) {
          const linkTarget = target.getAttribute('target')
          if (/\b_blank\b/i.test(linkTarget)) return
        }
        const url = new URL(target.href)
        const to = url.pathname
        if (window.location.pathname !== to && event.preventDefault) {
          event.preventDefault()
          this.$router.push(to)
        }
      }
    })

    window.addEventListener('online', this.updateOnlineStatus)
    window.addEventListener('offline', this.updateOnlineStatus)
    this.loading = false
  },
  beforeDestroy () {
    window.removeEventListener('online', this.updateOnlineStatus)
    window.removeEventListener('offline', this.updateOnlineStatus)
  },
  sockets: {
    opponent_not_found () {
      this.isFindingOpponent = false
      snackbar('default', this.t('opponent_not_found'))
    },
    game_spawn (data) {
      if (data.white === this.player.code || data.black === this.player.code) {
        this.isFindingOpponent = false
        let match = {
          match: data.match,
          group: data.group
        }
        localStorage.setItem('match', JSON.stringify(match))
        this.$router.push(`/play/${data.game}`)
      }
    }
  },
  methods: {
    play () {
      this.isFindingOpponent = true
      let group = 'landing'
      if (this.$route.name === 'group') {
        group = this.$route.params.group
      }
      this.$socket.emit('find_opponent', {
        player: this.player,
        group: group
      })
    },
    createGroup () {
      const template = (`
<div class='content'>
  <div class='columns columns-bottom is-flex has-text-centered'>
    <div class='column'>
      <h4>
        <span class='icon'>
          <span class='mdi mdi-retweet'></span>
        </span>
        <span>Rondas</span>
      </h4>
      <div class='control has-text-centered column'>
        <div class='buttons levels has-addons groupgames' title='Nro. partidas de este match'>
          <button class='button is-toggle is-rounded has-background-success' title='Match a 1 partida'>1</button>
          <button class='button is-toggle' title='Match a 3 partidas'>3</button>
          <button class='button is-toggle' title='Match a 5 partidas al match'>5</button>
          <button class='button is-toggle' title='Match a 10 partidas'>10</button>
          <button class='button is-toggle is-rounded' title='Match a 16 partidas'>16</button>
        </div>
      </div>
    </div>
  </div>
  <div class='columns is-flex has-text-centered'>
    <div class='column'>
      <h4>
        <span class='icon'>
          <span class='mdi mdi-clock'></span>
        </span>
        <span>Minutos</span>
      </h4>
      <div class='control has-text-centered column'>
        <div class='buttons levels has-addons gameclock' title='Establece la duración de las partidas en minutos'>
          <button class='button is-toggle is-rounded has-background-success' title='Partidas de 3 minutos'>3'</button>
          <button class='button is-toggle' title='Partidas de 5 minutos'>5'</button>
          <button class='button is-toggle' title='Partidas de 10 minutos'>10'</button>
          <button class='button is-toggle is-rounded' title='Partidas de 30 minutos'>30'</button>
        </div>
      </div>
    </div>
  </div>
  <div class='columns is-flex has-text-centered'>
    <div class='column'>
      <h4>
        <span class='icon'>
          <span class='mdi mdi-stopwatch'></span>
        </span>
        <span>Compensación en segundos</span>
      </h4>
      <div class='control has-text-centered column'>
        <div class='buttons levels has-addons gamecompensation' title='Agregar compensación por movimiento'>
          <button class='button is-toggle is-rounded' title='Partidas sin compensación por movimiento'>+0</button>
          <button class='button is-toggle' title='Partidas con 1 segundo de compensación por cada movimiento'>+1</button>
          <button class='button is-toggle has-background-success' title='Partidas con 2 segundos de compensación por cada movimiento'>+2</button>
          <button class='button is-toggle is-rounded' title='Partidas con 3 segundos de compensación por cada movimiento'>+3</button>
        </div>
      </div>
    </div>
  </div>
</div>`)
      swal({
        title: 'Crear un grupo',
        buttons: ['Cancelar', 'Crear'],
        closeOnClickOutside: false,
        content: {
          element: 'div',
          attributes: {
            innerHTML: `${template}`
          }
        }
      }).then(accept => {
        if (accept) {
          this.isCreatingGroup = true
          var gameclock = document.querySelector('.gameclock > .has-background-success')
          var groupgames = document.querySelector('.groupgames > .has-background-success')
          var gamecompensation = document.querySelector('.gamecompensation > .has-background-success')
          var minutes = parseInt(gameclock.textContent)
          var games = parseInt(groupgames.textContent)
          var compensation = parseInt(gamecompensation.textContent)

          swal({
            title: 'Creando grupo',
            text: 'Tu grupo se está creando...',
            buttons: false
          })

          const code = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5)
          setTimeout(() => {
            let group = {
              code: code,
              owner: this.player,
              minutes: minutes,
              games: games,
              compensation: compensation
            }

            axios.post('/group/create', group).then(res => {
              this.isCreatingGroup = false
              this.isLoading = false
              swal.close()
              if (res.data.status === 'success') {
                this.$router.push('/group/' + res.data.data._id)
              } else {
                snackbar('error', 'error')
              }
            })
          }, 1000)
        }
      })
    },
    getTimeDisplay: function (time) {
      var min = parseInt(time / 60, 10)
      var sec = parseInt(time % 60, 10)

      min = min < 10 ? '0' + min : min
      sec = sec < 10 ? '0' + sec : sec

      return min + ':' + sec
    },
    countMoves: (pgn) => {
      if (pgn && pgn.indexOf('.')) {
        return pgn.split('.').length
      }
    },
    checkBoardStyle (val) {
      document.querySelector('body').classList.remove('is3d')
      document.querySelector('body').classList.remove('magi3d')
      if (val.indexOf('jade3d') > -1) {
        document.querySelector('body').classList.add('jade3d')
      } else if (val.indexOf('magi3d') > -1) {
        document.querySelector('body').classList.add('magi3d')
      } else {
        if (val.indexOf('3d') > -1) {
          document.querySelector('body').classList.add('is3d')
        }
      }
    },
    t (value) {
      return this.translations[value] || value.charAt(0).toUpperCase() + value.slice(1)
    },
    fullscreenBoard: function () {
      if (document.querySelector('.board') && document.body.clientHeight < document.body.clientWidth && document.body.clientWidth > 768) {
        var offset = 0
        if (!document.querySelector('.menu-logo').classList.contains('is-hidden')) {
          offset += 75
        }
        document.querySelector('.board').style.width = document.body.clientHeight - document.querySelector('.menu').clientHeight - offset + 'px'
      }
    },
    updateOnlineStatus (e) {
      const {
        type
      } = e
      this.onLine = type === 'online'
    }
  },
  data () {
    return {
      appKey: 0,
      isFindingOpponent: false,
      isCreatingGroup: false,
      onLine: navigator.onLine,
      loading: true,
      saving: false,
      processing: false,
      translations: {},
      documentTitle: null
    }
  },
  render: h => h(App)
})
