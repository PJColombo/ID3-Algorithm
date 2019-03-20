export default class InfoNode {
    constructor(nameAttr) {
        this.nameAttr = nameAttr;
        this.n = 0;
        this.a = new Map();
    }

    setN(n) {
        this.n = n;
    }
};