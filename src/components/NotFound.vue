<template>
  <section class="hero fadeIn">
    <div class="hero-body">
      <div class="container is-flex-column is-vertical">
        <h1 class="title">
          <span class="icon is-margin-right">
            <span class="mdi mdi-robot"></span>
          </span>
          <span>{{ 'resource_not_found' | t }}</span>
        </h1>
        <p>{{ 'resource_not_found_text' | t }}</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>
