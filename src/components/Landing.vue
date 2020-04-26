<template>
  <div class="container is-widescreen landing">
    <div class="area has-text-centered preservefilter">
      <div class="columns is-vcentered fadeIn">
        <div class="column is-hidden-mobile"></div>
        <div class="column is-8 has-text-centered">
          <div class="content is-hidden-mobile">
            <h1 class="">{{ 'landing_title_mobile' | t }}</h1>
          </div>
          <div class="content is-hidden-tablet">
            <h2 class="">{{ 'landing_title_desktop' | t }}</h2>
          </div>
          <div class="has-text-centered">
            <form id="search" class="has-text-centered" @submit.prevent="submit">
              <div class="field has-addons is-hidden-mobile is-flex-centered">
                <div class="control">
                  <input v-model="query" class="input is-medium is-white is-rounded" name="query" type="text" :placeholder="'search_in_groups' | t" autofocus>
                </div>
                <div class="control">
                  <button type="submit" id="searchbtn" class="button is-medium is-rounded is-white">
                    <span class="icon has-text-info">
                      <span class="mdi mdi-layers-search"></span>
                    </span>
                  </button>
                </div>
              </div>
              <div class="field has-addons is-hidden-tablet is-flex-centered">
                <div class="control">
                  <input v-model="query" class="input is-rounded" name="query" type="text" :placeholder="'search_in_groups' | t" autofocus>
                </div>
                <div class="control">
                  <button type="submit" id="searchbtn" class="button is-rounded is-white">
                    <span class="icon has-text-info">
                      <span class="mdi mdi-layers-search"></span>
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div class="has-text-centered content">
            <div class="field">
              <h3>{{ 'play_against' | t }}</h3>
            </div>
          </div>
          <div class="columns is-vcentered has-text-centered is-hidden-mobile">
            <div class="column has-text-right">
              <a @click="$root.play" class="button is-rounded is-medium is-success">
                <span class="icon">
                  <span class="mdi mdi-handshake"></span>
                </span>
                <span>{{ 'human' | t }}</span>
              </a>
            </div>
            <div class="column has-text-left">
              <router-link class="button is-rounded is-medium is-info" to="/stockfish">
                <span class="icon">
                  <span class="mdi mdi-robot"></span>
                </span>
                <span>Stockfish</span>
              </router-link>
            </div>
          </div>
          <div class="columns is-vcentered has-text-centered is-hidden-tablet">
            <div class="column">
              <a @click="$root.play" class="button is-rounded is-success">
                <span class="icon">
                  <span class="mdi mdi-handshake"></span>
                </span>
                <span>{{ 'human' | t }}</span>
              </a>
            </div>
            <div class="column">
              <router-link class="button is-rounded is-info" to="/stockfish">
                <span class="icon">
                  <span class="mdi mdi-robot"></span>
                </span>
                <span>Stockfish</span>
              </router-link>
            </div>
          </div>
        </div>
        <div class="column is-hidden-mobile"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
export default {
  name: 'landing',
  mounted () {
    var t = this
    const saved = JSON.parse(localStorage.getItem('player'))
    const board = document.querySelector('.fakeboard')

    if (board) {
      board.classList = []
      board.classList.add('fakeboard')
      if (saved) {
        board.classList.add(saved.board || 'classic')
      }
    }

    axios.post('/group/random').then((res) => {
      if (res.data.status === 'success') {
        t.groups = res.data.data
      }
    })

    if (saved.pieces) {
      document.querySelectorAll('.pieces li').forEach(e => {
        let li = window.getComputedStyle(e)
        e.style.backgroundImage = li.getPropertyValue('background-image').replace('classic', saved.pieces)
      })
    }
  },
  computed: {
    ...mapState([
      'player'
    ])
  },
  methods: {
    submit () {
      this.$router.push('/groups?q=' + this.query)
    }
  },
  data () {
    return {
      query: '',
      groups: []
    }
  }
}
</script>
