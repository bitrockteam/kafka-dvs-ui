<template>
  <div id='map' ref='map' class='map-canvas'>
    <slot></slot>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { map, filter, tap } from 'rxjs/operators';
import { streamWS } from '@/libs/endpoints';
import { Flight, FlightList } from '@/interfaces/flight';
import MapEngine from '@/libs/map-engine';
import { CoordinatesBox, types } from '@/interfaces/serverProtocol';
import { store } from '@/store';

@Component({
  name: 'world-map',
})
export default class extends Vue {
  @State private paused!: boolean;

  private map: any | MapEngine = undefined;
  private socketURL: string = 'dvs';
  private isListening: boolean = false;

  @Watch('paused')
  private togglePause(val: boolean) {
    val ? this.unsubscribe() : this.listen(streamWS(this.socketURL));
  }

  private mounted() {
    const firstMapLoad = setTimeout(() => {
      this.createMapInstance();
      this.listen(streamWS(this.socketURL));
    }, 500);

    new Promise<{lat: number, lng: number}>((resolve, reject) => {
      return navigator.geolocation.getCurrentPosition(
          (position) =>  resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
          (_) => resolve,
          { maximumAge: 600000 },
      );
    },
    ).then((center) => {
      clearTimeout(firstMapLoad);
      this.createMapInstance(center);
      this.listen(streamWS(this.socketURL));
    });
  }

  private unsubscribe() {
    store.dispatch(types.stopFlightList);
    this.isListening = false;
  }

  private destroyed() {
    this.map.remove();
    this.unsubscribe();
  }

  private createMapInstance(center?: {lat: number, lng: number}) {
      if (!this.map) {
        this.map = new MapEngine('map', center);
        this.map.onMove(this.sendBoundingBox);
      } else {
        this.map.setCenter(center);
      }
  }

  private manageFlightList(event: FlightList) {
    const { elements } = event;
    let maxTimestap = 0;
    const newIcaoNumbers = new Set(elements.map((f: Flight) => f.icaoNumber));
    this.map.removeOldFlights(newIcaoNumbers);
    elements.forEach((flightUpdate: Flight) => {
      maxTimestap = Math.max(maxTimestap, flightUpdate.updated);
      this.map.updateFlight(flightUpdate);
    });
    // tslint:disable-next-line
    console.log('Flights on screen: ', this.map.totalFlights());
    // tslint:disable-next-line
    console.log('Max Timestamp: ', new Date(maxTimestap));
  }

  private listen(url: string) {
    if (!this.isListening) {
      store.dispatch('attachWebSocket', { url }).then((socket: WebSocketSubject<unknown>) => {
        this.sendBoundingBox();
        socket
          .pipe(
            tap((event: any) => void 0, (err) => {
              this.isListening = false;
              this.listen(url);
            }),
            filter((event: any) =>
              event.eventType === 'FlightList',
            ),
            map((event: any) => this.manageFlightList(event.eventPayload)),
          )
          .subscribe();
      });
      this.isListening = true;
    }
  }

  private getUpdateRate(n: number): number {
    const arr = [5, 8, 13, 21, 34, 55, 89, 144]
    const index = Math.max(0, Math.min(n, arr.length - 1));

    return arr[index];
  }

  private createCommand(): CoordinatesBox {
    const {
      leftHighLat,
      leftHighLon,
      rightLowLat,
      rightLowLon,
    } = this.map.getBoundingBox();

    const zoom = this.map.getZoom();
    const updateRate = this.getUpdateRate(Math.max(0, 10 - zoom));

    return {
      '@type': types.startFlightList,
      'maxFlights': store.getters.maxFlights,
      'updateRate': updateRate,
      'leftHighLat': leftHighLat,
      'leftHighLon': leftHighLon,
      'rightLowLat': rightLowLat,
      'rightLowLon': rightLowLon,
    };
  }

  private sendBoundingBox() {
    if (!this.paused) {
      this.map.removeAllFlightsOutOfBoundingBox();
      store.dispatch(types.startFlightList, this.createCommand());
    }
  }
}
</script>

<style lang='scss' src='@/styles/components/world-map.scss'></style>
