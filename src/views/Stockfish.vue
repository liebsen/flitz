<template>
  <div class="container is-widescreen">
    <div class="content" v-show="time.level < 0">
      <div class="columns-centered fadeIn">
        <div class="columns columns-bottom is-flex has-text-centered">
          <div class="column">
            <h3>Jugar contra Stockfish</h3>
            <div class="control">
              <div class="buttons levels has-addons preservefilter">
                <button class="button is-rounded is-large is-white-pieces" @click="setPlayerColor('white')" :class="{'has-background-success' : selectedColor==='white'}"></button>
                <button class="button is-large is-random-pieces" @click="setPlayerColor('random')" :class="{'has-background-success' : selectedColor==='random'}"></button>
                <button class="button is-large is-rounded is-black-pieces" @click="setPlayerColor('black')" :class="{'has-background-success' : selectedColor==='black'}"></button>
              </div>
            </div>
          </div>
        </div>
        <div class="columns is-flex has-text-centered">
          <div class="column">
            <h4>Nivel</h4>
            <div class="control has-text-centered column">
              <div class="buttons levels has-addons">
                <button class="button is-rounded" @click="gameStart(0)">
                  <span class="has-text-weight-bold has-text-primary">{{ 'level_0' | t }}</span>
                </button>
                <button class="button" @click="gameStart(4)">
                  <span class="has-text-weight-bold has-text-primary">{{ 'level_1' | t }}</span>
                </button>
                <button class="button" @click="gameStart(8)">
                  <span class="has-text-weight-bold has-text-info">{{ 'level_2' | t }}</span>
                </button>
                <button class="button" @click="gameStart(12)">
                  <span class="has-text-weight-bold has-text-info">{{ 'level_3' | t }}</span>
                </button>
                <button class="button" @click="gameStart(16)">
                  <span class="has-text-weight-bold has-text-danger">{{ 'level_4' | t }}</span>
                </button>
                <button class="button is-rounded" @click="gameStart(20)">
                  <span class="has-text-weight-bold has-text-danger">{{ 'level_5' | t }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content" v-show="time.level > -1">
      <div class="columns is-marginless-top fadeIn" :class="boardColor">
        <div class="column">
          <div class="board-container">
            <h6 class="has-text-left black is-hidden-mobile">
              <span v-show="data.result==='0-1'">🏆</span>
              <span class="has-text-weight-bold">{{ opponentName }}</span>
              <span class="button is-small thinking" :class="{'is-loading' : thinking}"></span>
            </h6>
            <div class="board preservefilter" :class="{ 'black' : playerColor==='black' }">
              <div class="score-container">
                <div class="score" :style="'max-height:' + vscore + '%'"></div>
              </div>
              <div id="board"></div>
            </div>
            <h6 class="has-text-right white is-hidden-mobile">
              <span v-show="data.result==='1-0'">🏆</span>
              <span class="icon has-margin preservefilter">
                <span v-html="player.flag"/>
              </span>
              <span class="has-text-weight-bold" v-html="player.code"></span>
            </h6>
          </div>
        </div>
        <div class="column">
          <!--pre v-html="chart.values"/-->
          <div class="board-assistant">
            <div class="columns has-text-centered" v-show="pgnIndex.length">
              <div class="column preservefilter">
                <div class="buttons levels has-addons" :title="'stockfish_options' | t">
                  <button @click="askForRematch()" class="button is-rounded is-danger" v-if="!announced_game_over" title="Abandonar partida">
                    <span class="icon has-text-white">
                      <span class="mdi mdi-flag"></span>
                    </span>
                  </button>
                  <button @click="showHint()" class="button is-rounded is-success" v-if="pgnIndex.length && !announced_game_over" title="Mostrar pista">
                    <span class="icon has-text-white">
                      <span class="mdi mdi-timeline-help"></span>
                    </span>
                  </button>
                  <button @click="askForRematch()" class="button is-rounded is-success" v-if="announced_game_over" title="Jugar de nuevo">
                    <span class="icon">
                      <span class="mdi mdi-replay"></span>
                    </span>
                  </button>
                  <button @click="showPGN()" class="button is-rounded is-info" v-if="pgnIndex.length" title="Mostrar PGN">
                    <strong>PGN</strong>
                  </button>
                </div>
              </div>
            </div>
            <div class="columns has-text-centered">
              <div class="column">
                <div class="field">
                  <strong class="has-text-grey is-size-5">{{ eco }}</strong>
                  <span class="has-text-weight-bold has-text-black is-size-5">{{ opening }}</span>
                </div>
                <!--div class="field">
                  <span v-html="status" class="has-text-black"></span>
                </div-->
              </div>
            </div>
            <div class="columns is-hidden-mobile">
              <div class="chart-container preservefilter">
                <div :class="playerColor">
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
                      <a v-if="move.white" :class="'moveindex m' + (move.i-2)" @click="gamePos(move.i-2)">
                        <span v-html="move.white"></span>
                        <span v-if="annotations[index * 2]" class="icon">
                          <span class="mdi" :class="{ 'mdi-sticker-plus' : annotations[index * 2] === '$1', 'mdi-sticker-check' : annotations[index * 2] === '$3', 'mdi-sticker-minus' : annotations[index * 2] === '$2', 'mdi-sticker-remove' : annotations[index * 2] === '$4', 'mdi-book-open': annotations[index * 2] === '$12', 'mdi-sticker-alert': annotations[index * 2] === '$14', 'mdi-sticker-emoji': annotations[index * 2] === '$15'}"></span>
                        </span>
                        <span v-if="performance[index * 2]">
                          <small v-if="performance[index * 2]"> {{ performance[index * 2] }}</small>
                        </span>
                        <span v-else class="icon">
                          <span class="mdi mdi-dots-horizontal"/>
                        </span>
                      </a>
                    </div>
                    <div class="moveCell moveSAN moveb" :class="{ 'moveRowOdd': move.odd, 'moveRowEven': !move.odd }">
                      <a v-if="move.black" :class="'moveindex m' + (move.i-1)" @click="gamePos(move.i-1)">
                        <span v-html="move.black"></span>
                        <span v-if="annotations[index * 2 + 1]" class="icon">
                          <span class="mdi" :class="{ 'mdi-sticker-plus' : annotations[index * 2 + 1] === '$1', 'mdi-sticker-check' : annotations[index * 2 + 1] === '$3', 'mdi-sticker-minus' : annotations[index * 2 + 1] === '$2', 'mdi-sticker-remove' : annotations[index * 2 + 1] === '$4', 'mdi-book-open': annotations[index * 2 + 1] === '$12', 'mdi-sticker-alert': annotations[index * 2 + 1] === '$14', 'mdi-sticker-emoji': annotations[index * 2 + 1] === '$15' }"></span>
                        </span>
                        <span v-if="performance[index * 2 + 1]">
                          <small v-if="performance[index * 2 + 1]"> {{ performance[index * 2 + 1]}}</small>
                        </span>
                        <span v-else class="icon">
                          <span class="mdi mdi-dots-horizontal"/>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
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
import snackbar from '../components/Snackbar'
import PlaySound from '../components/PlaySound'
import swal from 'sweetalert'

export default {
  name: 'stockfish',
  mounted () {
    window.app = this
    // const saved = JSON.parse(localStorage.getItem('player'))

    document.getElementById('board').addEventListener('wheel', event => {
      this.gamePos(Math.sign(event.deltaY) < 0 ? this.index + 1 : this.index - 1)
    })

    if (!Worker || (location && location.protocol === 'file:')) {
      var scriptTag = document.createElement('script')
      scriptTag.type = 'text/javascript'
      scriptTag.src = '/js/stockfish.js'
      // scriptTag.onload = init
      document.getElementsByTagName('head')[0].appendChild(scriptTag)
    }

    let pieces = ['.is-white-pieces', '.is-black-pieces', '.is-random-pieces']
    pieces.forEach(tag => {
      let e = document.querySelector(tag)
      let li = window.getComputedStyle(e)
      e.style.backgroundImage = li.getPropertyValue('background-image').split('cburnett').join(this.player.pieces)
    })
    this.$root.loading = false
  },
  computed: {
    ...mapState([
      'player',
      'stockfishEvalTime'
    ])
  },
  methods: {
    gameRestart () {
      var t = this
      t.game.reset()
      t.announced_game_over = false
      t.pgnIndex = []
      t.time.level = -1
      t.eco = ''
      t.opening = ''
      t.index = -1
      t.score = 0.10
      t.vscore = 49
      t.stockfishMoved = false
      t.chart.values = [51]
      document.querySelector('.chart').textContent = ''
    },
    askForRematch () {
      var t = this
      swal({
        title: 'Reiniciar partida',
        text: '¿Querés reiniciar esta partida?',
        buttons: ['No', 'Sí']
      })
        .then(accept => {
          if (accept) {
            t.gameRestart()
          } else {
            console.log('Clicked on cancel')
          }
        })
    },
    showPGN () {
      var pgn = this.game.pgn() + ' ' + (this.data.result ? this.data.result : '')
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
    gamePos (pos) {
      if (pos > Object.keys(this.gameMoves).length - 1 || pos < 0) { // ||!this.announced_game_over
        return
      }

      this.index = pos
      const moves = this.gameMoves.slice(0, this.index)
      var move = this.gameMoves[this.index].san
      this.vscore = this.gameMoves[this.index].vscore

      // ---------------
      var pgn = []
      moves.forEach((move, i) => {
        if (i % 2) {
          pgn.push(move.san)
        } else {
          pgn.push([Math.ceil(i / 2) + 1, move.san].join('. '))
        }
      })

      const pgns = pgn.join(' ')
      this.game.reset()
      this.game.load_pgn(pgns)

      const moved = this.game.move(move)
      this.board.position(this.game.fen())
      this.updateMoveList()
      this.drawChartPosition()

      setTimeout(() => {
        if (moved) {
          this.moveSound(moved)
          this.addHightlight(moved)
        }
      }, 250)
    },
    makeAnnotation (index) {
      /*
        $1 good !
        $2 poor ?
        $3 very good !!
        $4 very poor ??
        $5 speculative !?
        $6 questionable ?!
        $14 White has a slight advantage
        $15 Black has a slight advantage
        $12 book
      */
      var annotation = false
      if (this.ecoFound) {
        annotation = 12
      } else if (this.performance[index - 1]) {
        const abs = parseFloat(this.performance[index]) - parseFloat(this.performance[index - 1])
        const delta = Math.abs(abs)
        if (delta > 2) {
          annotation = abs > 0 ? (this.game.turn() === 'b' ? 3 : 4) : (this.game.turn() === 'b' ? 4 : 3)
        } else if (delta > 1) {
          annotation = abs > 0 ? (this.game.turn() === 'b' ? 1 : 2) : (this.game.turn() === 'b' ? 2 : 1)
        } else if (delta > 0.5) {
          annotation = abs > 0 ? (this.game.turn() === 'b' ? 15 : 14) : (this.game.turn() === 'b' ? 14 : 15)
        }
      }
      if (annotation) {
        this.annotations[index] = `$` + annotation
      }
    },
    drawChartPosition (draw) {
      if (draw === undefined) draw = true
      if (!draw) {
        document.querySelector('.chart-indicator').style.backgroundColor = 'transparent'
      } else {
        document.querySelector('.chart-indicator').style.left = ((this.index + 1) / this.gameMoves.length * 100) + '%'
        document.querySelector('.chart-indicator').style.backgroundColor = 'rgb(0,0,0,0.15)'
      }
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
    uciCmd (cmd, which) {
      // console.log("UCI: " + cmd);
      (which || this.engine).postMessage(cmd)
    },
    gameStart (level) {
      /* global STOCKFISH */
      let t = this
      const pref = JSON.parse(localStorage.getItem('player')) || {}

      this.opponentName = 'Stockfish ' + this.$root.t('level') + ' ' + (level / 2)
      this.engine = typeof STOCKFISH === 'function' ? STOCKFISH() : new Worker('/js/stockfish.js')
      this.engineStatus = {}

      this.engine.onmessage = function (event) {
        var line
        var t = window.app
        if (event && typeof event === 'object') {
          line = event.data
        } else {
          line = event
        }
        // console.log(line)
        if (line === 'uciok') {
          t.engineStatus.engineLoaded = true
        } else if (line === 'readyok') {
          t.engineStatus.engineReady = true
        } else {
          var reBestmove = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/)
          var reDepth = line.match(/^info .*\bdepth (\d+) .*\bnps (\d+)/)
          /// Did the AI move?
          var reScore = line.match(/^info .*\bscore (\w+) (-?\d+)/)
          var reBound = line.match(/\b(upper|lower)bound\b/)

          if (reBestmove) {
            if (t.hintMode || t.isEngineRunning) {
              const move = t.game.move({ from: reBestmove[1], to: reBestmove[2], promotion: reBestmove[3] })
              if (!t.hintMode) {
                t.board.position(t.game.fen())
                t.updateMoves(move)
                t.uciCmd('position startpos moves' + t.moveList())
                t.uciCmd('eval', this.engine)
                t.uciCmd('go ' + (t.time.depth ? 'depth ' + t.time.depth : ''))
              } else {
                document.querySelector('.square-' + move.from).classList.add('highlight-move')
                document.querySelector('.square-' + move.to).classList.add('highlight-move')
                t.game.undo()
                t.hintMode = false
              }
              t.isEngineRunning = false
            }
            /// Is it sending feedback?
          } else if (reDepth) {
            t.engineStatus.search = 'Depth: ' + reDepth[1] + ' Nps: ' + reDepth[2]
          }

          /// Is it sending feed back with a score?
          if (reScore) {
            var score = parseFloat(reScore[2]) * (t.game.turn() === 'w' ? 1 : -1)
            /// Is it measuring in centipawns?
            if (reScore[1] === 'cp') {
              t.engineStatus.score = (score / 100.0).toFixed(2)
              /// Did it find a mate?
            } else if (reScore[1] === 'mate') {
              // const abs = Math.abs(score) - 1
              // t.engineStatus.score = abs > 0 ? 'Mate en ' + abs : "Mate"
            }

            /// Is the score bounded?
            if (reBound) {
              // t.engineStatus.score = ((reBound[1] === 'upper') === (t.game.turn() === 'w') ? '<= ' : '>= ') + t.engineStatus.score
            }
            // t.score = t.engineStatus.score.split(' ').reverse()[0]
            // t.vscore = 50 - (t.score / 64 * 100)
          }
        }

        var reTotalEvaluation = line.match(/^Total evaluation: (-?\d+\.\d+)/)
        if (reTotalEvaluation) {
          t.score = parseFloat(reTotalEvaluation[1])
          t.vscore = 50 - (t.score / 64 * 100)
        }

        // stockfish starts with white
        if (t.engineStatus.engineLoaded && t.playerColor[0] === 'b' && !t.hintMode && !t.stockfishMoved) {
          setTimeout(() => {
            t.prepareMove()
            t.stockfishMoved = true
          }, t.ucitime * 3)
        }
      }

      t.uciCmd('uci')
      t.setSkillLevel(level)

      setTimeout(() => {
        t.boardEl = document.getElementById('board')
        t.$root.fullscreenBoard()
        t.game = new Chess()

        if (window.innerWidth < 789) {
          t.boardCfg.draggable = false
        }

        t.boardCfg.moveSpeed = this.player.moveSpeed || 250
        if (pref.pieces) {
          t.boardCfg.pieceTheme = '/img/chesspieces/' + pref.pieces + '/{piece}.png'
          t.boardColor = pref.board
        }

        t.board = Chessboard('board', t.boardCfg)
        t.board.orientation(t.playerColor)

        if (t.playerColor === 'white') {
          t.data.white = t.player.code
          t.data.whiteflag = t.player.flag
          t.data.black = 'Stockfish'
        } else {
          t.data.white = 'Stockfish'
          t.data.blackflag = t.player.flag
          t.data.black = t.player.code
        }

        // resize event handling

        window.onresize = function (event) {
          t.$root.fullscreenBoard()
          t.board.resize()
          t.highlightLastMove()
          t.boardTaps()
        }

        const offset = 150
        if (document.querySelector('.movesTableContainer')) {
          document.querySelector('.movesTableContainer').style.height = (document.querySelector('.board').clientHeight - offset) + 'px'
        }
        PlaySound('start.mp3')
        t.boardTaps()
      }, 100)
    },
    boardTaps () {
      if (!document.querySelector('.chessboard-63f37')) {
        return
      }
      var t = this
      const events = ['click', 'mousedown']
      events.forEach((event) => {
        document.querySelector('.chessboard-63f37').addEventListener(event, e => {
          e.preventDefault()
          const turn = t.game.turn() === t.playerColor[0]
          const piece = e.target.getAttribute('data-piece')

          if (!turn) return
          if (e.target.classList.contains('row-5277c') || e.target.classList.contains('board-b72b1')) return

          const src = e.target.getAttribute('src')
          const target = src ? e.target.parentNode : e.target
          const square = target.id.substring(0, 2)

          if (!t.moveFrom) {
            if (piece && piece[0] !== t.playerColor[0]) return
            target.classList.add('highlight-move')
            if (!src) { // blank square
              t.removeHighlight()
              return
            }

            t.moveFrom = square
          } else {
            if (square === t.moveFrom) return
            var moveObj = ({
              from: t.moveFrom,
              to: square,
              promotion: 'q' // NOTE: always promote to a queen for example simplicity
            })

            t.moveFrom = null
            var move = t.game.move(moveObj)

            // illegal move
            if (move === null) {
              t.removeHighlight()
              t.moveFrom = square
              if (src) {
                target.classList.add('highlight-move')
              }
              return 'snapback'
            }

            t.board.position(t.game.fen(), false)
            t.updateMoves(move)

            setTimeout(() => {
              this.prepareMove()
            }, this.ucitime)
          }
        })
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
    prepareMove () {
      var t = this
      if (!t.game.game_over()) {
        t.thinking = true
        t.isEngineRunning = true
        t.uciCmd('position startpos moves' + t.moveList())
        t.uciCmd('eval', this.engine)
        t.uciCmd('go ' + (t.time.depth ? 'depth ' + t.time.depth : ''))
      }
    },
    showHint () {
      this.hintMode = true
      this.isEngineRunning = false
      this.uciCmd('position startpos moves' + this.moveList())
      this.uciCmd('eval', this.engine)
      this.uciCmd('go ' + (this.time.depth ? 'depth ' + this.time.depth : ''))
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
    drawChart (index) {
      let score = this.vscore
      if (this.playerColor === 'white') {
        score = 100 - score
      }

      if (score < 0) {
        score = 0
      }

      if (score > 100) {
        score = 100
      }

      if (!isNaN(score)) {
        this.drawChartPosition(false)
        this.chart.values = this.chart.values.slice(0, index)
        this.chart.values[index] = score.toFixed(2)
        this.updateChart()
      }
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
      chart.setAttribute('viewBox', `0 0 ${this.chart.width} ${this.chart.height}`)

      var polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
      polygon.setAttribute('points', this.chart.points)
      element.style.width = width

      if (this.chart.values.length > 1) {
        element.appendChild(chart)
        chart.appendChild(polygon)
      }
    },
    moveSound (move) {
      var sound = 'move.mp3'
      let t = this
      if (t.game.game_over()) {
        if (t.game.in_draw() || t.game.in_stalemate() || t.game.in_threefold_repetition()) {
          sound = 'end.mp3'
        } else if (t.game.turn() === t.playerColor[0]) {
          sound = 'lose.mp3'
        } else {
          sound = 'win.mp3'
        }
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
          sound = 'check.mp3'
        }
      }

      PlaySound(sound)
    },
    removeHighlight () {
      if (document.getElementById('board')) {
        document.getElementById('board').querySelectorAll('.square-55d63').forEach((item) => {
          item.classList.remove('highlight-move')
          item.classList.remove('in-check')
        })
      }
    },
    addHightlight (move) {
      var t = this
      t.removeHighlight()
      if (move) {
        if (t.game.in_check() === true) {
          setTimeout(() => {
            if (document.getElementById('board')) {
              document.getElementById('board').querySelector('img[data-piece="' + t.game.turn() + 'K"]').parentNode.classList.add('in-check')
            }
          }, 200)
        }
        if (document.getElementById('board')) {
          document.getElementById('board').querySelector('.square-' + move.from).classList.add('highlight-move')
          document.getElementById('board').querySelector('.square-' + move.to).classList.add('highlight-move')
        }
      }
    },
    highlightLastMove () {
      var history = this.game.history({ verbose: true })
      if (history.length) {
        var move = history[history.length - 1]
        this.addHightlight(move)
      }
    },
    updateMoves (move) {
      if (!move) return
      var t = this
      if (t.game.game_over()) {
        if (t.game.in_draw() || t.game.in_stalemate() || t.game.in_threefold_repetition()) {
          swal({
            title: t.$root.t('game_draw'),
            text: t.$root.t('stockfish_ask_play_again'),
            buttons: [t.$root.t('no'), t.$root.t('yes')]
          }).then(accept => {
            if (accept) {
              t.gameRestart()
            } else {
              console.log('Clicked on cancel')
            }
          })
        } else {
          setTimeout(() => {
            if (t.game.turn() === t.playerColor[0]) {
              swal({
                title: t.$root.t('stockfish_won'),
                text: t.$root.t('stockfish_ask_play_again'),
                buttons: [t.$root.t('no'), t.$root.t('yes')]
              })
                .then(accept => {
                  if (accept) {
                    t.gameRestart()
                  } else {
                    console.log('Clicked on cancel')
                  }
                })
            } else {
              swal(t.$root.t('you_defeat_stockfish'), {
                buttons: {
                  cancel: t.$root.t('cancel'),
                  catch: {
                    text: t.$root.t('play_again'),
                    value: 'catch'
                  },
                  defeat: t.$root.t('save_game')
                }
              }).then((value) => {
                switch (value) {
                  case 'defeat':
                    let event = [this.$root.t('play_against'), 'Stockfish'].join(' ')
                    let opponent = this.opponentName
                    let white = this.playerColor === 'white' ? this.player.code : opponent
                    let black = this.playerColor === 'black' ? this.player.code : opponent
                    let whiteflag = this.playerColor === 'white' ? this.player.flag : ''
                    let blackflag = this.playerColor === 'black' ? this.player.flag : ''
                    let result = this.playerColor === 'white' ? '1-0' : '0-1'
                    let game = {
                      event: event,
                      white: white,
                      black: black,
                      whiteflag: whiteflag,
                      blackflag: blackflag,
                      result: result,
                      eco: this.eco,
                      opening: this.opening,
                      orientation: this.board.orientation(),
                      pgn: this.game.pgn(),
                      fen: this.game.fen(),
                      chart: this.chart.values,
                      score: this.performance,
                      annotations: this.annotations
                    }

                    axios.post('/game/save', game).then((res) => {
                      if (res.data.status === 'success') {
                        this.$store.dispatch('games', res.data)
                        swal(this.$root.t('saved'), this.$root.t('stockfish_saved'))
                      } else {
                        snackbar('danger', 'La partida no pudo ser guardada')
                      }
                    })

                    break

                  case 'catch':
                    this.gameRestart()

                    break

                  default:
                    swal.close()
                }
              })
            }
          }, 1000)
        }
        t.announced_game_over = true
      }

      t.pgnIndex = this.gamePGNIndex(t.game.pgn())
      t.index++
      t.gameMoves = t.gameMoves.slice(0, t.index)

      setTimeout(() => {
        const index = t.index
        t.gameMoves[t.index] = {
          san: move.san,
          vscore: t.vscore
        }
        t.addHightlight(move)
        t.moveSound(move)
        t.updateMoveList()
        setTimeout(() => {
          if (!t.hintMode) {
            t.displayStatus()
          }
          t.drawChart(index)
        }, t.stockfishEvalTime)
      }, 250)

      t.thinking = false
      t.findEco(t.game.pgn())
    },
    findEco (pgn) {
      let t = this
      let ecoFound = false
      axios.post('/eco/pgn', { pgn: pgn }).then((res) => {
        if (res.data.eco) {
          ecoFound = true
          t.opening = t.$root.t(res.data.eco)
          t.eco = res.data.eco
        }
        t.ecoFound = ecoFound
      })
    },
    updateMoveList () {
      const movesTable = document.querySelector('.movesTableContainer')
      const current = document.querySelector('.moveindex.m' + this.index)
      if (current.parentNode.offsetTop + current.parentNode.clientHeight > movesTable.clientHeight) {
        movesTable.scrollTop = current.parentNode.offsetTop
      } else {
        movesTable.scrollTop = 0
      }
      document.querySelectorAll('.moveindex').forEach((item) => {
        item.parentNode.classList.remove('active')
      })
      document.querySelector('.moveindex.m' + this.index).parentNode.classList.add('active')
    },
    gamePGNIndex (pgn) {
      var data = []
      /* var symbols = [
        { K: '♔', Q: '♕', B: '♗', N: '♘', R: '♖', p: '♙' },
        { K: '♚', Q: '♛', B: '♝', N: '♞', R: '♜', p: '♟' }
      ] */
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
    setPlayerColor (color) {
      this.selectedColor = color
      if (color === 'random') {
        const allow = ['white', 'black']
        if (!allow[color]) {
          color = allow[Math.floor(Math.random() * allow.length)]
        }
      }
      this.playerColor = color
    },
    setSkillLevel (skill) {
      var t = this
      var maxErr
      var errProb
      // var difficultySlider

      if (skill < 0) {
        return
      }
      if (skill > 20) {
        skill = 20
      }

      t.time.level = skill

      /// Change thinking depth allowance.
      if (skill < 5) {
        t.time.depth = '1'
      } else if (skill < 10) {
        t.time.depth = '5'
      } else if (skill < 15) {
        t.time.depth = '10'
      } else {
        /// Let the engine decide.
        t.time.depth = ''
      }

      t.uciCmd('setoption name Skill Level value ' + skill)
      /// NOTE: Stockfish level 20 does not make errors (intentially), so these numbers have no effect on level 20.
      /// Level 0 starts at 10
      maxErr = Math.round((skill * -0.5) + 300)
      // maxErr = Math.round((skill * -0.25) + 5);

      /// Level 0 starts at 1
      errProb = Math.round((skill * 6.35) + 5)

      t.uciCmd('setoption name Skill Level Maximum Error value ' + maxErr)
      t.uciCmd('setoption name Skill Level Probability value ' + errProb)
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

      this.performance = this.performance.slice(0, this.index)
      this.performance[this.index] = this.score
      this.makeAnnotation(this.index)
      t.status = status
    },
    onDragStart (source, piece, position, orientation) {
      var re = this.playerColor === 'white' ? /^b/ : /^w/
      if (this.game.game_over() ||
          piece.search(re) !== -1) {
        return false
      }
    },
    onDrop (source, target) {
      var move = this.game.move({
        from: source,
        to: target,
        promotion: 'q'
      })

      if (move === null) return 'snapback'

      this.isEngineRunning = false
      this.uciCmd('position startpos moves' + this.moveList())
      this.uciCmd('eval', this.engine)
      this.uciCmd('go ' + (this.time.depth ? 'depth ' + this.time.depth : ''))
      this.moveFrom = null
      this.updateMoves(move)

      setTimeout(() => {
        this.prepareMove()
      }, this.ucitime)
    },
    onSnapEnd () {
      setTimeout(() => {
        this.board.position(this.game.fen(), false)
      }, 100)
    }
  },
  data () {
    return {
      boardCfg: {
        position: 'start',
        draggable: true,
        onDragStart: this.onDragStart,
        onDrop: this.onDrop,
        onSnapEnd: this.onSnapEnd,
        pieceTheme: '/img/chesspieces/cburnett/{piece}.png'
      },
      chart: {
        width: 100,
        height: 50,
        maxValue: 100,
        values: [51],
        points: []
      },
      data: {
        white: null,
        black: null
      },
      time: {
        level: -1
      },
      annotations: {},
      opponentName: 'Stockfish',
      index: -1,
      gameMoves: [],
      displayScore: true,
      status: '',
      score: 0.10,
      performance: [],
      vscore: 49,
      moveFrom: null,
      hintMode: false,
      thinking: false,
      isEngineRunning: false,
      engineStatus: {},
      announced_game_over: false,
      playerColor: 'white',
      selectedColor: 'white',
      eco: null,
      opening: null,
      board: null,
      ecoFound: false,
      boardColor: '',
      game: null,
      pgnIndex: [],
      stockfishMoved: false,
      ucitime: 1000
    }
  }
}
</script>
