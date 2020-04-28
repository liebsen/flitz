<template>
  <div class="container">
    <section class="content column fadeIn">
      <h3 class="title">
        <span class="icon">
          <span class="mdi mdi-question"></span>
        </span>
        <span>{{ 'forgot_password' | t }}</span>
      </h3>
      <div class="columns is-centered">
        <div class="column is-narrow">
          <form class="form has-text-centered slideIn has-margin-top" @submit.prevent="submit">
            <p>{{ 'register_text' | t }}</p>
            <div class="field">
              <div class="control">
                <input v-model="data.email" class="input is-rounded" type="email" :placeholder="'email' | t" required autofocus>
              </div>
            </div>
            <div class="field">
              <div class="control has-text-centered">
                <button type="submit" class="button  is-rounded is-link" :class="{'is-loading' : $root.processing}">{{ 'recover_password' | t }}</button>
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
  name: 'forgot-password',
  data () {
    return {
      acceptTerms: false,
      data: {}
    }
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
