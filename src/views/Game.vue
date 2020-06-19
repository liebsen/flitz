<template>
  <div class="game-container" :class="boardColor">
    <div class="status">
      <div class="bar is-clickable preservefilter" @click="setClock">
        <div class="bar-progress"></div>
      </div>
    </div>
    <div class="container is-widescreen">
      <div class="content fadeIn">
        <div class="columns is-marginless-top">
          <div class="column">
            <div class="board-container">
              <h6 class="black has-text-left" v-show="game">
                <span v-show="data.result==='0-1'" class="icon has-margin">
                  <span class="mdi mdi-trophy is-size-7 has-text-warning"></span>
                </span>
                <span class="is-size-6">
                  <span v-show="data.blackflag" class="icon preservefilter">
                    <span v-html="data.blackflag"></span>
                  </span>
                  <span v-html="data.black"></span>
                  <span v-show="data.blackelo && data.blackelo !== '0'" class="has-text-grey" v-html="data.blackelo"></span>
                </span>
              </h6>
              <div class="board preservefilter" :class="{ 'black' : orientation==='black' }">
                <div class="score-container">
                  <div class="score" :style="'max-height:' + vscore + '%'"></div>
                </div>
                <div id="board" class="is-clickable" @click="gamePause"></div>
              </div>
              <h6 class="white has-text-right" v-show="game">
                <span v-show="data.result==='1-0'" class="icon has-margin">
                  <span class="mdi mdi-trophy is-size-7 has-text-warning"></span>
                </span>
                <span class="is-size-6">
                  <span v-show="data.whiteflag" class="icon preservefilter">
                    <span v-html="data.whiteflag"></span>
                  </span>
                  <span v-html="data.white"></span>
                  <span v-show="data.whiteelo && data.whiteelo !== '0'" class="has-text-grey" v-html="data.whiteelo"></span>
                </span>
              </h6>
            </div>
          </div>
          <div class="column">
            <div class="board-assistant" v-if="Object.keys(data).length">
              <div class="columns has-text-centered">
                <div class="column">
                  <div class="buttons levels has-addons preservefilter" :title="'game_settings' | t">
                    <button @click="gameFlip()" class="button is-rounded is-info" title="Girar tablero">
                      <span class="icon">
                        <span class="mdi mdi-flip-vertical"></span>
                      </span>
                    </button>
                    <button @click="showPGN()" class="button is-rounded is-info" v-if="pgnIndex.length" title="Mostrar PGN">
                      <strong>PGN</strong>
                    </button>
                  </div>
                </div>
              </div>
              <div class="columns is-mobile is-vcentered has-text-centered">
                <div class="column is-paddingless is-2">
                  <router-link v-show="data.prev" :to="`/game/${data.prev}`">
                    <span class="icon">
                      <span class="mdi mdi-skip-previous is-size-3 has-text-grey"></span>
                    </span>
                  </router-link>
                </div>
                <div class="column">
                  <div class="field">
                    <span v-show="data.opening" class="has-text-black is-size-5">{{ data.opening }}</span>
                    <span v-show="!data.opening" class="has-text-black is-size-5">{{ opening }}</span>
                    <strong v-show="data.eco" class="has-text-grey is-size-5">{{ data.eco }}</strong>
                    <strong v-show="!data.eco" class="has-text-grey is-size-5">{{ ecode }}</strong>
                  </div>
                  <!--div class="field">
                    <span v-html="score" class="has-text-black"></span>
                  </div-->
                </div>
                <div class="column is-paddingless is-2">
                  <router-link v-show="data.next" :to="`/game/${data.next}`">
                    <span class="icon is-large">
                      <span class="mdi mdi-skip-next is-size-3 has-text-grey"></span>
                    </span>
                  </router-link>
                </div>
              </div>
              <div class="columns is-hidden-mobile">
                <div class="chart-container preservefilter">
                  <div :class="orientation">
                    <div class="chart-indicator"></div>
                    <div class="chart" v-show="pgnIndex.length"></div>
                  </div>
                </div>
              </div>
              <div class="columns is-hidden-mobile">
                <div v-show="pgnIndex.length" class="movesTableContainer preservefilter">
                  <div class="movesTable">
                    <div class="moveRow" v-for="(move, index) in pgnIndex" :key="index">
                      <div class="moveNumCell" :class="{ 'moveRowOdd': move.odd, 'moveRowEven': !move.odd }">
                        <span v-html="(index+1)"></span>
                      </div>
                      <div class="moveCell moveSAN movew" :class="{ 'moveRowOdd': move.odd, 'moveRowEven': !move.odd }">
                        <a v-if="move.white" :class="'moveindex m' + (move.i - 2)" @click="gamePos(move.i - 2)">
                          <span v-html="move.white"></span>
                          <span v-if="data.annotations">
                            <span v-if="data.annotations[index * 2]" class="icon">
                              <span class="mdi" :class="{ 'mdi-sticker-plus' : data.annotations[index * 2] === '$1', 'mdi-sticker-check' : data.annotations[index * 2] === '$3', 'mdi-sticker-minus' : data.annotations[index * 2] === '$2', 'mdi-sticker-remove' : data.annotations[index * 2] === '$4', 'mdi-book-open': data.annotations[index * 2] === '$12', 'mdi-sticker-alert': data.annotations[index * 2] === '$14', 'mdi-sticker-emoji': data.annotations[index * 2] === '$15' }"></span>
                            </span>
                          </span>
                          <span v-if="data.score">
                            <small v-if="data.score[index * 2]"> {{ data.score[index * 2] }}</small>
                          </span>
                        </a>
                      </div>
                      <div class="moveCell moveSAN moveb" :class="{ 'moveRowOdd': move.odd, 'moveRowEven': !move.odd }">
                        <a v-if="move.black" :class="'moveindex m' + (move.i - 1)" @click="gamePos(move.i - 1)">
                          <span v-html="move.black"></span>
                          <span v-if="data.annotations">
                            <span v-if="data.annotations[index * 2 + 1]" class="icon">
                              <span class="mdi" :class="{ 'mdi-sticker-plus' : data.annotations[index * 2 + 1] === '$1', 'mdi-sticker-check' : data.annotations[index * 2 + 1] === '$3', 'mdi-sticker-minus' : data.annotations[index * 2 + 1] === '$2', 'mdi-sticker-remove' : data.annotations[index * 2 + 1] === '$4', 'mdi-book-open': data.annotations[index * 2 + 1] === '$12', 'mdi-sticker-alert': data.annotations[index * 2 + 1] === '$14', 'mdi-sticker-emoji': data.annotations[index * 2 + 1] === '$15' }"></span>
                            </span>
                          </span>
                          <span v-if="data.score">
                            <small v-if="data.score[index * 2 + 1]"> {{ data.score[index * 2 + 1] }}</small>
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--div class="columns is-hidden-mobile">
                <div class="column" v-show="data.date && data.date !='?'">
                  <span class=""  v-html="data.date"></span>
                </div>
                <div class="column" v-show="data.event && data.event !='?'">
                  <span class="" v-html="data.event"></span>
                </div>
                <div class="column" v-show="data.round && data.round !='?'">
                  <span class="" v-html="data.round"></span>
                </div>
                <div class="column" v-show="data.site && data.site !='?'">
                  <span class=""  v-html="data.site"></span>
                </div>
              </div-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios'
