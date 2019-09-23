<template>
  <div id="app">
   <!-- UNDER COSTRUCTION -->
    <div class="under-costruction">

      <div class="text-costruction">
        <div >
          <icon-world class="img-cost"/>
        </div> 
        <div class="text-cost">
          <h1>UNDER COSTRUCTION</h1>
          <p>
          This page is currently undergoing schedulate maintenance. <br/>
          We should be back shortly. 
          Thank you for your patience.
          </p>
        </div>
      </div>
    </div>
   <!--  END UNDER COSTRUCTION -->

    <header class="header">
      <div class="navbar-brand">
        <div class="logo">
          <span class="icon-logo"><icon-logo /></span>
          <router-link class="link-geo" to="/" >
            <span class="geo-k">K</span>
            <span class="geo-stream">GEOSTREAM</span>
          </router-link>
        </div>
        <div class="powered"><icon-bitrock/></div>
      </div>
      <nav>
        <!-- <router-link to="/" class="link">Dashboard</router-link> -->
        <router-link class="link" to="/development" exact>Development</router-link>
      </nav>
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
  name: 'kakfa-geostream',
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
