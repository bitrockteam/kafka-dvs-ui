<template>
  <i class="icon-play">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  </i>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component({
  name: 'icon-play',
})
export default class extends Vue {
}
</script>

<style lang="scss" scoped src="@/styles/components/icon.scss">
