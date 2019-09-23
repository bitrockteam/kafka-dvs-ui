<template>
  <div>
    <span class="title-progress">{{ titlesection }}</span> 
    <amber-progress-bar 
      v-for="(country, index) in data"
      :key="index"
      :label="country.name"
      :value="country.percent"
      :display="country.count"
      format=""
    ></amber-progress-bar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import '@amber-ds/components/progress-bar';

@Component({
  name: 'list-rsvp-cities',
  computed: {
    data() {
      return this.$attrs.data || [];
    },
  },
})
export default class extends Vue {
  private titlesection = 'Cities';
}
</script>

<style lang="scss" scoped>
@import './../styles/styles.scss';

.title-progress {
  display: block;
  color: $primary-text-color;
  font-weight: 550;
}
</style>

