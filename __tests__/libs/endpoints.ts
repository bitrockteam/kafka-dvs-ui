
import {
  streamWS,
  restAPI,
} from './../../src/libs/endpoints';

const title = (msg: string) => `libs/endpoints: ${msg}`;

test(title('streamWS'), () => {
  expect(streamWS('test')).toBe('WSS_URL/stream/test');
});

test(title('restAPI'), () => {
  expect(restAPI('test')).toBe('REST_URL/v1/rest/test');
});