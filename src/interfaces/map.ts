
export interface Event {
  url: string;
}

export interface Group {
  city: string;
  countrycode: string;
  name: string;
}

export interface User {
  name: string;
}

export interface RSVPEvent {
  event: Event;
  eventname: string;
  group: Group;
  latitude: number;
  longitude: number;
  response: string;
  timestamp: number;
  user: User;
}
