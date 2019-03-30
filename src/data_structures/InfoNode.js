export default class InfoNode {
    constructor(nameAttr) {
        this.nameAttr = nameAttr;
        this.n = 0;

        this.a = new Map();
        this.merit = 0;
    }

    calculateR() {
        this.a.forEach(val => {
            val.calculateR(this.n);
        });
    }
    calculateMerit() {
        this.a.forEach(val => {
           this.merit += val.r * val.calculateEntropy();
        });
    }
};