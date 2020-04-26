<template>
  <div class="container">
    <section class="content column fadeIn">
      <h3 class="title">
        <span class="icon">
          <span class="fa fa-hands"></span>
        </span>
        <span>{{ 'donate' | t }}</span>
      </h3>
      <p>{{ 'donate_text' | t }}</p>
      <p><a href="https://www.paypal.me/overlemon" target="_blank" class="button is-success is-rounded">{{ 'make_donation' | t }}</a></p>
    </section>
  </div>
</template>

<script>
export default {
  name: 'donate'
}
</script>
