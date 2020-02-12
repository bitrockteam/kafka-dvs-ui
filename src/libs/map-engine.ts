import WorldControl from '../mapbox-controls/world-control';
import { Flight } from '../interfaces/flight';
import BoundingBox from './bounding-box';
import {} from 'googlemaps';

export default class MapEngine {
    private map: google.maps.Map | any;
    private popup: google.maps.InfoWindow | any;
    private flights: {
        [icaoNumber: string]: { flight: Flight, marker: google.maps.Marker };
    } = {};
    private defaultBounds = new google.maps.LatLngBounds({ lat: -60, lng: -179 }, { lat: 80, lng: 179 });

    constructor(containerId: string) {
        const elem = document.getElementById(containerId);
        if (elem) {
            this.map = new google.maps.Map(
                elem,
                {
                    center: { lat: 45, lng: 10 },
                    zoom: 5,
                    minZoom: 3,
                    restriction: {
                        latLngBounds: this.defaultBounds,
                        strictBounds: true,
                    },
                    disableDefaultUI: true,
                    styles: [
                        {
                            featureType: 'poi',
                            stylers: [
                                { visibility: 'off' }
                            ]
                        }
                    ]
                });
        }

        const worldControl = new WorldControl(() => this.map.getZoom(), (n: number) => this.map.setZoom(n));
        this.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(worldControl.getContainer());
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

    public onMove(listener: (ev: any) => void) {
        this.map.addListener('idle', listener);

    }

    public remove() {
        this.map.unbindAll();
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
                    setPosition(oldFlightInfo.marker, longitude, latitude);
                    setDirection(oldFlightInfo.marker, direction);
                }

            }

        } else if (altitude !== 0) {
            // Handle new flight
            const marker: google.maps.Marker = createMarker(longitude, latitude, direction);
            google.maps.event.addListener(marker, 'click', () => {
                if (this.popup) {
                    this.popup.close();
                }
                this.popup = new google.maps.InfoWindow({
                    content: createPopup(flight),
                    disableAutoPan: false,
                });
                this.popup.open(this.map, marker);
            });

            marker.setMap(this.map);
            this.flights[icaoNumber] = { flight, marker };
        }
    }

    public removeAllFlightsOutOfBoundingBox() {
        const {
            leftHighLat,
            leftHighLon,
            rightLowLat,
            rightLowLon,
        } = this.getBoundingBox();

        Object.keys(this.flights).forEach((icaoNumber) => {
            const { lat, lng } = getPosition(this.flights[icaoNumber].marker);
            if (lat < rightLowLat || lat > leftHighLat || lng < leftHighLon || lng > rightLowLon) {
                this.removeFlight(icaoNumber);
            }
        });
    }

    public removeOldFlights(icaoNumbers: Set<string>) {
        Object.keys(this.flights).forEach((icaoNumber) => {
            if (!icaoNumbers.has(icaoNumber)) {
                this.removeFlight(icaoNumber);
            }
        });
    }

    private removeFlight(icaoNumber: string) {
        this.flights[icaoNumber].marker.setMap(null);
        delete this.flights[icaoNumber];
    }

}

const createMarker = (longitude: number, latitude: number, direction: number) => {
    const marker: google.maps.Marker = new google.maps.Marker({
        draggable: false,
        optimized: true,
    });
    setPosition(marker, longitude, latitude);
    setDirection(marker, direction);
    return marker;
};

const setPosition = (marker: google.maps.Marker, longitude: number, latitude: number) => {
    marker.setPosition({lat: latitude, lng: longitude});
};

const setDirection = (marker: google.maps.Marker, direction: number) => {
    const svg = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<svg version="1.1" id="airport-15" transform="rotate(',
        direction,
        ')" xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 15 15">',
        '<path fill="#eb6400"  id="path7712-0" d="M15,6.8182L15,8.5l-6.5-1&#xA;&#x9;l-0.3182,4.7727L11,14v1l-3.5-0.6818L4,15v-1l2.8182-1.7273L6.5,7.5L0,8.5V6.8182L6.5,4.5v-3c0,0,0-1.5,1-1.5s1,1.5,1,1.5v2.8182&#xA;&#x9;L15,6.8182z"/>',
        '</svg>',
    ].join('\n');
    marker.setIcon({
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    });
};

const getPosition = (marker: google.maps.Marker) => {
    const position = marker.getPosition();
    if (position) {
        return {lat: position.lat(), lng: position.lng()};
    } else {
        throw new Error('Invalid marker position');
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
