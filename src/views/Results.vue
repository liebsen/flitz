<template>
  <div class="container is-widescreen">
    <div class="content column fadeIn">
      <h3>
        <span class="icon has-margin">
          <span class="mdi mdi-view-list"></span>
        </span>
        <span>{{ 'results' | t }}</span>
      </h3>
      <form @submit.prevent="submit">
        <div class="field has-addons">
          <div class="control">
            <input ref="input" @keyup="inputTrigger" v-model="pager.query" class="input is-rounded is-success" type="text" placeholder="Evento, lugar, fecha, jugador o PGN" autofocus>
          </div>
          <div class="control">
            <button v-show="this.searching" type="button" @click="clear" class="button is-rounded is-danger">
              <span class="icon has-margin">
                <span class="mdi mdi-close"></span>
              </span>
            </button>
            <button v-show="!this.searching" type="submit" id="searchbtn" class="button is-rounded is-success">
              <span class="icon has-margin">
                <span class="mdi mdi-magnify"></span>
              </span>
            </button>
          </div>
        </div>
      </form>
      <div v-if="data.count" class="has-text-left">
        <table class="table is-narrow is-striped is-fullwidth">
          <thead>
            <th></th>
            <th>{{ 'event' | t }}</th>
            <th>{{ 'white' | t }}</th>
            <th>{{ 'black' | t }}</th>
            <th>{{ 'date' | t }}</th>
            <th>{{ 'plys' | t }}</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in data.games" :key="index">
              <td>
                <router-link :to="'/game/'+item._id">
                  <span class="icon">
                    <span class="mdi mdi-chess-king"></span>
                  </span>
                </router-link>
              </td>
              <td>
                <span v-html="item.event"></span>
              </td>
              <td>
                <span v-show="item.result==='1-0'" class="mdi mdi-trophy is-size-7 has-text-warning"></span>
                <span v-show="item.result==='1/2-1/2'" class="mdi mdi-handshake has-text-success"></span>
                <span v-if="item.whiteflag" class="icon has-margin preservefilter">
                  <span v-html="item.whiteflag"></span>
                </span>
                <span v-html="item.white"></span>
              </td>
              <td>
                <span v-show="item.result==='0-1'" class="mdi mdi-trophy is-size-7 has-text-warning"></span>
                <span v-show="item.result==='1/2-1/2'" class="mdi mdi-handshake has-text-success"></span>
                <span v-if="item.blackflag" class="icon has-margin preservefilter">
                  <span v-html="item.blackflag"></span>
                </span>
                <span v-html="item.black"></span>
              </td>
              <td>
                <span v-html="item.date"></span>
              </td>
              <td>
                <span v-html="$root.countMoves(item.pgn)"></span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <table-pager :dataSet="pager"/>
  </div>
</template>

<script>

import axios from 'axios'
import snackbar from '../components/Snackbar'
import TablePager from '@/components/TablePager'
export default {
  name: 'results',
  watch: {
    '$route': function () {
      this.triggerSearch()
    }
  },
  components: {
    TablePager
  },
  mounted: function () {
    this.pager.query = this.$route.query.q || ''
    this.triggerSearch()
  },
  methods: {
    inputTrigger: function () {
      if (this.interval) clearInterval(this.interval)
      this.interval = setTimeout(() => {
        this.$router.push({ path: 'results', query: { q: this.pager.query } })
      }, 1500)
    },
    clear: function () {
      this.pager.query = ''
      this.submit()
    },
    triggerSearch: function () {
      if (this.$route.query.offset) {
        this.pager.offset = parseInt(this.$route.query.offset)
      }
      // this.$nextTick(() => this.$refs.input.focus())
      this.search()
    },
    search: function () {
      this.$root.loading = true
      this.searching = this.$route.query.length || false
      let req = this.pager
      req.strict = this.$route.query.strict
      axios.post('/search', req).then((res) => {
        this.data = res.data
        let t = this.$root.t
        var pages = []
        if (res.data.error) {
          if (res.data.error === 'not_enough_params') {
            snackbar('info', this.$root.t('results_toast'), 15000)
          }
        } else {
          if (res.data.count === 0) {
            snackbar('danger', t('results_nomatch'), 5000)
          } else {
            var numPages = Math.ceil(res.data.count / this.pager.limit)
            for (var i = 0; i < numPages; i++) {
              pages[i] = i * this.pager.limit
            }
            snackbar('success', t('results_found') + this.data.count + ' ' + (this.data.count > 1 ? t('games') : t('game')) + '. ' + t('showing_results') + (this.pager.offset + 1) + ' ' + t('to') + ' ' + (this.pager.offset + this.pager.limit > this.data.count ? this.data.count : this.pager.offset + this.pager.limit), 5000)
          }
        }

        let max = 20

        if (pages.length > max) {
          pages.splice(max / 2, pages.length - max)
        }

        this.pager.pages = pages
        this.$root.loading = false
      })
    },
    submit: function () {
      this.$router.push('/results?q=' + this.pager.query.trim())
    }
  },
  data () {
    return {
      data: {
        count: 0,
        games: []
      },
      pager: {
        pages: {},
        query: '',
        limit: 25,
        offset: 0
      },
      searching: false,
      msg: 'Results'
    }
  }
}
</script>
