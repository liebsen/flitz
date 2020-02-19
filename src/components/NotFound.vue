<template>
  <section class="hero fadeIn">
    <div class="hero-body">
      <div class="container is-flex-column is-vertical">
        <h1 class="title">
          <span class="icon">
            <span class="fa fa-chess-queen"></span>
          </span> 
          <span>it seems this game does not exists...</span>
        </h1>
        <p jsb-word="not-found-text">If you think this could be an error please contact</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'NotFound',
  data () {
    return {
      msg: ''
    }
  }
}
</script>
