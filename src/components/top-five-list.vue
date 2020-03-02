<template>
  <div class="top-five-list">
    <div class="title-section">{{ titleSection }}</div>
    <div v-if="data.length">
      <top-list-item 
              v-for="(item, index) in data"
              @select="pipeUp"
              :key="index"
              :name="item.name"
              :type="item.type"
              :percent="item.percent"
              :count="item.count"
              :format="item.format"
              :selectedItem="selectedItem"
      />
    </div>
    <loading-placeholder-stat v-else />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LoadingPlaceholderStat from '@/components/loading-placeholder-stat.vue';
import TopListItem from '@/components/top-list-item.vue';
import TopSelectedItem from '@/libs/classes/top-selected-item';

@Component({
  name: 'top-five-list',
  components: {
    TopListItem,
    LoadingPlaceholderStat,
  },
  props: {titleSection: String, selectedItem: TopSelectedItem},
  computed: {
    data() {
      return this.$attrs.data || [];
    },
  },
  methods: {
    pipeUp(topSelectedItem: TopSelectedItem) {
        this.$emit('select', topSelectedItem);
    },
  },
})
export default class extends Vue {
}
</script>

<style lang="scss" scoped src="@/styles/components/top-five-list.scss" />
