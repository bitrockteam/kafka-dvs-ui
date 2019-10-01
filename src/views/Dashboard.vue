<template>
  <div class="dashboard">
    <button-pause />
    <world-map />
    <footer-stats />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ButtonPause from '@/components/button-pause.vue';
import WorldMap from '@/components/world-map.vue';
import FooterStats from '@/components/footer-stats.vue';

@Component({
  components: {
    ButtonPause,
    WorldMap,
    FooterStats,
  },
})
export default class Dashboard extends Vue {
}
</script>
<style lang="scss" src="@/styles/dashboard.scss" />
