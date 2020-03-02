export default class TopSelectedItem {
    constructor(public type: string, public value: string) {};

    equals(other?: any) {
        if (other === this) return true;
        if (!other || typeof other !== 'object') return false;
        return other.type === this.type && other.value === this.value;
    }
}
