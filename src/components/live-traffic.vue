<template>
  <div class="traffic-info-wrapper">
    <div class="title-section">Live traffic information</div>
    <div class="traffic-info" v-if="!loading">
      <div class="info">
        <div class="label">Total Flights</div>
        <div class="value">{{ CountFlight || '-' }}</div>
      </div>
      <div class="info">
        <div class="label">Total Airlines</div>
        <div class="value">{{ CountAirline || '-' }}</div>
      </div>
      <div class="info">
        <div class="label">Higher Flight Speed</div>
        <div class="value">{{ maxSpeed.toFixed(0) }} km/h</div>
      </div>
    </div>
    <loading-placeholder-stat v-else />
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import { types } from '@/interfaces/serverProtocol';
import { streamWS } from '@/libs/endpoints';
import DashboardWidget from '@/libs/classes/dashboardwidget';
import LoadingPlaceholderStat from '@/components/loading-placeholder-stat.vue';
import { store } from '@/store';

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
    store.dispatch('attachWebSocket', { url }).then((socket) => {
      store.dispatch(types.startTotal);
      socket.subscribe((event: any) => {
        const { eventType, eventPayload: { eventCount } } = event;
        this.loading = false;
        switch (eventType) {
          case 'TotalAirlinesCount':
            this.CountAirline = eventCount;
            break;
          case 'TotalFlightsCount':
            this.CountFlight = eventCount;
            break;
          default:
            return;
        }
      });
    });
  }

  private mounted() {
    this.listen(streamWS('dvs'));
  }
}
</script>

<style lang="scss" scoped src="@/styles/components/live-traffic.scss" />
