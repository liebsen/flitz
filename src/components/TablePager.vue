<template>
  <nav v-if="dataSet.pages" class="pagination is-centered is-rounded" role="navigation" aria-label="pagination">
    <ul class="pagination-list">
      <li v-for="(page, index) in dataSet.pages" :key="index">
        <router-link :to="'?q=' + dataSet.query + '&offset=' + page" class="pagination-link" :class="{'is-current': dataSet.offset == page}" :title="'Ir a página ' + parseInt(page / dataSet.limit + 1)"></router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'TablePager',
  props: {
    dataSet: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
