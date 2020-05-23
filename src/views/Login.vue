<template>
  <div class="container">
    <section class="content column fadeIn">
      <div class="columns is-centered">
        <div class="column is-narrow">
          <form class="form has-text-centered slideIn has-margin-top" @submit.prevent="submit">
            <h3 class="title">
              <span class="icon">
                <span class="mdi mdi-account-key"></span>
              </span>
              <span>{{ 'login' | t }}</span>
            </h3>
            <p>{{ 'login_text' | t }}</p>
            <div class="field">
              <div class="control">
                <input v-model="data.email_or_username" class="input is-rounded" type="email" :placeholder="'email_or_username' | t" required autofocus>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <input v-model="data.password" class="input is-rounded" minlength="6" type="password" :placeholder="'password' | t" required>
              </div>
            </div>
            <div class="field">
              <div class="control has-text-centered">
                <button type="submit" class="button  is-rounded is-link" :class="{'is-loading' : $root.processing}">{{ 'login' | t }}</button>
              </div>
            </div>
            <hr>
            <div class="field">
              <div class="control">
                <router-link to="/forgot-password" class="button is-text">{{ 'forgot_password' | t }}</router-link>
                <router-link to="/register" class="button is-text">{{ 'register' | t }}</router-link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'login',
  data () {
    return {
      data: {}
    }
  },
  created () {
    this.data.email = this.player.email || this.player.code
    this.$root.loading = false
  },
  computed: {
    ...mapState([
      'player'
    ])
  },
  methods: {
    submit: function () {
      this.$root.processing = true
      this.$store
        .dispatch('login', this.data)
        .then(res => {
          this.$router.push('/dash')
        })
        .catch(err => console.log(err))
    }
  }
}
</script>
