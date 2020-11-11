<template>
  <div class="container is-widescreen landing">
    <div class="area has-text-centered preservefilter">
      <div class="columns is-vcentered fadeIn">
        <div class="column is-hidden-mobile"></div>
        <div class="column is-8 has-text-centered">
          <div class="has-text-centered">
            <form id="search" class="has-text-centered preservefilter" @submit.prevent="submit">
              <div class="field has-addons is-hidden-mobile is-flex-centered">
                <div class="control">
                  <input v-model="query" class="input is-large is-white is-rounded" name="query" type="text" :placeholder="'search_in_groups' | t" autofocus>
                </div>
                <div class="control">
                  <button type="submit" id="searchbtn" class="button is-large is-rounded is-white">
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
            <div class="content columns is-multiline has-text-centered">
              <div v-for="(item, index) in groups" :key="index" class="column is-6-tablet is-4-desktop">
                <router-link :to="`/group/${item._id}`">
                  <article class="box preservefilter">
                    <h2>
                      <span>{{ item.code }}</span>
                      <span class="has-text-grey">{{ item.users }}</span>
                    </h2>
                    <p class="subtitle has-text-weight-bold">
                      <span class="icon">
                        <span class="mdi mdi-clock-fast"></span>
                      </span>
                      <span>{{ item.minutes }}</span>
                      <span>+</span>
                      <span>{{ item.compensation }}</span>
                    </p>
                  </article>
                </router-link>
              </div>
            </div>
            <div class="columns is-vcentered has-text-centered is-hidden-mobile">
              <div class="column has-text-right">
                <a @click="$root.play" class="button is-rounded is-large is-success">
                  <span class="icon">
                    <span class="fa fa-handshake is-size-5"></span>
                  </span>
                  <!--span class="is-hidden-touch">{{ 'play_against' | t }}</span-->
                  <span>{{ 'human' | t }}</span>
                </a>
              </div>
              <div class="column has-text-left">
                <router-link class="button is-rounded is-info is-large" to="/stockfish">
                  <span class="icon">
                    <span class="fa fa-server is-size-5"></span>
                  </span>
                  <!--span class="is-hidden-touch">{{ 'play_against' | t }}&nbsp;</span-->
                  <span>Stockfish</span>
                </router-link>
              </div>
            </div>
            <div class="columns is-vcentered has-text-centered is-hidden-tablet">
              <div class="column">
                <a @click="$root.play" class="button is-large is-rounded is-success">
                  <span class="icon">
                    <span class="fa fa-handshake is-size-5"></span>
                  </span>
                  <span>{{ 'human' | t }}</span>
                </a>
              </div>
              <div class="column">
                <router-link class="button is-large is-rounded is-info" to="/stockfish">
                  <span class="icon">
                    <span class="fa fa-server is-size-5"></span>
                  </span>
                  <span>Stockfish</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-hidden-mobile"></div>
      </div>
      <ul class="pieces is-hidden-mobile">
        <li class="black"></li>
        <li class="black"></li>
        <li class="black"></li>
        <li class="black"></li>
        <li class="black"></li>
        <li class="black"></li>
        <li class="white"></li>
        <li class="white"></li>
        <li class="white"></li>
        <li class="white"></li>
        <li class="white"></li>
        <li class="white"></li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
export default {
  name: 'landing',
  mounted () {
    const saved = JSON.parse(localStorage.getItem('player')) || {}
    axios.post('/group/random').then((res) => {
      this.$root.loading = false
      if (res.data.status === 'success') {
        this.groups = res.data.data
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