import { mapState } from 'vuex'
import Chess from 'chess.js'
import Chessboard from '.././assets/js/chessboard'
import swal from 'sweetalert'
import PlaySound from '../components/PlaySound'

export default {
  name: 'game',
  created () {
    document.onkeydown = this.onKeyDown
  },
  destroyed () {
    this.gameEnd()
    document.removeEventListener('onkeydown', this.onKeyDown)
  },
  mounted () {
    window.app = this

    document.getElementById('board').addEventListener('wheel', event => {
      this.gamePos(Math.sign(event.deltaY) < 0 ? this.index + 1 : this.index - 1)
    })

    if (localStorage.getItem('speed')) {
      this.speed = parseInt(localStorage.getItem('speed'))
    }

    this.gameStart()
  },
  computed: {
    ...mapState([
      'player',
      'stockfishEvalTime'
    ])
  },
  methods: {
    onKeyDown (e) {
      switch (e.which) {
        case 37: // left
          this.gamePos(this.index - 1)
          break

        case 38: // up
          break

        case 39: // right
          this.gamePos(this.index + 1)
          break

        case 40: // down
          break

        default: return
      }
      e.preventDefault()
    },
    gameMove () {
      if (!this.paused) {
        /* global $ */
        var move = this.gameMoves[this.index]
        this.selectedIndex = parseInt(location.hash.replace('#', ''))
        // exit if the game is over
        if (!move || this.game.game_over() === true ||
            this.game.in_draw() === true ||
            this.gameMoves.length === 0) return

        var perc = (this.index + 1) / this.gameMoves.length * 100
        $('.bar-progress').animate({ width: perc + '%' }, this.speed, 'linear')

        const moved = this.game.move(move)

        this.board.position(this.game.fen())
        this.uciCmd('position startpos moves' + this.moveList(), this.evaler)
        this.uciCmd('eval', this.evaler)

        var speed = this.player.moveSpeed || 250
        if (moved) {
          setTimeout(() => {
            this.moveSound(moved)
            this.addHightlight(moved)
          }, speed)
        }

        if (this.index === this.gameMoves.length) {
          this.gamePause()
        }

        this.setMovesTable()
        this.drawChartPosition()
        this.index++
        if (!this.data.opening) {
          this.findEco(this.game.pgn())
        }
        setTimeout(this.gameMove, this.speed)
      }
    },
    setMovesTable () {
      document.querySelectorAll('.moveindex').forEach((item) => {
        item.parentNode.classList.remove('active')
      })

      document.querySelector('.moveindex.m' + this.index).parentNode.classList.add('active')

      var n = document.querySelector('.moveindex.m' + this.index).parentNode.offsetTop
      var x = document.querySelector('.moveindex.m' + this.index).parentNode.clientHeight
      var y = n + x
      var h = parseInt(document.querySelector('.movesTableContainer').style.height)
      if (y > h) {
        document.querySelector('.movesTableContainer').scrollTop = n
      }
    },
    findEco (pgn) {
      let t = this
      axios.post('/eco/pgn', { pgn: pgn }).then((res) => {
        if (res.data.eco) {
          t.opening = t.$root.t(res.data.eco)
          t.ecode = res.data.eco
        }
      })
    },
    moveList () {
      var moves = ''
      var history = this.game.history({ verbose: true })

      for (var i = 0; i < history.length; ++i) {
        var move = history[i]
        moves += ' ' + move.from + move.to + (move.promotion ? move.promotion : '')
      }

      return moves
    },
    gamePGN (pgn) {
      var data = []
      pgn.split('.').forEach(function (turn) {
        turn.split(' ').forEach(function (move) {
          if (move.length) {
            if (isNaN(move) && move.length > 1) {
              data.push(move)
            }
          }
        })
      })
      return data
    },
    showPGN () {
      var pgn = this.data.pgn + ' ' + (this.data.result ? this.data.result : '')
      const template = (`
<div class="content">
  <div class="columns columns-bottom is-flex has-text-centered">
    <div class="column">
      <div class="control">
        <div class="field">
          <textarea class="textarea" readonly>${pgn}</textarea>
        </div>
      </div>
    </div>
  </div>
</div>`)
      swal({
        title: 'Copiar PGN',
        content: {
          element: 'div',
          attributes: {
            innerHTML: `${template}`
          }
        }
      })
    },
    gamePGNIndex (pgn) {
      var data = []
      pgn.split('.').forEach(function (turn, i) {
        const white = turn.split(' ')[1] || ''
        const black = turn.split(' ')[2] || ''
        if (isNaN(white)) {
          data.push({
            white: white,
            black: black,
            i: Math.ceil(i * 2),
            odd: i % 2 === 0
          })
        }
      })
      return data
    },
    uciCmd (cmd, which) {
      // console.log("UCI: " + cmd);
      (which || this.evaler).postMessage(cmd)
    },
    gameEnd () {
      this.paused = 1
      this.board.clear()
    },
    gameStart () {
      /* global STOCKFISH */
      const pref = JSON.parse(localStorage.getItem('player')) || {}
      this.boardEl = document.getElementById('board')
      axios.post('/game', { id: this.$route.params.game }).then((res) => {
        var game = res.data
        const totalms = this.$root.countMoves(game.pgn) * this.speed
        this.data = game

        if (game.score) {
          this.hasScore = true
        }

        if (game.pgn) {
          this.gameMoves = this.gamePGN(game.pgn)
          this.pgnIndex = this.gamePGNIndex(game.pgn)
        }

        this.duration = totalms / 1000
        this.game = new Chess()

        setTimeout(() => {
          if (pref.pieces) {
            this.boardCfg.pieceTheme = '/img/chesspieces/' + pref.pieces + '/{piece}.png'
            this.boardCfg.moveSpeed = this.player.moveSpeed
            this.boardColor = pref.board
            this.$root.checkBoardStyle(pref.pieces)
          }

          this.$root.fullscreenBoard()
          this.board = Chessboard('board', this.boardCfg)
          this.orientation = this.board.orientation()

          window.onresize = function (event) {
            var t = window.app
            if (t.board) {
              t.board.resize()
              t.$root.fullscreenBoard()
              t.highlightLastMove()
            }
          }

          $('.bar-progress').css({ width: '0%' })

          const offset = 150
          setTimeout(() => {
            if (document.querySelector('.movesTableContainer')) {
              document.querySelector('.movesTableContainer').style.height = ($('.board').height() - offset) + 'px'
            }

            if (this.data.chart) {
              this.drawChartFromScore()
            }

            setTimeout(() => {
              PlaySound('start.ogg')
              this.$root.loading = false
              setTimeout(() => {
                this.gameMove()
              }, 1000)
            }, 1000)
          }, 500)
        }, 3000)

        this.evaler = typeof STOCKFISH === 'function' ? STOCKFISH() : new Worker('/js/stockfish.js')

        this.evaler.onmessage = function (event) {
          var t = window.app
          var line

          if (event && typeof event === 'object') {
            line = event.data
          } else {
            line = event
          }

          // console.log("evaler: " + line);
          var reTotalEvaluation = line.match(/^Total evaluation: (-?\d+\.\d+)/)
          if (reTotalEvaluation) {
            t.score = parseFloat(reTotalEvaluation[1])
            t.vscore = 50 - (t.score / 48 * 100)
            if (!t.data.score) {
              t.data.score = []
            }
            if (!t.hasScore) {
              t.data.score[t.index - 1] = t.score
            }
            if (!t.data.chart) {
              setTimeout(() => {
                t.drawChart()
              }, t.stockfishEvalTime)
            }
          }

          /// Ignore some output.
          if (line === 'uciok' || line === 'readyok' || line.substr(0, 11) === 'option name') {

          }
        }
      })
    },
    calcPoints () {
      this.chart.points = []
      if (this.chart.values.length > 1) {
        var points = '0,' + this.chart.height + ' '
        for (var x = 0; x < this.chart.values.length; x++) {
          var perc = this.chart.values[x] / this.chart.maxValue
          var steps = 100 / (this.chart.values.length - 1)
          var point = (steps * (x)).toFixed(2) + ',' + (this.chart.height - (this.chart.height * perc)).toFixed(2) + ' '
          points += point
        }
        points += '100,' + this.chart.height
        this.chart.points = points
      }
    },
    drawChart () {
      var score = this.vscore
      if (this.orientation === 'white') {
        score = 100 - score
      }

      if (score < 0) {
        score = 0
      }

      if (score > 100) {
        score = 100
      }

      if (!isNaN(score)) {
        this.drawChartPosition()
        this.chart.values = this.chart.values.slice(0, this.index)
        this.chart.values.push(score)
        this.updateChart()
      }
    },
    drawChartPosition () {
      if (this.data.chart) {
        document.querySelector('.chart-indicator').style.left = ((this.index + 1) / this.gameMoves.length * 100) + '%'
        document.querySelector('.chart-indicator').style.backgroundColor = 'rgb(0,0,0,0.15)'
      }
    },
    drawChartFromScore () {
      this.data.chart.map((score, i) => {
        score = parseInt(score)
        if (this.orientation === 'black') {
          score = 100 - score
        }

        if (score < 0) {
          score = 0
        }

        if (score > 100) {
          score = 100
        }
        if (!isNaN(score)) {
          // this.drawChartPosition(false)
          this.chart.values.push(score)
        }
      })
      this.updateChart()
    },
    updateChart () {
      this.calcPoints()
      var element = document.getElementsByClassName('chart')[0]
      element.innerHTML = ''

      var width = document.querySelector('.movesTableContainer').clientWidth + 'px'
      var chart = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      chart.setAttribute('width', '100%')
      chart.setAttribute('height', '100%')
      chart.setAttribute('preserveAspectRatio', 'none')
      chart.setAttribute('viewBox', '0 0 ' + this.chart.width + ' ' + this.chart.height)

      var polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
      polygon.setAttribute('points', this.chart.points)

      if (this.chart.values.length > 1) {
        element.style.width = width
        element.appendChild(chart)
        chart.appendChild(polygon)
      }
    },
    moveSound (move) {
      var sound = 'move.mp3'

      if (this.game.game_over()) {
        sound = 'game-end.mp3'
      } else {
        if (move.flags === 'c') {
          sound = 'capture.mp3'
        }

        if (move.flags === 'k') {
          sound = 'castle.mp3'
        }

        if (move.flags === 'q') {
          sound = 'castle.mp3'
        }

        if (this.game.in_check() === true) {
          sound = 'check.ogg'
        }
      }

      PlaySound(sound)
    },
    removeHighlight () {
      this.boardEl.querySelectorAll('.square-55d63').forEach((item) => {
        item.classList.remove('highlight-move')
        item.classList.remove('in-check')
      })
    },
    addHightlight (move) {
      var t = this
      t.removeHighlight()
      if (move) {
        if (t.game.in_check() === true) {
          setTimeout(() => {
            t.boardEl.querySelector('img[data-piece="' + t.game.turn() + 'K"]').parentNode.classList.add('in-check')
          }, 200)
        }
        t.boardEl.querySelector('.square-' + move.from).classList.add('highlight-move')
        t.boardEl.querySelector('.square-' + move.to).classList.add('highlight-move')
      }
    },
    highlightLastMove () {
      var history = this.game.history({ verbose: true })
      if (history.length) {
        var move = history[history.length - 1]
        this.addHightlight(move)
      }
    },
    gameFlip () {
      this.board.flip()
      this.orientation = this.board.orientation()
      const white = document.querySelector('.board-container .white').innerHTML
      const black = document.querySelector('.board-container .black').innerHTML
      document.querySelector('.board-container .white').innerHTML = black
      document.querySelector('.board-container .black').innerHTML = white
      this.highlightLastMove()
    },
    gameSeek () {
      window.setTimeout(() => {
        this.selectedIndex = parseInt(location.hash.replace('#', ''))
        if (!isNaN(this.selectedIndex)) {
          this.gamePos(this.selectedIndex)
        }
        this.gameMove()
        if (!isNaN(this.selectedIndex) && !this.paused) {
          this.gamePause()
        }
      }, 10)
    },
    gamePos (pos) {
      if (pos > this.gameMoves.length || pos < 0) {
        return
      }

      this.index = pos

      const moves = this.gameMoves.slice(0, this.index)
      var move = this.gameMoves[this.index]
      // ---------------
      var pgn = []
      moves.forEach((move, i) => {
        if (i % 2) {
          pgn.push(move)
        } else {
          pgn.push([Math.ceil(i / 2) + 1, move].join('. '))
        }
      })

      document.querySelectorAll('.moveindex').forEach((item) => {
        item.parentNode.classList.remove('active')
      })

      if (document.querySelector('.moveindex.m' + this.index)) {
        document.querySelector('.moveindex.m' + this.index).parentNode.classList.add('active')
      }

      var perc = (this.index + 1) / this.gameMoves.length * 100
      $('.bar-progress').animate({ width: perc + '%' }, 100, 'linear')
      const pgns = pgn.join(' ')
      this.game.reset()
      this.game.load_pgn(pgns)
      const moved = this.game.move(move)

      this.uciCmd('position startpos moves' + this.moveList(), this.evaler)
      this.uciCmd('eval', this.evaler)

      if (moved) {
        this.board.position(this.game.fen())
        this.setMovesTable()
        this.drawChartPosition()
        var speed = this.player.moveSpeed || 250
        setTimeout(() => {
          this.moveSound(moved)
          this.addHightlight(moved)
        }, speed)
      }

      if (!this.paused) {
        this.gamePause()
      }
    },
    gamePause () {
      this.paused = !this.paused
      document.querySelector('.bar-progress').classList.remove('paused')
      if (this.paused) {
        document.querySelector('.bar-progress').classList.add('paused')
      } else {
        setTimeout(this.gameMove, 500)
      }
    },
    gameSpeed (s) {
      this.speed += s
      if (this.speed >= 1000 && this.speed <= 10000) {
        localStorage.setItem('speed', this.speed)
      } else {
        this.speed -= s
      }
    },
    displayStatus () {
      var t = this
      var status = ''
      /* var status = 'Motor: '
      if (!t.engineStatus.engineLoaded) {
        status += 'Cargando...'
      } else if (!t.engineStatus.engineReady) {
        status += 'Cargado'
      } else {
        status += 'Listo'
      } */

      if (t.engineStatus.search) {
        status += '<br>' + t.engineStatus.search
        if (t.engineStatus.score && t.displayScore) {
          status += (t.engineStatus.score.substr(0, 4) === 'Mate' ? ' ' : ' Score: ') + t.engineStatus.score
        }
      }
      t.status = status
    },
    setClock () {
      this.gamePause()
      swal('Ingresa el intervalo en milisegundos entre 1000/60000', {
        content: {
          element: 'input',
          attributes: {
            className: 'input is-rounded',
            placeholder: 'Valor en milisegundos',
            value: this.speed
          }
        },
        closeOnClickOutside: false
      })
        .then((speed) => {
          if (speed) {
            speed = parseInt(speed)
            if (speed > 5000 || speed < 500) {
              swal('El valor debe ser entre 500 / 5000')
            } else {
              this.speed = speed
              localStorage.setItem('speed', speed)
              const totalms = this.$root.countMoves(this.data.pgn) * this.speed
              this.duration = totalms / 1000
            }
          }
          this.gamePause()
        })
        .catch(() => {
          this.gamePause()
        })
    }
  },
  data () {
    return {
      boardCfg: {
        position: 'start',
        draggable: false,
        moveSpeed: 250,
        pieceTheme: '/img/chesspieces/wikipedia/{piece}.png'
      },
      chart: {
        width: 100,
        height: 50,
        maxValue: 100,
        vSteps: 3,
        points: [],
        values: [],
        measurements: []
      },
      boardColor: 'classic',
      data: {},
      eco: {},
      duration: 0,
      status: '',
      score: 0.10,
      vscore: 49,
      ecode: null,
      opening: null,
      board: null,
      game: null,
      orientation: null,
      gameMoves: [],
      pgnIndex: [],
      hasScore: false,
      boardEl: null,
      index: 0,
      paused: false,
      speed: 1000
    }
  }
}
</script>
