<template>
  <div>
    <button-pause />
    <div class="dashboard"> 
      <main-dashboard />
      <main-rsvp />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ButtonPause from '@/components/button-pause.vue';
import MainDashboard from '@/components/main-dashboard.vue';
import MainRsvp from '@/components/main-rsvp.vue';

@Component({
  components: {
    ButtonPause,
    MainDashboard,
    MainRsvp,
  },
})
export default class Dashboard extends Vue {

  private mounted() {
    const demo: any = this.$route.query.demo;

    if (demo && parseInt(demo, 10)) {
      this.createTimer(parseInt(demo, 10));
    }
  }

  private createTimer(value: number) {
    const ms: number = 1000 * 60 * value;
    setInterval(() => window.location.reload(), ms);
  }
}
</script>
<style lang="scss" src="@/styles/dashboard.scss" />