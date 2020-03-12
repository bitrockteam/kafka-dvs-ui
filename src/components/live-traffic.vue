<template>
  <div class="traffic-info-wrapper">
    <div class="title-section">Live traffic information</div>
    <div class="traffic-info" v-if="!loading">
      <div class="info">
        <div class="line-row">
          <div class="label">Total Flights</div>
          <div class="label">Flights on screen </div>
        </div>
        <div class="line-row">
          <div class="value">{{ CountFlight || '-' }}</div>
          <div class="value">{{ BoxedCountFlight || '0' }}</div>
        </div>
      </div>
      <div class="info">
        <div class="line-row">
          <div class="label">Total Airlines</div>
          <div class="label">Airlines on screen</div>
        </div>
        <div class="line-row">
          <div class="value">{{ CountAirline || '-' }}</div>
          <div class="value">{{ BoxedCountAirline || '0' }}</div>
        </div>
      </div>
      <div class="info">
        <div class="line-row">
          <div class="label">Overall Top Speed</div>
          <div class="label">Current Top Speed</div>
        </div>
        <div class="line-row">
          <div class="value">{{ maxSpeed.toFixed(0) }} km/h</div>
          <div class="value" style="cursor: pointer;" @click="selectTopSpeed(BoxedMaxSpeed, BoxedMaxSpeedFlightIcao)">{{ BoxedMaxSpeed ? BoxedMaxSpeed.toFixed(0) + ' km/h' : '-' }}</div>
        </div>
      </div>
    </div>
    <loading-placeholder-stat v-else />
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import { types } from '@/interfaces/serverProtocol';
import { map, filter } from 'rxjs/operators';
import { streamWS } from '@/libs/endpoints';
import DashboardWidget from '@/libs/classes/dashboardwidget';
import LoadingPlaceholderStat from '@/components/loading-placeholder-stat.vue';
import { store } from '@/store';
import { Flight } from '../interfaces/flight';
import { WebSocketSubject } from 'rxjs/webSocket';
import MaxSpeedFlight from '@/libs/classes/max-speed-flight';


@Component({
  name: 'live-traffic',
  components: {
    LoadingPlaceholderStat,
  },
  methods: {
    selectTopSpeed(speed: number, icaoNumber?: string) {
      if (icaoNumber) {
        store.commit('toggleBoxedMaxSpeedFlightPopup', new MaxSpeedFlight(icaoNumber, speed));
      }
    },
  },
})
export default class extends DashboardWidget {
  @Getter
  private maxSpeed!: number;
  private CountAirline: number = 0;
  private CountFlight: number = 0;

  private BoxedMaxSpeed: number = NaN;
  private BoxedMaxSpeedFlightIcao?: string;
  private BoxedCountAirline: number = 0;
  private BoxedCountFlight: number = 0;

  private loading: boolean = true;

  private listen(url: string) {
    store.dispatch('attachWebSocket', { url }).then((socket: WebSocketSubject<unknown>) => {
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
          case 'FlightList':
            this.updateCounts(event.eventPayload.elements);
            break;
          default:
            return;
        }
      }, (error) => this.listen(url));
    });
  }

  private updateCounts(flights: Flight[]) {
    const airlines = new Set(flights.map((f: Flight) => f.airline.nameAirline));
    this.BoxedCountFlight = Object.keys(flights).length;
    this.BoxedCountAirline = airlines.size;
    if (flights.length !== 0) {
      const maxSpeedFlight = flights.reduce((max: Flight, f: Flight) => f.speed > max.speed ? f : max);
      this.BoxedMaxSpeed = Math.max(maxSpeedFlight.speed, 0);
      this.BoxedMaxSpeedFlightIcao = maxSpeedFlight.icaoNumber;
    } else {
      this.BoxedMaxSpeedFlightIcao = undefined;
      this.BoxedMaxSpeed = NaN;
    }
    this.loading = false;
  }

  private mounted() {
    this.listen(streamWS('dvs'));
  }
}
</script>

<style lang="scss" scoped src="@/styles/components/live-traffic.scss" />
