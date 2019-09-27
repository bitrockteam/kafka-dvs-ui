const WS: string = process.env.VUE_APP_GEOSTREAM_WS_URL || 'WSS_URL';
const REST: string = process.env.VUE_APP_GEOSTREAM_REST_URL || 'REST_URL';

export const streamWS = (value: string): string => `${WS}/stream/${value}`;

export const restAPI = (value: string): string => `${REST}/v1/rest/${value}`;
