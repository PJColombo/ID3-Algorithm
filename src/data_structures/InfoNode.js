export default class InfoNode {
    constructor(nameAttr) {
        this.nameAttr = nameAttr;
        this.n = 0;

        this.a = new Map();
        this.merit = 0;
        this.leafValue = null;
    }

    calculateMerit() {
        this.a.forEach(val => {
           this.merit += val.r * val.calculateEntropy();
        });
    }
};