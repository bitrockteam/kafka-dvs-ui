<template>
  <i class="icon-pause">
    <svg xmlns="http://www.w3.org/2000/svg" 
    width="24" height="24" viewBox="0 0 24 24">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
    <path d="M0 0h24v24H0z" fill="none"/></svg>
  </i>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component({
  name: 'icon-pause',
})
export default class extends Vue {
}
</script>

<style lang="scss" scoped src="@/styles/components/icon.scss">
