<template>
  <div class="container is-widescreen">
    <div class="content column fadeIn">
      <h3>
        <span class="icon">
          <span class="mdi mdi-book"></span>
        </span>
        <span>{{ 'openings' | t }}</span>
      </h3>
      <form @submit.prevent="submit">
        <div class="field has-addons">
          <div class="control">
            <input ref="input" @keyup="inputTrigger" v-model="pager.query" class="input is-rounded is-success" type="text" placeholder="Nombre o PGN" autofocus>
          </div>
          <div class="control">
            <button v-show="pager.query.length" type="button" @click="clear" class="button is-rounded is-danger">
              <span class="icon">
                <span class="mdi mdi-close"></span>
              </span>
            </button>
            <button v-show="!pager.query.length" type="submit" id="searchbtn" class="button is-rounded is-success">
              <span class="icon">
                <span class="mdi mdi-book-search"></span>
              </span>
            </button>
          </div>
        </div>
      </form>
      <div v-show="Object.keys(data).length" class="has-text-left">
        <table class="table is-narrow is-striped is-fullwidth">
          <thead>
            <th></th>
            <th>{{ 'name' | t }}</th>
            <th>{{ 'eco' | t }}</th>
            <th>{{ 'plys' | t }}</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in data.games" :key="index">
              <td>
                <router-link :to="'/opening/'+item.eco">
                  <span class="icon">
                    <span class="mdi mdi-play"></span>
                  </span>
                </router-link>
              </td>
              <td>
                <span v-html="item.name"></span>
              </td>
              <td>
                <span v-html="item.eco"></span>
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
  name: 'openings',
  watch: {
    '$route': function () {
      this.triggerSearch()
    }
  },
  components: {
    TablePager
  },
  mounted () {
    this.triggerSearch()
  },
  methods: {
    inputTrigger () {
      if (this.interval) clearInterval(this.interval)
      this.interval = setTimeout(() => {
        this.$router.push({ path: 'openings', query: { q: this.pager.query } })
      }, 1500)
    },
    clear () {
      this.pager.query = ''
      this.submit()
    },
    triggerSearch () {
      if (this.$route.query.q) {
        this.pager.query = this.$route.query.q
      }
      if (this.$route.query.offset) {
        this.pager.offset = parseInt(this.$route.query.offset)
      }
      this.$nextTick(() => this.$refs.input.focus())
      this.search()
    },
    search () {
      axios.post('/eco/search', this.pager).then((res) => {
        this.data = res.data
        let t = this.$root.t
        var pages = []
        if (res.data.error) {
          if (res.data.error === 'not_enough_params') {
            snackbar('info', 'Ingresá una palabra clave para ver aperturas. Podés buscar por nombre o PGN.', 15000)
          }
        } else {
          if (res.data.count === 0) {
            snackbar('danger', 'No hay aperturas que coincidan con tu palabra clave.', 5000)
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
    submit () {
      this.$router.push('/openings?q=' + this.pager.query.trim())
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
      }
    }
  }
}
</script>
