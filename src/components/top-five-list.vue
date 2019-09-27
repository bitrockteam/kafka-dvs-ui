<template>
  <div class="top-five-list">
    <div class="title-section">{{ titleSection }}</div>
    <div v-if="data.length">
      <amber-progress-bar
              v-for="(item, index) in data"
              :key="index"
              :label="item.name"
              :value="item.percent"
              :display="item.count"
              :format="item.format || ''"
      />
    </div>
    <loading-placeholder-stat v-else />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LoadingPlaceholderStat from '@/components/loading-placeholder-stat.vue';
import '@amber-ds/components/progress-bar';

@Component({
  name: 'top-five-list',
  components: {
    LoadingPlaceholderStat,
  },
  props: ['titleSection', 'loading'],
  computed: {
    data() {
      return this.$attrs.data || [];
    },
  },
})
export default class extends Vue {
}
</script>

<style lang="scss" scoped src="@/styles/components/top-five-list.scss" />
