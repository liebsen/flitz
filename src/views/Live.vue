<template>
  <div class="container is-widescreen">
    <div class="content column fadeIn">
      <h3>
        <span class="icon">
          <span class="mdi mdi-fire"></span>
        </span>
        <span>{{ 'live' | t }}</span>
      </h3>
      <form @submit.prevent="submit">
        <label class="label"><span v-html="eco.name" class="has-text-grey"></span></label>
        <div class="field has-addons">
          <div class="control">
            <input ref="input" @keyup="inputTrigger" v-model="pager.query" class="input is-rounded is-success" type="text" :placeholder="'live_input_placeholder' | t" autofocus>
          </div>
          <div class="control">
            <button v-show="pager.query.length" type="button" @click="clear" class="button is-rounded is-danger">
              <span class="icon">
                <span class="mdi mdi-close"></span>
              </span>
            </button>
            <button v-show="!pager.query.length" type="submit" id="searchbtn" class="button is-rounded is-success">
              <span class="icon">
                <span class="mdi mdi-magnify"></span>
              </span>
            </button>
          </div>
        </div>
      </form>
      <div v-if="Object.keys(data).length" class="has-text-left">
        <table class="table">
          <thead>
            <th></th>
            <th>{{ 'event' | t }}</th>
            <th>{{ 'white' | t }}</th>
            <th>{{ 'black' | t }}</th>
            <th>{{ 'plys' | t }}</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in data.games" :key="index">
              <td>
                <router-link :to="'/watch/'+item._id">
                  <span class="icon">
                    <span class="mdi mdi-play"></span>
                  </span>
                </router-link>
              </td>
              <td>
                <span v-html="item.event"></span>
              </td>
              <td>
                <span v-html="item.white"></span>
              </td>
              <td>
                <span v-html="item.black"></span>
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
  name: 'live',
  components: {
    TablePager
  },
  watch: {
    '$route': function () {
      this.triggerSearch()
    }
  },
  mounted: function () {
    this.triggerSearch()
  },
  methods: {
    inputTrigger: function () {
      if (this.interval) clearInterval(this.interval)
      this.interval = setTimeout(() => {
        this.$router.push({ path: 'live', query: { q: this.pager.query } })
      }, 1500)
    },
    clear: function () {
      this.pager.query = ''
      this.submit()
    },
    triggerSearch: function () {
      if (this.$route.query.q) {
        this.pager.query = this.$route.query.q
      }
      if (this.$route.query.offset) {
        this.offset = parseInt(this.$route.query.offset)
      }
      this.$nextTick(() => this.$refs.input.focus())
      this.search()
    },
    search: function () {
      axios.post('/online', this.pager).then((res) => {
        this.data = res.data
        let t = this.$root.t
        var pages = []
        if (res.data.error) {
          if (res.data.error === 'not_enough_params') {
            snackbar('info', 'Ingresá una palabra clave para ver partidas. Podés buscar por evento, lugar, jugador o PGN.', 15000)
          }
        } else {
          if (res.data.count === 0) {
            snackbar('warning', 'No hay partidas en vivo', 5000)
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
      this.$router.push('/live?q=' + this.pager.query.trim())
    }
  },
  data () {
    return {
      data: {},
      eco: {},
      pager: {
        pages: {},
        query: '',
        limit: 25,
        offset: 0
      }
    }
  }
}
</script>
