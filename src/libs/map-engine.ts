import WorldControl from '../mapbox-controls/world-control';
import { Flight, AirportInfo } from '../interfaces/flight';
import BoundingBox from './bounding-box';
import { } from 'googlemaps';
import TopSelectedItem from './classes/top-selected-item';
import MarkerClusterer from '@google/markerclustererplus';


const directionDegPrecision: number = 30;
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
    [airportCode: string]: { airport: AirportInfo, marker: google.maps.Marker };
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

  public setCenter(center: { lat: number, lng: number }) {
    this.map.setCenter(center);
  }

  public clickFlightMarker(icao: string) {
    const { flight, marker } = this.flights[icao];
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

  public highlightMarker(item?: TopSelectedItem): void {
    const currentZoom = this.getZoom();
    const currentFlights = Object.values(this.flights);
    const isHighlightedFlight = highlightFlight(item);

    const airportCodesOfEnabledFlights = currentFlights
      .filter((flightObject) => isHighlightedFlight(flightObject.flight))
      .flatMap((flightObject) =>
        [flightObject.flight.airportArrival.codeAirport, flightObject.flight.airportDeparture.codeAirport],
      );
    const isHighlightedAirport = highlightAirport(airportCodesOfEnabledFlights, item);

    currentFlights.forEach((flightObject) => drawMarker({
      direction: flightObject.flight.geography.direction,
      enabled: isHighlightedFlight(flightObject.flight),
      marker: flightObject.marker,
      zoom: currentZoom,
    }));

    Object.keys(this.airports).forEach((code) => drawAirportMarker({
      marker: this.airports[code].marker,
      enabled: isHighlightedAirport(this.airports[code].airport),
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
    this.airports[codeAirport] = { airport, marker };
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
    if (!markerData.marker) {
      markerData.marker = new google.maps.Marker({
        draggable: false,
        optimized: true,
        title,
      });
      markerData.marker.setPosition({ lat: latitude, lng: longitude });
      drawAirportMarker(markerData);
      return markerData;
    } else {
      return markerData;
    }
  };

function drawAirportMarker(markerData: AirportMarkerData): void {
  const dimension = baseMarkerDimension + markerData.zoom * zoomFactor;

  markerData?.marker?.setIcon({
    url: '/img/markers/airport.svg',
    size: new google.maps.Size(dimension, dimension),
  });
  markerData?.marker?.setZIndex(markerData?.enabled ? 2 : -1);
}

const createOrUpdateMarker = (title: string, longitude: number, latitude: number, markerData: FlightMarkerData) => {
  markerData.marker = markerData.marker || new google.maps.Marker({
    draggable: false,
    optimized: true,
    title,
  });
  markerData.marker.setPosition({ lat: latitude, lng: longitude });
  drawMarker(markerData);
  return markerData;
};

const drawMarker = (markerData: FlightMarkerData) => {
  const dimension = baseMarkerDimension + markerData.zoom * zoomFactor;

  const direction = Math.round(markerData.direction / directionDegPrecision) * directionDegPrecision;

  markerData?.marker?.setIcon({
    url: `/img/markers/${direction}/plane.svg`,
    size: new google.maps.Size(dimension, dimension),
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

const highlightFlight = (item?: TopSelectedItem): (_: Flight) => boolean => (flight) => {
  if (!item) {
    return true;
  }
  switch (item.type) {
    case 'originAirport':
      return flight.airportDeparture.nameAirport === item.value;
    case 'destinationAirport':
      return flight.airportArrival.nameAirport === item.value;
    case 'airlines':
      return flight.airline.nameAirline === item.value;
    default:
      return true;
  }
};

const highlightAirport = (enabledAirports: string[], item?: TopSelectedItem): (_: AirportInfo) =>
  boolean => (airport) => {
    if (!item) {
      return true;
    }
    switch (item.type) {
      case 'originAirport':
        return airport.nameAirport === item.value;
      case 'destinationAirport':
        return airport.nameAirport === item.value;
      case 'airlines':
        return enabledAirports.includes(airport.codeAirport);
      default:
        return true;
    }
  };
