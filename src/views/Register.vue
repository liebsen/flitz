<template>
  <div class="container">
    <section v-show="player.email" class="content column fadeIn">
      <h3 class="title">
        <span class="icon">
          <span class="mdi mdi-account"></span>
        </span>
        <span>{{ 'already_loggedin' | t }} {{ player.code }}</span>
      </h3>
    </section>
    <section v-show="!player.email" class="content column fadeIn">
      <div class="columns is-centered">
        <div class="column is-narrow">
          <form class="form has-text-centered slideIn has-margin-top" @submit.prevent="submit">
            <h3 class="title">
              <span class="icon">
                <span class="mdi mdi-account-plus"></span>
              </span>
              <span>{{ 'register' | t }}</span>
            </h3>
            <p>{{ 'register_text' | t }}</p>
            <div class="field">
              <div class="control">
                <input @input="checkUsername" v-model="data.code" class="input is-rounded" type="text" :placeholder="'username' | t" required autofocus>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <input v-model="data.email" class="input is-rounded" type="email" :placeholder="'email' | t" required autofocus>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <input v-model="data.password" class="input is-rounded" minlength="6" type="password" :placeholder="'password' | t" required>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <label class="checkbox">
                  <input type="checkbox" v-model="acceptTerms"> <span v-html="$root.t('accept_terms')"></span>
                </label>
              </div>
            </div>
            <div class="field">
              <div class="control has-text-centered">
                <button type="submit" class="button  is-rounded is-link" :class="{'is-loading' : $root.processing}">{{ 'register' | t }}</button>
              </div>
            </div>
            <hr>
            <div class="field">
              <div class="control">
                <router-link to="/login" class="button is-text">
                  {{ 'login' | t }}
                </router-link>
                <router-link to="/forgot-password" class="button is-text">
                  {{ 'forgot_password' | t }}
                </router-link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import snackbar from '@/components/Snackbar'
export default {
  name: 'register',
  data () {
    return {
      acceptTerms: false,
      data: {}
    }
  },
  created () {
    this.data = this.player
    this.$root.loading = false
  },
  computed: {
    ...mapState([
      'player'
    ])
  },
  methods: {
    checkUsername ({ type, target }) {
      if (target.value.match(/^[a-zA-Z0-9]+$/) === null) {
        snackbar('error', this.$root.t('username_regex'))
        this.data.code = this.data.code.replace(/[\W_]+/g, ' ')
      }
    },
    submit: function () {
      if (!this.acceptTerms) {
        return snackbar('error', 'Tenés que aceptar nuestros términos y condiciones para crear una cuenta')
      }
      this.$root.processing = true
      axios.post('/register', this.data).then(res => {
        this.$store
          .dispatch('player', res.data)
          .then(res => {
            this.$root.processing = false
            this.$router.push('/register-success')
          })
          .catch(err => console.log(err))
      })
    }
  }
}
</script>
