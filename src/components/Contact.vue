<template>
  <div class="container is-widescreen">
    <section class="content column fadeIn">
      <h3 class="title">
        <span class="icon">
          <span class="fa fa-envelope"></span>
        </span> 
        <span>Contact</span>
      </h3>
      <h2>Drop me an email</h2>
      <p>Life's simple. If you want to keep in touch just drop me a line.</p>
      <p><a href="mailto:overlemonsoft@gmail.com?Subject=Contact from Biltz" class="button is-success is-rounded">Contact Biltz's author</a></p>      
    </section>
  </div>
</template>

<script>
export default {
  name: 'contact',
  data () {
    return {
      msg: ''
    }
  }
}
</script>
