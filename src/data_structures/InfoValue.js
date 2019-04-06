export default class InfoValue {
    constructor(positive) {
        this.a = 0;
        this.r = this.p = this.n = 0;
        this.pCounter = this.nCounter = 0;
        this.increment(positive);
    }

    increment(positive) {
        this.a++;
        if(positive.toLowerCase().trim() === "+")
            this.pCounter++;
        else
            this.nCounter++;
        this.n = this.nCounter / this.a;
        this.p = this.pCounter / this.a;

    }

    calculateR(total) {
        this.r = this.a / total;
    }

    calculateEntropy() {
        let firstElement, secondElement;
        if(this.n === 0)
            firstElement = 0;
        else
            firstElement = -this.n * Math.log2(this.n);

        if(this.p === 0)
            secondElement = 0;
        else
            secondElement = -this.p * Math.log2(this.p);

        return firstElement + secondElement;
    }
}