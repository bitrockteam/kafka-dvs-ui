export default class TopSelectedItem {
    constructor(
        public type: 'originAirport' | 'destinationAirport' | 'airlines' | 'fastestFlights',
        public value: string) {}

    public equals(other?: any) {
        if (other === this) {
            return true;
        }
        if (!other || typeof other !== 'object') {
            return false;
        }
        return other.type === this.type && other.value === this.value;
    }
}
