<template>
  <i class="icon-expand">
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
    <path opacity=".87" fill="none" d="M24 24H0V0h24v24z"/>
    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"/></svg>
  </i>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component({
  name: 'icon-expand-more',
})
export default class extends Vue {
}
</script>

<style lang="scss" scoped src="@/styles/components/icon.scss">
