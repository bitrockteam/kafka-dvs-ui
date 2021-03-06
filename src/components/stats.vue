<template>
  <div class="stats-row">
    <live-traffic />
    <top-five-list :data="originAirport" :selectedItem="selectedItem" @select="selectItem" titleSection="Top 5 Departure Airports"/>
    <top-five-list :data="destinationAirport" :selectedItem="selectedItem" @select="selectItem" titleSection="Top 5 Destination Airports"/>
    <top-five-list :data="airlines" :selectedItem="selectedItem" @select="selectItem" titleSection="Top 5 Airlines"/>
    <top-five-list :data="fastestFlights" titleSection="Top 5 Fastest Flights"/>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { Mutation } from 'vuex-class';
import TopFiveList from '@/components/top-five-list.vue';
const LiveTraffic = () => import('@/components/live-traffic.vue');
import { types } from '@/interfaces/serverProtocol';
import DashboardWidget from '@/libs/classes/dashboardwidget';
import { streamWS } from '@/libs/endpoints';
import { StatData, Airline, Airport, SpeedFlight } from '@/interfaces/stats';
import { store } from '@/store';
import { WebSocketSubject } from 'rxjs/webSocket';
import TopSelectedItem from '@/libs/classes/top-selected-item';

@Component({
  name: 'top-five',
  components: {
    TopFiveList,
    LiveTraffic,
  },
  data() {
    return {
        selectedItem: null,
    };
  },
  methods: {
    selectItem(item: TopSelectedItem) {
      if (item.equals(this.$data.selectedItem)) {
        this.$data.selectedItem = null;
      } else {
        this.$data.selectedItem = item;
      }
      store.dispatch('topSelectedItem', this.$data.selectedItem);
    },
  },
})
export default class extends DashboardWidget {
  private originAirport: StatData[] = [];
  private destinationAirport: StatData[] = [];
  private airlines: StatData[] = [];
  private fastestFlights: StatData[] = [];
  @Mutation private setMaxSpeed!: (speed: number) => void;

  private listen(url: string) {
    store.dispatch('attachWebSocket', { url }).then((socket: WebSocketSubject<unknown>) => {
      store.dispatch(types.startTop);
      socket.subscribe((event: any) => {
        const { eventType } = event;

        switch (eventType) {
          case 'TopDepartureAirportList':
            this.originAirport = event.eventPayload.elements.map(
              (airport: Airport): StatData => ({
                name: airport.airportCode,
                type: 'originAirport',
                count: airport.eventCount,
                percent: (100 * airport.eventCount) / event.eventPayload.elements[0].eventCount,
              }),
            );
            break;
            case 'TopArrivalAirportList':
              this.destinationAirport = event.eventPayload.elements.map(
                (airport: Airport): StatData => ({
                  name: airport.airportCode,
                  type: 'destinationAirport',
                  count: airport.eventCount,
                  percent: (100 * airport.eventCount) / event.eventPayload.elements[0].eventCount,
                }),
              );
              break;
            case 'TopAirlineList':
              this.airlines = event.eventPayload.elements.map(
                (airline: Airline): StatData => ({
                  name: airline.airlineName,
                  type: 'airlines',
                  count: airline.eventCount,
                  percent: (100 * airline.eventCount) / event.eventPayload.elements[0].eventCount,
                }),
              );
              break;
            case 'TopSpeedList':
              const maxSpeed = event.eventPayload.elements.map((speedFlight: SpeedFlight) => speedFlight.speed)[0] || 0;
              this.setMaxSpeed(maxSpeed);
              this.fastestFlights = event.eventPayload.elements.map(
                (speed: SpeedFlight): StatData => ({
                  name: speed.flightCode,
                  type: 'fastestFlights',
                  count: speed.speed.toFixed(0),
                  percent: (100 * speed.speed) / maxSpeed,
                  format: ' km/h',
                }),
              );
              break;
            default:
              return;
        }
      }, (error) => this.listen(url));
    });
  }

  private mounted() {
    this.listen(streamWS('dvs'));
  }
}
</script>

<style lang="scss" scoped src="@/styles/components/stats.scss" />
