<template>
  <div id="map" ref="map" class="map-canvas">
    <slot></slot>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { map, filter, tap, share } from 'rxjs/operators';
import { streamWS } from '@/libs/endpoints';
import { AirportList, AirportListEvent } from '@/interfaces/airport';
import { AirportInfo, Flight, FlightList, FlightListEvent } from '@/interfaces/flight';
import MapEngine from '@/libs/map-engine';
import { CoordinatesBox, types, Precedence } from '@/interfaces/serverProtocol';
import { store } from '@/store';
import TopSelectedItem from '../libs/classes/top-selected-item';
import MaxSpeedFlight from '../libs/classes/max-speed-flight';
import { Airport } from '../interfaces/stats';
import DVSEvent from '../interfaces/dvs.event';
import { fromTopSelectedItem } from '../libs/precedence.factory';

@Component({
  name: 'world-map',
})
export default class extends Vue {
  @State private paused!: boolean;
  @State private topSelectedItem?: TopSelectedItem;
  @State private boxedMapSpeedFlight?: MaxSpeedFlight;

  private map?: MapEngine = undefined;
  private socketURL: string = 'dvs';
  private isListening: boolean = false;

  @Watch('paused')
  private togglePause(val: boolean) {
    val ? this.unsubscribe() : this.listen(streamWS(this.socketURL));
  }

  @Watch('topSelectedItem')
  private toggleMarker(item?: TopSelectedItem) {
    this.map?.highlightMarker(item);
  }

  @Watch('boxedMapSpeedFlight')
  private toggleBoxedMaxSpeedFlight(maxSpeedFlight?: MaxSpeedFlight) {
    if (maxSpeedFlight) {
      this.map?.clickFlightMarker(maxSpeedFlight.icao);
    }
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
    this.map!.remove();
    this.unsubscribe();
  }

  private createMapInstance(center?: {lat: number, lng: number}) {
      if (!this.map) {
        this.map = new MapEngine('map', center);
        this.map.onMove(this.sendBoundingBox);
      } else {
        this.map.setCenter(center!);
      }
  }

  private listen(url: string) {
    if (!this.isListening) {
      store.dispatch('attachWebSocket', { url }).then((socket: WebSocketSubject<unknown>) => {
        this.sendBoundingBox();
        const messages = socket
          .pipe(
            tap((event: any) => void 0, (err) => {
              this.isListening = false;
              this.listen(url);
            }),
            share(),
          );
        messages.pipe(filter<FlightListEvent>((event: DVSEvent) => event.eventType === 'FlightList'))
          .subscribe((event) => this.manageFlightList(event.eventPayload));
        messages.pipe(filter<AirportListEvent>((event: DVSEvent) => event.eventType === 'AirportList'))
          .subscribe((event) => this.manageAirportList(event.eventPayload));
      });
      this.isListening = true;
    }
  }

  private manageAirportList(event: AirportList): void {
    const { elements } = event;
    const newCodes = new Set(elements.map((f: AirportInfo) => f.codeAirport));

    window.requestAnimationFrame(() => {
      this.map!.removeAirportsNotIn(newCodes);

      (async () => {
        await Promise.all(
          elements.map(
            (airportUpdate) => this.map!.updateAirport(airportUpdate),
          ),
        );
      })();

      this.toggleMarker(this.topSelectedItem);
    });
  }

  private manageFlightList(event: FlightList): void {
    const { elements } = event;
    const newIcaoNumbers = new Set(elements.map((f: Flight) => f.icaoNumber));

    window.requestAnimationFrame(() => {
      this.map!.removeOldFlights(newIcaoNumbers);

      (async () => {
        await Promise.all(
          elements.map(
            (flightUpdate) => this.map!.updateFlight(flightUpdate),
          ),
        );
      })();
      this.toggleMarker(this.topSelectedItem);
    });

    // tslint:disable-next-line
    console.log('Flights on screen: ', this.map!.totalFlights());
  }

  private getUpdateRate(n: number): number {
    const arr = [5, 8, 13, 21, 34, 55, 89, 144];
    const index = Math.max(0, Math.min(n, arr.length - 1));

    return arr[index];
  }

  private createCommand(): CoordinatesBox {
    const { leftHighLat, leftHighLon, rightLowLat, rightLowLon } = this.map!.getBoundingBox();
    const zoom = this.map!.getZoom();
    const updateRate = this.getUpdateRate(Math.max(0, 10 - zoom));
    const precedence: Precedence = fromTopSelectedItem(store.getters.topSelectedItem);

    return {
      '@type': types.startFlightList,
      'maxFlights': store.getters.maxFlights,
      precedence,
      updateRate,
      leftHighLat,
      leftHighLon,
      rightLowLat,
      rightLowLon,
    };
  }

  private sendBoundingBox() {
    if (!this.paused) {
      store.dispatch(types.startFlightList, this.createCommand());
    }
  }
}
</script>

<style lang='scss' src='@/styles/components/world-map.scss'></style>
