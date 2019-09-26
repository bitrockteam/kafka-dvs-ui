<template>
  <div id="app">
    <header class="header">
      <div class="navbar-brand">
        <div class="logo">
          <span class="icon-logo"><icon-logo /></span>
          <router-link class="link-geo" to="/" >
            <span class="geo-k">K</span>
            <span class="geo-stream">FLIGHTSTREAM</span>
          </router-link>
        </div>
        <div class="powered"><icon-bitrock/></div>
      </div>
    </header>
    <router-view />
    <amber-banner
      title="A new version is available!"
      labels="Refresh"
      :active="update"
      @confirm="refresh"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import IconLogo from '@/components/icon-logo.vue';
import IconBitrock from '@/components/icon-bitrock.vue';
import IconWorld from '@/components/icon-world.vue';
import '@amber-ds/components/banner';

@Component({
  name: 'kakfa-flightstream',
  components: {
    IconLogo,
    IconBitrock,
    IconWorld,
  },
})
export default class extends Vue {
  private update: boolean = false;

  private mounted() {
    window.addEventListener('KGSUpdateAvailable', () => this.update = true);
  }

  private refresh() {
    window.location.reload();
  }
}
</script>

<style lang="scss" src="@/styles/app-stream.scss" />
