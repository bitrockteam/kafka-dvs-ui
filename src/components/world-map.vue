<template>
  <div id="map" ref="map" class="mapboxgl-map">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { State } from "vuex-class";
import mapboxgl, { Marker, Popup, Map } from "mapbox-gl";
import { webSocket } from "rxjs/webSocket";
import { map } from "rxjs/operators";
import { streamWS } from "@/libs/endpoints";
import { customMarker, setToken, customBounds } from "@/libs/map";
import { Flight, FlightList } from "@/interfaces/flight";
import WorldControl from "@/mapbox-controls/world-control";

@Component({
  name: "world-map"
})
export default class extends Vue {
  @State private paused!: boolean;

  private map: any | Map = undefined;
  private flightsMarkers: {
    [icaoNumber: string]: { updated: string; marker: Marker };
  } = {};
  private socket: any = null;
  // private socketURL: string = 'flights';
  private socketURL: string = "flight-list";
  private mapToken: string =
    "pk.eyJ1IjoiYml0cm9jayIsImEiOiJjanJrdWVvZWYwMXA2NGF0a2R6ajJjdXRpIn0.Ldc2OgW7lv_16VufwApmuA";

  @Watch("paused")
  private togglePause(val: boolean) {
    val ? this.unsubscribe() : this.listen(streamWS(this.socketURL));
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
      container: "map",
      style: "mapbox://styles/bitrock/cjv7xe7yc0lh51fqkpe2nm44b",
      center: [10, 45],
      zoom: 5,
      minZoom: 0.4,
      maxZoom: 12,
      maxBounds: customBounds
    });

    this.map.addControl(new WorldControl(), "top-right");

    this.map.on('moveend', this.sendBoundingBox);
  }

  private createMarker(event: Flight): Marker {
    const {
      geography: { latitude, longitude, direction, altitude },
      icaoNumber,
      iataNumber,
      speed,
      updated,
      airline: { nameAirline = "" } = {},
      airplane: { productionLine = "" } = {},
      airportArrival,
      airportDeparture
    } = event;
    const marker: Marker = new mapboxgl.Marker(customMarker(direction));
    const popup: Popup = new mapboxgl.Popup().setHTML(`
    <div class="custom-popup">
      <div class="flight-ids-info">
        <div class="ids"><b>${icaoNumber}</b>${iataNumber &&
      `/${iataNumber}`}</div>
        <span>${nameAirline}</span>
      </div>
      <div class="flight-airport">
        <div class="airport">
          <b>${airportDeparture.codeAirport}</b>
          <div>${airportDeparture.timezone} <br> GMT ( +${
      airportDeparture.gmt
    }:00 )</div>
        </div>
        <span></span>
        <div class="airport">
          <b>${airportArrival.codeAirport}</b>
          <div>${airportArrival.timezone} <br> GMT ( +${
      airportArrival.gmt
    }:00 )</div>
        </div>
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
    this.flightsMarkers[icaoNumber] = { updated, marker };
    return marker;
  }

  private updateMarker(marker: any, event: Flight) {
    const {
      geography: { latitude, longitude, direction },
      icaoNumber,
      updated
    } = event;
    // TODO check se longitude o latitude sono cambiate
    marker.setLngLat([longitude, latitude]);
    // TODO capire se va aggiornato anche il popup (mi sa di sì)
    const markerIcon = marker._element.firstElementChild;
    markerIcon.style.transform = `rotate(${direction - 90}deg)`;
    this.flightsMarkers[icaoNumber].updated = updated;
  }

  private deleteMarker(icaoNumber: string, flightUpdate: any) {
    flightUpdate.marker.remove();
    delete this.flightsMarkers[icaoNumber];
  }

  private manageFlight(event: Flight) {
    const flightUpdate = this.flightsMarkers[event.icaoNumber];
    if (flightUpdate) {
      this.updateMarker(flightUpdate.marker, event);
    } else {
      this.createMarker(event);
    }
  }

  private manageFlightList(event: FlightList) {
    Object.entries(this.flightsMarkers).forEach(([icaoNumber, flight]) => this.deleteMarker(icaoNumber, flight));
    const { elements } = event;
    elements.forEach((flight: Flight) => {
      if (flight.geography.altitude !== 0) {
        this.createMarker(flight);
      }
    });
  }

  private listen(url: string) {
    this.socket = webSocket(url);

    this.socket
      .pipe(
        map(this.manageFlightList)
        // map(this.manageFlight),
      )
      .subscribe();
  }

  private sendBoundingBox() {
    const bounds = this.map.getBounds();
    this.socket.next({
      leftHighLat: bounds.getNorth(),
      leftHighLon: bounds.getWest(),
      rightLowLat: bounds.getSouth(),
      rightLowLon: bounds.getEast(),
    });
  }
}
</script>

<style lang="scss" src="@/styles/components/world-map.scss"></style>
