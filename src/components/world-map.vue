<template>
  <div 
    id="map" 
    ref="map"
    v-bind:class="{ maximized: maximized, 'mapClass': true, 'mapboxgl-map': true }"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { State, Getter } from 'vuex-class';
import mapboxgl, { Marker, Popup, Map, LngLatBounds } from 'mapbox-gl';
import { webSocket } from 'rxjs/webSocket';
import { map, every } from 'rxjs/operators';
import { streamWS } from '@/libs/endpoints';
import { customMarker, setToken, customBounds } from '@/libs/map';
import { lowercaseObj, checkString } from '@/libs/utils';
import { RSVPEvent } from '@/interfaces/map';
import { Message } from '@/interfaces/development';
import WorldControl from '@/mapbox-controls/world-control';

@Component({
  name: 'world-map',
})
export default class extends Vue {
  @State private paused!: boolean;

  @Getter private mapRange!: number;
  @Getter private maximized!: number;
  @Getter private devSocket!: string;

  private map: any|Map = undefined;
  private mapClass: string = 'mapboxgl-map map-hidden';
  private markers: Marker[] = [];
  private latest: Marker[] = [];
  private socket: any = null;
  private socketURL: string = 'rsvps';
  private mapToken: string =
    'pk.eyJ1IjoiYml0cm9jayIsImEiOiJjanJrdWVvZWYwMXA2NGF0a2R6ajJjdXRpIn0.Ldc2OgW7lv_16VufwApmuA';

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

  @Watch('devSocket')
  private devSocketChange(val: string) {
    val.length ?
      this.listen(streamWS(val)) :
      this.unsubscribe();
  }

  private mounted() {
    // setTimeout( () => this.createMapInstance(), 200 );
    this.createMapInstance();
    if (!this.$attrs.dev) {
      this.listen(streamWS(this.socketURL));
    }
  }

  private unsubscribe() {
    if (this.socket) {
      this.socket.unsubscribe();
    }
    if (!this.devSocket.length && this.$attrs.dev) {
      this.map.remove();
      this.createMapInstance();
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
      zoom: 0.4,
      minZoom: 0.4,
      maxZoom: 6,
      maxBounds: customBounds,
    });

    this.map.addControl(new WorldControl(), 'bottom-right');
    this.map.on('load', () => this.showMap() );
  }

  private showMap() {
    this.mapClass = 'mapboxgl-map map-enter';
  }

  private cleanQueue(length: number, i: number): boolean {
    if (length > this.mapRange) {
      // @ts-ignore
      const last: Marker = this.latest.pop();
      last.remove();
    }
    return true;
  }

  private createMarkers(e: RSVPEvent, i: number): Marker {
    const evt = lowercaseObj(e);
    const { latitude, longitude, eventname, event, group } = (evt as any);
    const marker: Marker = new mapboxgl.Marker(customMarker());
    const popup: Popup = new mapboxgl.Popup().setHTML
      (`<a href="${event.url}" target="_blank" rel="noopener" rel="noreferrer">${eventname}</a>
      <div class="group-name"><span>Group</span>: ${group.name}</div>
      <div class="group-city"><span>City group</span>: ${group.city}</div>`);
    marker
      .setLngLat([longitude, latitude])
      .setPopup(popup)
      .addTo(this.map);
    return marker;
  }

  private listen(url: string) {
    this.socket = webSocket(url);

    this.socket.pipe(
      map((m: Message) => m.data ? checkString(m.data) : m),
      map(this.createMarkers),
      map((marker: Marker) => this.latest.unshift(marker)),
      every(this.cleanQueue),
    ).subscribe();
  }

}
</script>

<style lang="scss" src="@/styles/components/world-map.scss"></style>
