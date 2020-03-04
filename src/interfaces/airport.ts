import { AirportInfo } from '@/interfaces/flight';
import DVSEvent from './dvs.event';

export interface AirportListEvent extends DVSEvent {
    eventType: 'AirportList';
    eventPayload: AirportList;
}

export interface AirportList {
    elements: [AirportInfo];
}

