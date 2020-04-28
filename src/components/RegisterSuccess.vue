<template>
  <div class="container">
    <section class="content column fadeIn">
      <h3 class="title">
        <span class="icon">
          <span class="mdi mdi-tick"></span>
        </span>
        <span>{{ 'register_success' | t }}</span>
      </h3>
      <p>{{ 'register_success_text' | t }}</p>
      <p><router-link to="/login" class="button is-success is-rounded">{{ 'login' | t }}</router-link></p>
    </section>
  </div>
</template>

<script>
export default {
  name: 'register_success'
}
</script>
