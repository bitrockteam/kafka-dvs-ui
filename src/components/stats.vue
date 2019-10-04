<template>
  <div class="stats-row">
    <live-traffic />
    <top-five-list :data="originAirport" titleSection="Origin Airport"/>
    <top-five-list :data="destinationAirport" titleSection="Destination Airport"/>
    <top-five-list :data="airlines" titleSection="Airlines"/>
    <top-five-list :data="fastestFlights" titleSection="Fast Flights"/>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { Mutation } from 'vuex-class';
import { webSocket } from 'rxjs/webSocket';
import TopFiveList from '@/components/top-five-list.vue';
const LiveTraffic = () => import('@/components/live-traffic.vue');
import DashboardWidget from '@/libs/classes/dashboardwidget';
import { streamWS } from '@/libs/endpoints';
import { StatData, Airline, Airport, SpeedFlight } from '@/interfaces/stats';

@Component({
  name: 'top-five',
  components: {
    TopFiveList,
    LiveTraffic,
  },
})
export default class extends DashboardWidget {
  private originAirport: StatData[] = [];
  private destinationAirport: StatData[] = [];
  private airlines: StatData[] = [];
  private fastestFlights: StatData[] = [];
  @Mutation private setMaxSpeed!: (speed: number) => void;

  private listen(url: string) {
    this.socket = webSocket(url);

    this.socket.subscribe((event: any) => {
      const { eventType } = event;

      switch (eventType) {
        case 'TopDepartureAirportList':
          this.originAirport = event.eventPayload.elements.map((airport: Airport): StatData => ({
            name: airport.airportCode,
            count: airport.eventCount,
            percent: (100 * airport.eventCount) / event.eventPayload.elements[0].eventCount,
          }));
          break;
        case 'TopArrivalAirportList':
          this.destinationAirport = event.eventPayload.elements.map((airport: Airport): StatData => ({
            name: airport.airportCode,
            count: airport.eventCount,
            percent: (100 * airport.eventCount) / event.eventPayload.elements[0].eventCount,
          }));
          break;
        case 'TopAirlineList':
          this.airlines = event.eventPayload.elements.map((airline: Airline): StatData => ({
            name: airline.airlineName,
            count: airline.eventCount,
            percent: (100 * airline.eventCount) / event.eventPayload.elements[0].eventCount,
          }));
          break;
        case 'TopSpeedList':
          const maxSpeed = event.eventPayload.elements[0].speed;
          this.setMaxSpeed(maxSpeed);
          this.fastestFlights = event.eventPayload.elements.map((speed: SpeedFlight): StatData => ({
            name: speed.flightCode,
            count: speed.speed.toFixed(0),
            percent: (100 * speed.speed) / maxSpeed,
            format: ' km/h',
          }));
          break;
        default:
          return;
      }
    });
  }

  private mounted() {
    this.listen(streamWS('topElementsChanged'));
  }
}
</script>

<style lang="scss" scoped src="@/styles/components/stats.scss" />
