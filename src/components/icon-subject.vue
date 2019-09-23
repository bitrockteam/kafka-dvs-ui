<template>
  <i class="icon-subject">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z"/>
    <path d="M0 0h24v24H0z" fill="none"/></svg>
  </i>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component({
  name: 'icon-subject',
})
export default class extends Vue {
}
</script>

<style lang="scss" scoped src="@/styles/components/icon.scss">
