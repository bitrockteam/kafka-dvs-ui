<template>
  <div class="ksql">
    <h6>{{ title }}</h6>
    <span>{{ text }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component({
  name: 'ksql-query-text',
  computed: {
    title(): string { return this.$attrs.title || ''; },
    text(): string { return this.$attrs.text || ''; },
  },
})
export default class KsqlQueryText extends Vue {}
</script>

<style lang="scss" scoped>
@import './../styles/styles.scss';

.ksql {
  padding-bottom: $padding;
  word-break: break-word; 

  @media #{$medium-devices} {
    padding-bottom: 0;
  }
 
  h6 {
    padding: 8px 0;
    margin:0;
    &:first-of-type {
      padding: 0 0 8px 0 ;
    }
  }
  span {
    font-size: 12px;
    display: flex;
    line-height: 18px;
    color: $primary-text-color;
    font-family: Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;
  }
}

@supports (-moz-appearance:none) {
  .ksql{
    word-break: break-all; 
  }   
}

.ksql {
  font-size: 12px;
  display: block;
  padding: $padding;
  height: 100%;
  line-height: 20px;
  word-break: break-word;

  span {
    display: block;
  }
}
</style>