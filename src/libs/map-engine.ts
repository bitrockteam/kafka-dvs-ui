import WorldControl from '../mapbox-controls/world-control';
import mapboxgl, { Map, Popup, LngLatBounds, Marker, Point } from 'mapbox-gl';
import { Flight } from '../interfaces/flight';
import BoundingBox from './bounding-box';

export default class MapEngine {
    private map: Map;
    private flights: {
        [icaoNumber: string]: { flight: Flight, marker: Marker };
    } = {};

    constructor(token: string, containerId: string) {
        setToken(token);

        this.map = new mapboxgl.Map({
            container: containerId,
            style: 'mapbox://styles/mapboxbitrock/ck1uemr9300i81cmwnc26ddks?optimize=true',
            center: [10, 45],
            zoom: 5,
            minZoom: 0.4,
            maxZoom: 12,
            maxBounds: new mapboxgl.LngLatBounds([
                new mapboxgl.LngLat(-180, -55),
                new mapboxgl.LngLat(180, 80),
            ]),
        });
        this.map.addControl(new WorldControl(), 'top-right');
        this.map.dragRotate.disable();
    }

    public getBoundingBox(): BoundingBox {
        const bounds = this.map.getBounds();
        return {
            leftHighLat: bounds.getNorth(),
            leftHighLon: bounds.getWest(),
            rightLowLat: bounds.getSouth(),
            rightLowLon: bounds.getEast(),
        };
    }

    public onMove(listener: (ev: any) => void) {
        this.map.on('moveend', listener);
    }

    public remove() {
        this.map.remove();
    }

    public totalFlights(): number {
        return Object.keys(this.flights).length;
    }

    public updateFlight(flight: Flight) {
        const {
            geography: { latitude, longitude, direction, altitude },
            icaoNumber,
            updated,
        } = flight;

        const oldFlightInfo = this.flights[icaoNumber];

        if (oldFlightInfo) {

            if (oldFlightInfo.flight.updated < updated) {

                if (flight.geography.altitude === 0) {
                    this.removeFlight(icaoNumber);
                } else {
                    // Update lng and lat only if really change
                    const { lat, lng } = oldFlightInfo.marker.getLngLat();
                    if (latitude !== lat || longitude !== lng) {
                        oldFlightInfo.marker.setLngLat([longitude, latitude]);
                    }
                    // Change direction
                    const marker = oldFlightInfo.marker;
                    const markerIcon = marker.getElement().firstElementChild;
                    const newStyle = `transform: rotate(${direction} - 90}deg)`;
                    if (markerIcon && markerIcon.getAttribute('style') !== newStyle) {
                        markerIcon.setAttribute('style', newStyle);
                    }

                    // Update Popup
                    oldFlightInfo.marker.getPopup().setHTML(createPopup(flight));
                    this.flights[icaoNumber] = { flight, marker };
                }

            } else {
                // No update, do nothing
            }

        } else if (altitude !== 0) {
            // Handle new flight
            const marker: Marker = new mapboxgl.Marker(customMarker(direction));
            const popup: Popup = new mapboxgl.Popup().setHTML(createPopup(flight));
            marker
                .setLngLat([longitude, latitude])
                .setPopup(popup)
                .addTo(this.map);
            this.flights[icaoNumber] = { flight, marker };
        } else {
            // Do noting when a new flight has altitude 0
        }
    }

    public removeAllFlightsOutOfBoundingBox() {
        const {
            leftHighLat,
            leftHighLon,
            rightLowLat,
            rightLowLon,
        } = this.getBoundingBox();

        // TODO consider don't remove but just unsubscribe from update(but handle remove)
        Object.keys(this.flights).forEach((icaoNumber) => {
            const { lat, lng } = this.flights[icaoNumber].marker.getLngLat();
            if (lat < rightLowLat || lat > leftHighLat || lng < leftHighLon || lng > rightLowLon) {
                this.removeFlight(icaoNumber);
            }
        });
    }

    private removeFlight(icaoNumber: string) {
        this.flights[icaoNumber].marker.remove();
        delete this.flights[icaoNumber];
    }

}

const customMarker = (direction: number): HTMLElement => {
    const marker: HTMLElement = document.createElement('div');
    marker.classList.add('map-event');
    const markerIcon = document.createElement('div');
    markerIcon.classList.add('marker-icon');
    markerIcon.style.transform = `rotate(${direction - 90}deg)`;
    marker.appendChild(markerIcon);
    return marker;
};

const customBounds: LngLatBounds = new mapboxgl.LngLatBounds([
    new mapboxgl.LngLat(-180, -55),
    new mapboxgl.LngLat(180, 80),
]);

const setToken = (token: string) => {
    const check: string | null = mapboxgl.accessToken;
    if (!check) {
        mapboxgl.accessToken = token;
    }
};

const createPopup = (flight: Flight) => {
    const {
        geography: { latitude, longitude, altitude },
        icaoNumber,
        iataNumber,
        speed,
        airline: { nameAirline = '' } = {},
        airplane: { productionLine = '' } = {},
        airportArrival,
        airportDeparture,
    } = flight;
    return (`
    <div class='custom-popup'>
      <div class='flight-ids-info'>
        <div class='ids'><b>${icaoNumber}</b>${iataNumber && `/${iataNumber}`}</div>
        <span>${nameAirline}</span>
      </div>
      <div class='flight-airport'>
        <div class='airport'>
          <b>${airportDeparture.codeAirport}</b>
          <div>${airportDeparture.timezone} <br> GMT ( +${airportDeparture.gmt}:00 )</div>
        </div>
        <span></span>
        <div class='airport'>
          <b>${airportArrival.codeAirport}</b>
          <div>${airportArrival.timezone} <br> GMT ( +${airportArrival.gmt}:00 )</div>
        </div>
      </div>
      <div class='flight-detail'>
       <div class='detail-box-big'>
           <h6>Aircraft Type</h6>
           <div>${productionLine}</div>
       </div>
       <div class='detail-box'>
           <h6>Flight Speed</h6>
           <div>${speed.toFixed(0)} km/h</div>
       </div>
      </div>
      <div class='flight-detail'>
         <div class='detail-box'>
           <h6>Altitude</h6>
           <div>${altitude} ft</div>
         </div>
         <div class='detail-box'>
           <h6>Latitude</h6>
           <div>${latitude}</div>
         </div>
         <div class='detail-box'>
          <h6>Longitude</h6>
           <div>${longitude}</div>
         </div>
       </div>
      </div>
    </div>
    `);
};
