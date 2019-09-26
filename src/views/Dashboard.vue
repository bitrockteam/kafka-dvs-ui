<template>
  <div>
    <button-pause />
    <div class="dashboard">
      <world-map />
      <main-stats />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ButtonPause from '@/components/button-pause.vue';
import WorldMap from '@/components/world-map.vue';
import MainStats from '@/components/main-stats.vue';

@Component({
  components: {
    ButtonPause,
    WorldMap,
    MainStats,
  },
})
export default class Dashboard extends Vue {
}
</script>
<style lang="scss" src="@/styles/dashboard.scss" />
