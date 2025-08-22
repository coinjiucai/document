<template>
  <section class="app-main flex-layout full-block justify-start">
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {}
}
</script>
