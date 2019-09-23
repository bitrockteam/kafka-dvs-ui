
import mapboxgl, { Map, LngLatBounds } from 'mapbox-gl';

const customMarker = (): HTMLElement => {
  const marker: HTMLElement = document.createElement('div');
  marker.classList.add('map-event', 'map-event-enter');
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
