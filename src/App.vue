<template>
  <div :key="$root.appKey">
    <div v-show="$root.loading" class="spinner-background">
      <svg class="spinner-container" viewBox="0 0 44 44">
        <circle class="path" cx="22" cy="22" r="20" fill="none" stroke-width="4"></circle>
      </svg>
    </div>
    <div class="menu" :class="{ 'fs': menuState }">
      <div class="menu-container is-flex columns is-vcentered">
        <div class="column menu-logo has-text-left preservefilter">
          <router-link to="/">
            <img src="/img/logo.png" alt="Flitz">
          </router-link>
        </div>
        <div class="column menu-primary has-text-right preservefilter">
          <div v-if="Object.keys(player).length">
            <div class="is-hidden-mobile">
              <div class="buttons levels has-addons is-pulled-right">
                <router-link to="/settings" class="button is-rounded is-grey" :title="'set_your_settings' | t">
                  <span class="icon">
                    <span>{{ player.flag }}</span>
                  </span>
                  <span class="has-text-weight-bold">{{ player.code }}</span>
                </router-link>
                <a @click="$root.play" class="button is-rounded is-success" :class="{ 'is-loading': $root.isFindingOpponent }" :title="'search_opponent' | t">
                  <span class="icon has-text-white">
                    <span class="fa fa-handshake"></span>
                  </span>
                </a>
              </div>
            </div>
            <div class="is-hidden-tablet">
              <div class="buttons levels has-addons is-pulled-right">
                <router-link to="/settings" class="button is-small is-rounded" :title="'set_your_settings' | t">
                  <span class="icon">
                    <span>{{ player.flag }}</span>
                  </span>
                  <span>{{ player.code }}</span>
                </router-link>
                <a @click="$root.play" class="button is-small is-success is-rounded" :class="{ 'is-loading': $root.isFindingOpponent }" :title="'search_opponent' | t">
                  <span class="icon has-text-white">
                    <span class="fa fa-handshake"></span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div @click="toggleMenu" class="menu-burger" :class="{ 'cross': menuState }" :title="'mainmenu' | t">
          <svg viewBox="0 0 800 600">
            <path d="M300,220 C300,220 520,220 540,220 C740,220 640,540 520,420 C440,340 300,200 300,200" id="top"></path>
            <path d="M300,320 L540,320" id="middle"></path>
            <path d="M300,210 C300,210 520,210 540,210 C740,210 640,530 520,410 C440,330 300,190 300,190" id="bottom" transform="translate(480, 320) scale(1, -1) translate(-480, -318)"></path>
          </svg>
        </div>
      </div>
      <div class="menu-bg"></div>
      <div class="menu-items">
        <div>
          <router-link class="has-text-centered preservefilter" to="/">
            <img src="/img/logo.png">
          </router-link>
          <div class="menu-links has-text-left preservefilter">
            <router-link v-for="(item, index) in menu" :key="index" :to="`/${item.to}`">
              <span class="icon">
                <span class="mdi" :class="item.mdi"></span>
              </span>
              <span class="has-text-weight-bold">{{ item.to | t }}</span>
            </router-link>
          </div>
          <div class="column">
            <div class="has-text-centered preservefilter">
              <a v-show="player.email" @click="$root.createGroup" class="button is-rounded is-white is-outlined" :class="{ 'is-loading': $root.isCreatingGroup }">
                <span class="icon">
                  <span class="mdi mdi-layers-plus"></span>
                </span>
                <span class="has-text-weight-bold">{{ 'create_group' | t }}</span>
              </a>
              <div v-show="!player.email">
                <div class="columns">
                  <div class="column">
                    <router-link to="/login" class="button is-rounded is-white is-outlined">
                      <span class="icon">
                        <span class="mdi mdi-account-key"></span>
                      </span>
                      <span class="has-text-weight-bold">{{ 'login' | t }}</span>
                    </router-link>
                  </div>
                  <div class="column">
                    <router-link to="/register" class="button is-rounded is-white is-outlined">
                      <span class="icon">
                        <span class="mdi mdi-account-plus"></span>
                      </span>
                      <span class="has-text-weight-bold">{{ 'register' | t }}</span>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <keep-alive include="lobby">
      <router-view :key="$route.fullPath" />
    </keep-alive>
    <div class="tosprompt preservefilter"></div>
    <div class="ui-snackbar ui-snackbar--is-inactive preservefilter" :class="{ 'is-strong' : player.strongnotification }">
      <p class="ui-snackbar__message"></p>
    </div>
    <div class="footprint">
      <span v-show="idle" class="is-size-7 has-text-grey has-text-weight-bold">
        {{ 'idle_now' | t }} <span class="has-text-success">{{ idle }}</span>
      </span>
      <span v-show="playing > 1" class="is-size-7 has-text-grey has-text-weight-bold">
        {{ 'playing_now' | t }} <span class="has-text-success">{{ playing }}</span>
      </span>
      <span v-show="latency" class="is-size-7 has-text-grey has-text-weight-bold">
        {{ 'latency' | t }} <span :class="{ 'has-text-danger': latency > 500, 'has-text-success': latency < 100 }">{{ latency }}ms</span>
      </span>
      <span v-show="!latency" class="is-size-7 has-text-grey">...</span>
      <span class="is-size-7 has-text-grey has-text-weight-bold">
        | {{ 'powered_by' | t }} Stockfish
      </span>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
export default {
  name: 'app',
  data () {
    return {
      idle: 0,
      playing: 0,
      latency: 0,
      menu: [{
        to: 'groups',
        mdi: 'mdi-layers'
      }, {
        to: 'live',
        mdi: 'mdi-fire'
      }, {
        to: 'results',
        mdi: 'mdi-view-list'
      }, {
        to: 'openings',
        mdi: 'mdi-book'
      }, {
        to: 'about',
        mdi: 'mdi-information'
      }, {
        to: 'donate',
        mdi: 'mdi-human-handsup'
      }, {
        to: 'contact',
        mdi: 'mdi-email'
      }]
    }
  },
  computed: {
    year () {
      return moment().format('YYYY')
    },
    ...mapState([
      'menuState',
      'player',
      'games'
    ])
  },
  mounted () {
    this.$socket.emit('playing')
  },
  sockets: {
    pong (ms) {
      this.latency = ms
    },
    playing (data) {
      this.idle = data.idle
      this.playing = data.playing
    }
  },
  methods: {
    toggleMenu () {
      this.$store.commit('togglemenu')
    }
  }
}
</script>
