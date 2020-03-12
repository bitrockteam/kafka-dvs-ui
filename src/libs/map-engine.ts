import WorldControl from '../mapbox-controls/world-control';
import { Flight, AirportInfo } from '../interfaces/flight';
import BoundingBox from './bounding-box';
import {} from 'googlemaps';

const directionDegPrecision: number = 10;
const zoomFactor: number = 3;
const baseMarkerDimension: number = 4;

interface AirportMarkerData {
  enabled: boolean;
  marker?: google.maps.Marker;
  zoom: number;
}

interface FlightMarkerData {
  direction: number;
  enabled: boolean;
  marker?: google.maps.Marker;
  zoom: number;
}

export default class MapEngine {
    private map: google.maps.Map;
    private airports: {
      [airportCode: string]: { marker: google.maps.Marker };
    } = {};
    private icaoNumberToPopup: { icaoNumber?: string, popup?: google.maps.InfoWindow } = {};
    private flights: {
        [icaoNumber: string]: { flight: Flight, marker: google.maps.Marker };
    } = {};
    private defaultBounds = new google.maps.LatLngBounds({ lat: -60, lng: -179 }, { lat: 80, lng: 179 });
    private defaultCenter = { lat: 45, lng: 10 };

    constructor(containerId: string, center?: { lat: number, lng: number }) {
        const elem = document.getElementById(containerId)!;
        this.map = new google.maps.Map(
            elem,
            {
                center: center || this.defaultCenter,
                zoom: 5,
                minZoom: 3,
                restriction: {
                    latLngBounds: this.defaultBounds,
                    strictBounds: true,
                },
                disableDefaultUI: true,
                styles: [
                    {
                      featureType: 'administrative.land_parcel',
                      stylers: [
                        {
                          visibility: 'off',
                        },
                      ],
                    },
                    {
                      featureType: 'administrative.neighborhood',
                      stylers: [
                        {
                          visibility: 'off',
                        },
                      ],
                    },
                    {
                      featureType: 'administrative.province',
                      stylers: [
                        {
                          visibility: 'off',
                        },
                      ],
                    },
                    {
                      featureType: 'landscape',
                      stylers: [
                        {
                          visibility: 'off',
                        },
                      ],
                    },
                    {
                      featureType: 'poi',
                      stylers: [
                        {
                          visibility: 'off',
                        },
                      ],
                    },
                    {
                      featureType: 'road',
                      stylers: [
                        {
                          color: '#ffffff',
                        },
                        {
                          visibility: 'simplified',
                        },
                      ],
                    },
                    {
                      featureType: 'road',
                      elementType: 'labels',
                      stylers: [
                        {
                          visibility: 'off',
                        },
                      ],
                    },
                    {
                      featureType: 'transit',
                      stylers: [
                        {
                          visibility: 'off',
                        },
                      ],
                    },
                    {
                      featureType: 'transit.station.airport',
                      stylers: [
                        {
                          visibility: 'on',
                        },
                      ],
                    },
                ],
            },
        );
        const worldControl = new WorldControl(() => this.getZoom(), (n: number) => this.zoomOnFocusedMarker(n));
        this.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(worldControl.getContainer());
    }

    public setCenter(center: {lat: number, lng: number}) {
        this.map.setCenter(center);
    }

    public clickFlightMarker(icao: string) {
      const {flight, marker} = this.flights[icao];
      this.openPopupForFlight(flight, marker);
    }

    public getBoundingBox(): BoundingBox {
        const bounds = this.map.getBounds() || this.defaultBounds;
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        return {
            leftHighLat: ne.lat(),
            leftHighLon: sw.lng(),
            rightLowLat: sw.lat(),
            rightLowLon: ne.lng(),
        };
    }

    public highlightMarker(f: (_: Flight) => boolean): void {
      const currentZoom = this.getZoom();
      const currentFlights = Object.values(this.flights);

      currentFlights.forEach((flightObject) => drawMarker({
        direction: flightObject.flight.geography.direction,
        enabled: f(flightObject.flight),
        marker: flightObject.marker,
        zoom: currentZoom,
      }));

      const airportCodesOfEnabledFlights = currentFlights
        .filter((flightObject) => f(flightObject.flight))
        .flatMap((flightObject) =>
          [flightObject.flight.airportArrival.codeAirport, flightObject.flight.airportDeparture.codeAirport],
        );

      Object.keys(this.airports).forEach((code) => drawAirportMarker({
        marker: this.airports[code].marker,
        enabled: airportCodesOfEnabledFlights.includes(code) || currentFlights.length === 0,
        zoom: currentZoom,
      }));
    }

