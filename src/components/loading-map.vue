
<template>
<div class="loading-map">
<svg>
  <g>
    <path d="M 50,100 A 1,1 0 0 1 50,0"/>
  </g>
  <g>
    <path d="M 50,75 A 1,1 0 0 0 50,-25"/>
  </g>
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#1890ff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#69c0ff;stop-opacity:1" />
    </linearGradient>
  </defs>
</svg>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component({
  name: 'loading-map',
})
export default class extends Vue {
}
</script>

<style lang="scss" scoped src="@/styles/components/loading-map.scss">
