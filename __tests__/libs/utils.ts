import {
  lowercaseObj,
  checkString,
} from './../../src/libs/utils';
import { RSVPEvent } from './../../src/interfaces/map';

const title = (msg: string) => `libs/utils: ${msg}`;

const UPPER: any = {
  EVENT: { URL: 'no url' },
  EVENTNAME: 'random event',
  GROUP: {
    CITY: 'random city',
    COUNTRYCODE: 'nan',
    NAME: 'random group',
  },
  LATITUDE: 123,
  LONGITUDE: 456,
  RESPONSE: 'YES',
  TIMESTAMP: 123456,
  USER: { NAME: 'random user' },
};

const LOWER: RSVPEvent = {
  event: { url: 'no url'},
  eventname: 'random event',
  group: {
    city: 'random city',
    countrycode: 'nan',
    name: 'random group',
  },
  latitude: 123,
  longitude: 456,
  response: 'YES',
  timestamp: 123456,
  user: { name: 'random user' },
};

const STRINGED: string = `{"eventname":"random event"}`;

test(title('lowercaseObj'), () => {
  expect(lowercaseObj(UPPER)).toMatchObject(LOWER);
});

test(title('checkString'), () => {
  expect(checkString(LOWER)).toMatchObject(LOWER);
  expect(checkString(STRINGED)).toMatchObject({
    eventname: 'random event'
  });
});
