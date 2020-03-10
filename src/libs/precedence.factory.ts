import { Precedence } from '@/interfaces/serverProtocol';
import TopSelectedItem from './classes/top-selected-item';

export function fromTopSelectedItem(topSelectedItem: TopSelectedItem | undefined): Precedence {
    let precedence: Precedence = {};
    const typeOfPrecedence = topSelectedItem?.type;
    switch (typeOfPrecedence) {
        case 'originAirport':
            precedence = { departureAirport: topSelectedItem!.value };
            break;
        case 'destinationAirport':
            precedence = { arrivalAirport: topSelectedItem!.value };
            break;
        case 'airlines':
            precedence = { airline: topSelectedItem!.value };
            break;
        case 'fastestFlights':
            precedence = {};
            break;
    }
    return precedence;
}
