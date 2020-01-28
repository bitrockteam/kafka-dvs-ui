
import mapboxgl, { LngLatBounds } from 'mapbox-gl';

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
  const check: string|null = mapboxgl.accessToken;
  if ( !check ) {
    mapboxgl.accessToken = token;
  }
};

export {
  customMarker,
  customBounds,
  setToken,
};
