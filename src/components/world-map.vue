<template>
  <div
    id="map"
    ref="map"
    v-bind:class="{ maximized: maximized, 'mapboxgl-map': true }"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { State, Getter } from 'vuex-class';
import mapboxgl, { Marker, Popup, Map } from 'mapbox-gl';
import { webSocket } from 'rxjs/webSocket';
import { map } from 'rxjs/operators';
import { streamWS } from '@/libs/endpoints';
import { customMarker, setToken, customBounds } from '@/libs/map';
import { RSVPEvent } from '@/interfaces/map';
import WorldControl from '@/mapbox-controls/world-control';

@Component({
  name: 'world-map',
})
export default class extends Vue {
  @State private paused!: boolean;
  @Getter private maximized!: number;

  private map: any|Map = undefined;
  private flightsMarkers: { id: String, marker: Marker }[] = [];
  private socket: any = null;
  private socketURL: string = 'flights';
  private mapToken: string = 'pk.eyJ1IjoiYml0cm9jayIsImEiOiJjanJrdWVvZWYwMXA2NGF0a2R6ajJjdXRpIn0.Ldc2OgW7lv_16VufwApmuA';

  @Watch('paused')
  private togglePause(val: boolean) {
    val ?
      this.unsubscribe() :
      this.listen(streamWS(this.socketURL));
  }

  @Watch('maximized')
  private toggleMaximizedMap(val: boolean) {
    setTimeout(() => this.map.resize(), 50);
  }

  private mounted() {
    this.createMapInstance();
    this.listen(streamWS(this.socketURL));
  }

  private unsubscribe() {
    if (this.socket) {
      this.socket.unsubscribe();
    }
  }

  private destroyed() {
    this.map.remove();
    this.unsubscribe();
  }

  private createMapInstance() {
    setToken(this.mapToken);

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/bitrock/cjv7xe7yc0lh51fqkpe2nm44b',
      center: [6, 49],
      zoom: 3.3,
      minZoom: 0.4,
      maxZoom: 12,
      maxBounds: customBounds,
    });

    this.map.addControl(new WorldControl(), 'bottom-right');
  }

  private createMarker(event: RSVPEvent, i: number): Marker {
    const {
      geography: { latitude, longitude, direction, altitude },
      icaoNumber,
      iataNumber,
      speed,
      airline: { nameAirline = '' } = {},
      airplane: { productionLine = '' } = {},
      airportArrival,
      airportDeparture,
    } = (event as any);
    const marker: Marker = new mapboxgl.Marker(customMarker(direction));
    const popup: Popup = new mapboxgl.Popup().setHTML(`
    <div class="custom-popup">
      <div class="flight-ids-info">
        <div class="ids"><b>${icaoNumber}</b>${iataNumber && `/${iataNumber}`}</div>
        <span>${nameAirline}</span>
      </div>
      <div class="flight-airport">
        <b>${airportDeparture.codeAirport}</b>
        <span></span>
        <b>${airportArrival.codeAirport}</b>
      </div>
      <div class="flight-detail">
       <div class="detail-box-big">
           <h6>Aircraft Type</h6>
           <div>${productionLine}</div>
       </div>
       <div class="detail-box">
           <h6>Flight Speed</h6>
           <div>${speed.toFixed(0)} km/h</div>
       </div>
      </div>
      <div class="flight-detail">
         <div class="detail-box">
           <h6>Altitude</h6>
           <div>${altitude} ft</div>
         </div>
         <div class="detail-box">
           <h6>Latitude</h6>
           <div>${latitude}</div>
         </div>
         <div class="detail-box">
          <h6>Longitude</h6>
           <div>${longitude}</div>
         </div>
       </div>
      </div>
    </div>
    `);
    marker
      .setLngLat([longitude, latitude])
      .setPopup(popup)
      .addTo(this.map);
    this.flightsMarkers.push({id: icaoNumber, marker: marker });
    return marker;
  }

  private updateMarker(marker: Marker, event: RSVPEvent, i: number): Marker {
    const { geography: { latitude, longitude, direction } } = (event as any);
    marker
      .setLngLat([longitude, latitude])
      .addTo(this.map);
    const markerIcon = marker._element.firstElementChild;
    markerIcon.style.transform = `rotate(${direction - 90}deg)`;
    return marker;
  }

  private manageFlight(event: RSVPEvent, i: number) {
    const flightUpdate = this.flightsMarkers.find((flight) => flight.id === event.icaoNumber);
    if (flightUpdate) {
      this.updateMarker(flightUpdate.marker, event, i)
    } else {
      this.createMarker(event, i)
    }
  }

  private listen(url: string) {
    this.socket = webSocket(url);

    this.socket.pipe(
      map(this.manageFlight),
    ).subscribe();
  }

}
</script>

<style lang="scss" src="@/styles/components/world-map.scss"></style>