    public onMove(listener: (ev: any) => void) {
        this.map.addListener('idle', listener);
    }

    public remove() {
        this.map.unbindAll();
    }

    public totalFlights(): number {
        return Object.keys(this.flights).length;
    }

    public getZoom(): number {
        return this.map.getZoom();
    }

    public updateFlight(flight: Flight) {
        const {
            geography: { latitude, longitude, direction },
            icaoNumber,
        } = flight;

        const enabled = true;
        const oldFlightInfo = this.flights[icaoNumber];
        const zoom = this.getZoom();
        const marker = createOrUpdateMarker(
          icaoNumber,
          longitude,
          latitude,
          { direction, enabled, marker: oldFlightInfo?.marker, zoom },
        ).marker!;
        google.maps.event.clearListeners(marker, 'click');
        google.maps.event.addListener(marker, 'click', () => this.openPopupForFlight(flight, marker));
        if (this.icaoNumberToPopup.icaoNumber === icaoNumber && this.icaoNumberToPopup.popup) {
          this.icaoNumberToPopup.popup.setContent(createPopup(flight));
        }
        marker.setMap(this.map);
        this.flights[icaoNumber] = { flight, marker };
    }

    public updateAirport(airport: AirportInfo) {
        const { codeAirport, latitude, longitude } = airport;
        const oldInfo = this.airports[codeAirport];
        const marker = createOrUpdateAirportMarker(
          codeAirport,
          longitude,
          latitude,
          { enabled: true, marker: oldInfo?.marker, zoom: this.getZoom() },
        ).marker!;
        marker.setMap(this.map);
        this.airports[codeAirport] = { marker };
    }

    public removeOldFlights(icaoNumbers: Set<string>) {
      Object.keys(this.flights).forEach((icaoNumber) => {
        if (!icaoNumbers.has(icaoNumber)) {
          this.flights[icaoNumber].marker.setMap(null);
          delete this.flights[icaoNumber];
        }
      });
    }

    public removeAirportsNotIn(codes: Set<string>): void {
      Object.keys(this.airports).forEach((key) => {
        if (!codes.has(key)) {
          this.airports[key].marker.setMap(null);
          delete this.airports[key];
        }
      });
    }

    private openPopupForFlight(flight: Flight, anchor: google.maps.MVCObject) {
        if (this.icaoNumberToPopup.popup) {
          this.icaoNumberToPopup.popup.close();
        }
        const infoWindow = new google.maps.InfoWindow({
          content: createPopup(flight),
          disableAutoPan: false,
        });
        this.icaoNumberToPopup = {
          icaoNumber: flight.icaoNumber,
          popup: infoWindow,
        };
        infoWindow.open(this.map, anchor);
    }

    private zoomOnFocusedMarker(n: number) {
        const centerMarkerZoomLevel = 12;
        const horizontalPadding = 200;
        const bottomPadding = 300;
        const topPadding = 180;
        this.map.setZoom(n);
        const position = this.selectedMarker()?.getPosition();
        if (position) {
            if (n < centerMarkerZoomLevel) {
                const pxZoomFactor = Math.pow(2, n);
                const sw = new google.maps.LatLng(
                    position.lat() - (bottomPadding / pxZoomFactor),
                    position.lng() - (horizontalPadding / pxZoomFactor),
                );
                const ne = new google.maps.LatLng(
                    position.lat() + (topPadding / pxZoomFactor),
                    position.lng() + (horizontalPadding / pxZoomFactor),
                );
                const newBounds = new google.maps.LatLngBounds(sw, ne);
                this.map.panToBounds(newBounds);
            } else {
                this.map.panTo(position);
            }
        }
    }

    private selectedMarker(): google.maps.Marker | undefined {
        if (this.icaoNumberToPopup.icaoNumber) {
            return this.flights[this.icaoNumberToPopup.icaoNumber].marker;
        }
    }

}

const createOrUpdateAirportMarker =
  (title: string, longitude: number, latitude: number, markerData: AirportMarkerData): AirportMarkerData => {
    markerData.marker = markerData.marker || new google.maps.Marker({
        draggable: false,
        optimized: true,
        title,
    });
    markerData.marker.setPosition({lat: latitude, lng: longitude});
    drawAirportMarker(markerData);
    return markerData;
};

