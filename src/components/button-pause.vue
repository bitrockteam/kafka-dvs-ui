<template>
   <div class="btn-container">
      <amber-button 
        nooutline
        priority="tertiary" 
        class="btn"
        @click="togglePause"
      >
        <icon-pause v-if="!paused" />
        <icon-play v-else />
      </amber-button>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
import IconPause from '@/components/icon-pause.vue';
import IconPlay from '@/components/icon-play.vue';
import '@amber-ds/components/button';

@Component({
  name: 'button-pause',
  components: {
    IconPause,
    IconPlay,
 },
})
export default class extends Vue {
  @State private paused!: boolean;

  @Mutation private togglePause!: () => void;
}
</script>

<style lang="scss" scoped src="@/styles/components/button-pause.scss">