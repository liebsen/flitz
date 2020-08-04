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
        <div class="columns is-multiline">
          <div class="column is-12-mobile is-6-tablet is-4-desktop is-3-widescreen" v-for="(item, index) in data.games" :key="index">
            <game-list :data-item="item"/>
          </div>
        </div>
      </div>
    </div>
    <table-pager :dataSet="pager"/>
  </div>
</template>

<script>

import axios from 'axios'
import snackbar from '../components/Snackbar'
import TablePager from '@/components/TablePager'
import GameList from '@/components/GameList'
export default {
  name: 'results',
  watch: {
    '$route': function () {
      this.triggerSearch()
    }
  },
  components: {
    TablePager,
    GameList
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
      this.$router.push('/results?q=' + this.pager.query.trim()).catch(() => {})
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
        limit: 12,
        offset: 0
      },
      searching: false,
      msg: 'Results'
    }
  }
}
</script>
