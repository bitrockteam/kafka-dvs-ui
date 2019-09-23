import { 
  queryGenerator,
  Query
} from './../../src/libs/query';

const title = (msg: string) => `libs/query: ${msg}`;

const query: Query = queryGenerator();

test(title('queryGenerator - text'), () => {
  expect(typeof query.text).toBe('string');
  expect(query.text).toContain(`AS SELECT * FROM RSVP_RECEIVED_JSON WHERE RESPONSE = 'YES' AND \`GROUP\`->COUNTRYCODE = 'us';`)
  expect(query.text).toContain(`CREATE STREAM`);
});

test(title('queryGenerator - id'), () => {
  expect(typeof query.id).toBe('string');
  expect(query.text).toContain(`ID`);
});