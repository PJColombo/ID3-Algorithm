import Tree from '../data_structures/tree';
import InfoNode from '../data_structures/InfoNode';
import InfoValue from "../data_structures/InfoValue";

export default class ID3 {
    constructor(rootNode) {
        this._tree = new Tree(rootNode);
    }

    execute(node) {
        let infoNodes = node.attributeTable.map(attr => {
           return new InfoNode(attr);
        });
        node.dataTable.forEach((row => {
            row.forEach((attrVal, index, arr) => {
                let decision = row[arr.length - 1];
                if(index < arr.length - 1) {
                    infoNodes[index].n++;
                    if(infoNodes[index].a.has(attrVal)) {
                        infoNodes[index].a.get(attrVal).increment(decision);
                    }
                    else
                        infoNodes[index].a.set(attrVal, new InfoValue());
                }
            });
        }));
        //Calculate r value.
        infoNodes.forEach(node => {
            node.a.forEach(val => {
                node.val.calculateR(node.n);
            });
        });
        console.log(infoNodes);
    }

    calculateEntropy(p, n) {
        return -p * Math.log2(p) - n * Math.log2(n);
    }
}