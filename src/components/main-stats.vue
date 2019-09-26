<template>
  <div v-bind:class="{ maximized: !maximized, 'dash-rsvp': true }">
    <div class="copyright">Copyright &copy; 2019 -
      <a href="https://bitrock.it/" rel="noopener" target=_blank>BITROCK S.R.L.</a>
    </div>
    <button class="toggle-button" aria-label="toggle map button" @click="toggleMaximize">
      <icon-expand-more />
    </button>
    <div v-show="!maximized">
      <container-rsvp>
        <div slot="dash-rsvp">
          <!-- GRID SYSTEM -->
          <div class="row grid-system">
            <div class="col-12 col-sm-12 col-md-12 col-lg-6">
              <div class="row">
                <div class="col-12 col-sm-12 col-md-6 col-lg-6"><live-traffic/></div>
              </div>
            </div>
            <top-five />
          </div>
        </div>
      </container-rsvp>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Getter, Mutation } from 'vuex-class';
import IconExpandMore from '@/components/icon-expand-more.vue';
import ContainerRsvp from '@/components/container-rsvp.vue';

const LiveTraffic = () => import('@/components/live-traffic.vue');
const TopFive = () => import('@/components/top-five.vue');

@Component({
  name: 'main-stats',
  components: {
    IconExpandMore,
    LiveTraffic,
    ContainerRsvp,
    TopFive,
  },
})
export default class extends Vue {
  @Getter private maximized!: boolean;

  @Mutation private toggleMaximize!: () => void;
}
</script>
<style lang="scss" src="@/styles/components/main-dev-rsvp.scss"/>
