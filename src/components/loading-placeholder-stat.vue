<template>
<div class="box-placeholder">
 <div class="placeholder-line-wrapper">
   <div class='placeholder-line-wrapper-context'>
      <div class='placeholder-line-wrapper-subtitle'></div>
      <div class='placeholder-line-wrapper-text'></div>
      <hr>
    </div>
  </div>
  <div class="placeholder-line-wrapper">
   <div class='placeholder-line-wrapper-context'>
      <div class='placeholder-line-wrapper-subtitle'></div>
      <div class='placeholder-line-wrapper-text'></div>
      <hr>
    </div>
  </div>
  <div class="placeholder-line-wrapper">
   <div class='placeholder-line-wrapper-context'>
      <div class='placeholder-line-wrapper-subtitle'></div>
      <div class='placeholder-line-wrapper-text'></div>
      <hr>
    </div>
  </div>
  <div class="placeholder-line-wrapper">
   <div class='placeholder-line-wrapper-context'>
      <div class='placeholder-line-wrapper-subtitle'></div>
      <div class='placeholder-line-wrapper-text'></div>
      <hr>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component({
  name: 'loading-placeholder-stat',
})
export default class extends Vue {
}
</script>

<style lang="scss" scoped src="@/styles/components/loading-placeholder-stat.scss" />
