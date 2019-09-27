
interface DataEvent {
  eventCount: number;
}

export interface ChartPoint {
  x: Date;
  y: number;
}

export interface Country extends DataEvent {
  countryName: string;
}

export interface Topic extends DataEvent {
  topicName: string;
}

export interface City extends DataEvent {
  cityName: string;
}

export interface TopData {
  name: string|undefined;
  count: number;
  percent: number;
  format?: string;
}

export interface TrendEvent {
  count: number;
  timestamp: number;
}
