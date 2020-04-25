<template>
  <div class="container">
    <section class="content column fadeIn">
      <h3 class="title">
        <span class="icon">
          <span class="fa fa-user-plus"></span>
        </span> 
        <span>{{ 'register' | t }}</span>
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
              <div class="control">
                <input v-model="data.password" class="input is-rounded" minlength="6" type="password" :placeholder="'password' | t" required>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <label class="checkbox">
                  <input type="checkbox" v-model="acceptTerms"> <span v-html="$root.translate('accept_terms')"></span>
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
                <router-link to="/login">{{ 'login' | t }}</router-link>
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
  name: 'register',
  data () {
    return {
      acceptTerms: false,
      data: {}
    }
  },
  methods: {
    submit: function() {
      var t = this
      if(!t.acceptTerms)
        return snackbar('error',"Tenés que aceptar nuestros términos y condiciones para crear una cuenta") 
      t.$root.processing = true
      this.$store
        .dispatch("register", t.data)
        .then(res => {
          this.$router.push("/register-success")
        })
        .catch(err => console.log(err));
    }
  }
}
</script>
