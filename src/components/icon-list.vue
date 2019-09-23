<template>
  <i class="icon-list">
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
   <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
   <path d="M0 0h24v24H0z" fill="none"/></svg></i>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component({
  name: 'icon-list',
})
export default class extends Vue {
}
</script>

<style lang="scss" scoped src="@/styles/components/icon.scss">
