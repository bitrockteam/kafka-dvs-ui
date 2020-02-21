<template>
  <div v-bind:class="{ 'slide-in': maximized, 'footer-stats': true }">
    <div class="copyright">Copyright &copy; 2019 - 2020
      <a href="https://bitrock.it/" rel="noopener" target=_blank>BITROCK S.R.L.</a>
    </div>
    <button class="toggle-button" aria-label="toggle map button" @click="toggleMaximize">
      <icon-expand-more />
    </button>
    <stats />
  </div>
</template>

<script lang="ts">
import { Getter, Mutation } from 'vuex-class';
import { Component, Vue } from 'vue-property-decorator';
import IconExpandMore from '@/components/icon-expand-more.vue';
const Stats = () => import('@/components/stats.vue');

@Component({
  name: 'footer-stats',
  components: {
    IconExpandMore,
    Stats,
  },
})
export default class extends Vue {
  @Getter private maximized!: boolean;
  @Mutation private toggleMaximize!: () => void;
}
</script>
<style lang="scss" src="@/styles/components/footer-stats.scss"/>
