
export interface Query {
  id: string;
  text: string;
}

const id = (): string =>
  'ID_' + Math.floor(Math.random() * 9999);

export const baseQuery = (ID: string): string =>
  `CREATE STREAM ${ID} AS SELECT * FROM RSVP_RECEIVED_JSON WHERE RESPONSE = 'YES' AND \`GROUP\`->COUNTRYCODE = 'us';`;

export const queryGenerator = (): Query => {
  const $id = id();
  return {
    id: $id,
    text: baseQuery($id),
  };
};
