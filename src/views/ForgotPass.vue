<template>
  <div class="container">
    <section class="content column fadeIn">
      <h3 class="title">
        <span class="icon">
          <span class="mdi mdi-account-key"></span>
        </span>
        <span>{{ 'forgot_password' | t }}</span>
      </h3>
      <div class="columns is-centered">
        <div class="column is-narrow">
          <form class="form has-text-centered slideIn has-margin-top" @submit.prevent="submit">
            <p>{{ 'forgot_text' | t }}</p>
            <div class="field">
              <div class="control">
                <input v-model="data.email_or_username" class="input is-rounded" type="text" :placeholder="'email_or_username' | t" required autofocus>
              </div>
            </div>
            <div class="field">
              <div class="control has-text-centered">
                <button type="submit" class="button  is-rounded is-link" :class="{'is-loading' : $root.processing}">{{ 'recover_password' | t }}</button>
              </div>
            </div>
            <hr>
            <div class="field">
              <div class="control">
                <router-link to="/login" class="button is-text">{{ 'login' | t }}</router-link>
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
  name: 'forgot-password',
  data () {
    return {
      acceptTerms: false,
      data: {}
    }
  },
  created () {
    this.data.email_or_username = this.player.code
  },
  computed: {
    ...mapState([
      'player'
    ])
  },
  methods: {
    submit: function () {
      var t = this
      t.$root.processing = true
      this.$store
        .dispatch('register', t.data)
        .then(res => {
          this.$router.push('/register-success')
        })
        .catch(err => console.log(err))
    }
  }
}
</script>
