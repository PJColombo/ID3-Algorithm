export default class InfoValue {
    constructor(name, positive) {
        this.a = 1;
        this.r = this.p = this.n = 0;
        this.pCounter = this.nCounter = 0;
        if(positive)
            this.pCounter= this.p / this.a;
        else
            this.nCounter = this.n / this.a;
    }

    increment(positive) {
        this.a++;
        if(positive)
            this.pCounter++;
        else
            this.nCounter;
    }

    calculateR(total) {
        this.r = this.a / total;
    }
}