export interface ServerProtocol {
    readonly '@type': 'startFlightList' | 'stopFlightList' | 'startTop' | 'stopTop' | 'startTotal' | 'stopTotal';
}

export interface CoordinatesBox extends ServerProtocol {
    readonly '@type': 'startFlightList';
    readonly 'leftHighLat': number;
    readonly 'leftHighLon': number;
    readonly 'rightLowLat': number;
    readonly 'rightLowLon': number;
}

export interface StopFlightList extends ServerProtocol {
    readonly '@type': 'stopFlightList';
}

export interface StartTop extends ServerProtocol {
    readonly '@type': 'startTop';
}

export interface StopTop extends ServerProtocol {
    readonly '@type': 'stopTop';
}

export interface StartTotal extends ServerProtocol {
    readonly '@type': 'startTotal';
}

export interface StopTotal extends ServerProtocol {
    readonly '@type': 'stopTotal';
}
