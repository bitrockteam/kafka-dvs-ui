<template>
  <div id='map' ref='map' class='mapboxgl-map'>
    <slot></slot>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { webSocket } from 'rxjs/webSocket';
import { map, filter } from 'rxjs/operators';
import { streamWS } from '@/libs/endpoints';
import { Flight, FlightList } from '@/interfaces/flight';
import MapEngine from '@/libs/map-engine';
import { CoordinatesBox } from '@/interfaces/serverProtocol';
import { store } from '@/store';

@Component({
  name: 'world-map',
})
export default class extends Vue {
  @State private paused!: boolean;

  private map: any | MapEngine = undefined;
  private socketURL: string = 'dvs';
  private mapToken: string =
    'pk.eyJ1IjoibWFwYm94Yml0cm9jayIsImEiOiJjazFjNzk4eTQwOWNnM2hyeWxwdWZ3azM1In0.3MBAlwbpNpBFnmMHdKppOg';

  @Watch('paused')
  private togglePause(val: boolean) {
    val ? this.unsubscribe() : this.listen(streamWS(this.socketURL));
  }

  private mounted() {
    this.createMapInstance();
    this.listen(streamWS(this.socketURL));
  }

  private unsubscribe() {
    store.dispatch('stopFlightList');
  }

  private destroyed() {
    this.map.remove();
    this.unsubscribe();
  }

  private createMapInstance() {
    this.map = new MapEngine(this.mapToken, 'map');
    this.map.onMove(this.sendBoundingBox);
  }

  private manageFlightList(event: FlightList) {
    const { elements } = event;
    let maxTimestap = 0;
    elements.forEach((flightUpdate: Flight) => {
      maxTimestap = Math.max(maxTimestap, flightUpdate.updated);
      this.map.updateFlight(flightUpdate);
    });
    // tslint:disable-next-line
    console.log("Flights on screen: ", this.map.totalFlights());
    // tslint:disable-next-line
    console.log("Max Timestamp: ", new Date(maxTimestap));
  }

  private listen(url: string) {
    store.dispatch('attachWebSocket', { url }).then((socket) => {
      this.sendBoundingBox();
      socket
        .pipe(
          filter((event: any) =>
            event.eventType === 'FlightList',
          ),
          map((event: any) => this.manageFlightList(event.eventPayload)),
        )
        .subscribe();
    });
  }

  private createCommand(): CoordinatesBox {
    const {
      leftHighLat,
      leftHighLon,
      rightLowLat,
      rightLowLon,
    } = this.map.getBoundingBox();

    return {
      '@type': 'startFlightList',
      'leftHighLat': leftHighLat,
      'leftHighLon': leftHighLon,
      'rightLowLat': rightLowLat,
      'rightLowLon': rightLowLon,
    };
  }

  private sendBoundingBox() {
      this.map.removeAllFlightsOutOfBoundingBox();
      store.dispatch('startFlightList', this.createCommand());
  }
}
</script>

<style lang="scss" src="@/styles/components/world-map.scss"></style>
