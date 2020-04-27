<template>
  <div class="container">
    <section class="content column fadeIn">
      <h3 class="title">
        <span class="icon">
          <span class="fa fa-user-check"></span>
        </span>
        <span>{{ 'login' | t }}</span>
      </h3>
      <div class="columns is-centered">
        <div class="column is-narrow">
          <form class="form has-text-centered slideIn has-margin-top" @submit.prevent="submit">
            <p>{{ 'login_text' | t }}</p>
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
              <div class="control has-text-centered">
                <button type="submit" class="button  is-rounded is-link" :class="{'is-loading' : $root.processing}">{{ 'login' | t }}</button>
              </div>
            </div>
            <hr>
            <div class="field">
              <div class="control">
                <router-link to="/forgot-password">{{ 'forgot_password' | t }}</router-link>
                <router-link to="/register">{{ 'register' | t }}</router-link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      data: {}
    }
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
