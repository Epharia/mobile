export class PairSet {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }

    equals(that) {
        return this.a == that.a && this.b == that.b || this.a == that.b && this.b == that.a;
    }
}