function drawAirportMarker(markerData: AirportMarkerData): void {
  const innerColor = markerData.enabled ? '#a94000' : '#7a7a7a';
  const dimension = baseMarkerDimension + markerData.zoom * zoomFactor;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="IconsRepoEditor" viewBox="-36.97 -36.97 443.69 443.69" width="${dimension}px" height="${dimension}px">
    <g>
      <path fill="${innerColor}" d="M328.646,130.413h10.773l30.328-59.871l-23.332-27.688h-16.813V22.696h11.988c2.127,0,3.852-1.727,3.852-3.854 c0-2.127-1.725-3.852-3.852-3.852h-30.497c-2.128,0-3.853,1.725-3.853,3.852c0,2.127,1.725,3.854,3.853,3.854h11.988v20.158h-72.172 l-23.333,27.688l30.328,59.871h10.773v64.029h-97.016v-32.5H36.334v32.5H0v160.314h45.664v-79.982h57.666v79.982H360V194.442 h-31.354V130.413z M267.974,115.249l-14.521-29.543h28.15v29.543H267.974z M107.33,241.108H29.996v-23.332h77.334V241.108z M199.33,241.108h-77.334v-23.332h77.334V241.108z M291.33,241.108h-77.334v-23.332h77.334V241.108z M309.404,115.249h-21.482 V85.706h21.482V115.249z M315.723,85.706h28.152l-14.522,29.543h-13.631V85.706z"></path>
    </g>
  </svg>`;
  markerData.marker!.setIcon({
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    anchor: new google.maps.Point(dimension / 2, dimension / 2),
  });
  markerData?.marker?.setZIndex(markerData?.enabled ? 2 : -1);
}

const createOrUpdateMarker = (title: string, longitude: number, latitude: number, markerData: FlightMarkerData) => {
    markerData.marker = markerData.marker || new google.maps.Marker({
        draggable: false,
        optimized: true,
        title,
    });
    markerData.marker.setPosition({lat: latitude, lng: longitude});
    drawMarker(markerData);
    return markerData;
};

const drawMarker = (markerData: FlightMarkerData) => {
  const borderColor = markerData.enabled ? '#933400' : '#999999';
  const innerColor = markerData.enabled ? '#FB8F2D' : '#b8b8b8';
  const opacity = markerData.enabled ? 1 : 0.4;
  const dimension = baseMarkerDimension + markerData.zoom * zoomFactor;
  const direction = Math.round(markerData.direction / directionDegPrecision) * directionDegPrecision;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg version="1.1" id="airport-15" xmlns="http://www.w3.org/2000/svg" width="${dimension}px" height="${dimension}px" viewBox="-1 -1 18 18">
    <g transform="rotate(${direction}, 7.5, 7.5)">
      <path opacity="${opacity}" stroke="${borderColor}" stroke-width="0.5" fill="${innerColor}" id="path7712-0" d="M15,6.8182L15,8.5l-6.5-1&#xA;&#x9;l-0.3182,4.7727L11,14v1l-3.5-0.6818L4,15v-1l2.8182-1.7273L6.5,7.5L0,8.5V6.8182L6.5,4.5v-3c0,0,0-1.5,1-1.5s1,1.5,1,1.5v2.8182&#xA;&#x9;L15,6.8182z"/>
    </g>
  </svg>`;
  markerData?.marker?.setIcon({
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    anchor: new google.maps.Point(dimension / 2, dimension / 2),
  });
  markerData?.marker?.setZIndex(markerData?.enabled ? 1 : -2);
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
          <div style="text-align: center; max-width: 120px;">
            ${airportDeparture.nameAirport}
            </br>
            ${airportDeparture.cityName}
            </br>
            ${airportDeparture.nameCountry}
          </div>
        </div>
        <span></span>
        <div class='airport'>
          <b>${airportArrival.codeAirport}</b>
          <div style="text-align: center; max-width: 120px;">
            ${airportArrival.nameAirport}
            </br>
            ${airportArrival.cityName}
            </br>
            ${airportArrival.nameCountry}
          </div>
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
           <div>${altitude.toFixed(2)} m</div>
         </div>
         <div class='detail-box'>
           <h6>Latitude</h6>
           <div>${latitude.toFixed(4)}</div>
         </div>
         <div class='detail-box'>
          <h6>Longitude</h6>
           <div>${longitude.toFixed(4)}</div>
         </div>
       </div>
      </div>
    </div>
    `);
};
