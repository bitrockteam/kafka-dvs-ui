<template>
  <world-map :dev="dev" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'main-dashboard',
  components: {
    worldMap: () => import('@/components/world-map.vue'),
  },
  computed: {
    dev() { return this.$route.path === '/development'; },
  },
})
export default class extends Vue {
  private clientWidth = document.documentElement.clientWidth;
  get dev(): boolean { return this.$route.path === '/development'; }
}
</script>