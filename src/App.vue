<template>
  <div id="app">
    <header class="header">
      <div class="navbar-brand">
        <div class="logo">
          <span class="icon-logo"><icon-logo /></span>
          <span class="geo-k">DATA VISUALIZATION STREAMING</span>
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
import '@amber-ds/components/banner';

@Component({
  name: 'kafka-dvs',
  components: {
    IconLogo,
    IconBitrock,
  },
})
export default class extends Vue {
  private update: boolean = false;

  private mounted() {
    window.addEventListener('DVSUpdateAvailable', () => this.update = true);
  }

  private refresh() {
    window.location.reload();
  }
}
</script>

<style lang="scss" src="@/styles/app-stream.scss" />
