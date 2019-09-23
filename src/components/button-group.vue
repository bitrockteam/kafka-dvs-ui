<template>
  <div class="button-group">
    <amber-button priority="primary">Button primary</amber-button>
    <amber-button priority="secondary">Button secondary</amber-button>
    <amber-button priority="tertiary">{{button}}</amber-button>
    <hr>
    <amber-button priority="secondary"><div class="text-button-icon"><icon-pause/>button</div></amber-button>
    <amber-button priority="primary"><div class="text-button-icon"><icon-pause/>button</div></amber-button>
    <amber-button priority="tertiary"><div class="text-button-icon"><icon-pause/>{{button}}</div></amber-button>
    <hr>

    <icon-pause/>
    <amber-button priority="primary"><icon-pause/></amber-button>
    <amber-button priority="secondary"><icon-pause/></amber-button>
    <amber-button priority="tertiary"><icon-pause/></amber-button>

    <icon-arrow-left/>
    <amber-button priority="primary"><icon-arrow-left/></amber-button>
    <amber-button priority="secondary"><icon-arrow-left/></amber-button>
    <amber-button priority="tertiary"><icon-arrow-left/></amber-button>
   </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import IconPause from '@/components/icon-pause.vue';
import IconArrowLeft from '@/components/icon-arrow-left.vue';

@Component({
  name: 'button-group',
  components: {
    IconPause,
    IconArrowLeft,
  },
})
export default class extends Vue {

 private button = 'button';
}
</script>

<style lang="scss" scoped src="@/styles/components/button-group.scss">
