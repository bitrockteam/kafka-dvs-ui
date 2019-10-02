<template>
  <div class="traffic-info-wrapper">
    <div class="title-section">Live traffic information</div>
    <div class="traffic-info" v-if="!loading">
      <div class="info">
        <div class="label">Total Flights</div>
        <div class="value">{{ CountFlight }}</div>
      </div>
      <div class="info">
        <div class="label">Total Airlines</div>
        <div class="value">{{ CountAirline }}</div>
      </div>
      <div class="info">
        <div class="label">Higher Flight Speed</div>
        <div class="value">{{ maxSpeed }} km/h</div>
      </div>
    </div>
    <loading-placeholder-stat v-else />
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { webSocket } from 'rxjs/webSocket';
import { Getter } from 'vuex-class';
import { streamWS } from '@/libs/endpoints';
import DashboardWidget from '@/libs/classes/dashboardwidget';
import LoadingPlaceholderStat from '@/components/loading-placeholder-stat.vue';

@Component({
  name: 'live-traffic',
  components: {
    LoadingPlaceholderStat,
  },
})
export default class extends DashboardWidget {
  @Getter private maxSpeed!: number;
  private CountAirline: number = 0;
  private CountFlight: number = 0;
  private loading: boolean = true;

  private listen(url: string) {
    this.socket = webSocket(url);

    this.socket.subscribe((event: any) => {
      const { eventType, eventPayload: { eventCount } } = event;
      this.loading = false;
      switch (eventType) {
        case 'CountAirline':
          this.CountAirline = eventCount;
          break;
        case 'CountFlight':
          this.CountFlight = eventCount;
          break;
        default:
          return;
      }
    });
  }

  private mounted() {
    this.listen(streamWS('totalElementsChanged'));
  }
}
</script>

<style lang="scss" scoped src="@/styles/components/live-traffic.scss" />
