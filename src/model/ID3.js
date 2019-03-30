import Tree from '../data_structures/tree';
import InfoNode from '../data_structures/InfoNode';
import InfoValue from "../data_structures/InfoValue";
import Node from "../data_structures/node";

export default class ID3 {
    constructor(rootNode) {
        //Node
        this.initialNode = rootNode;
        this.tree = new Tree();
    }

    run() {
        console.log("Raiz");

        this.execute(this.initialNode, this.tree, true);
        console.log(this.tree);

    }

    execute(node, parentTree, initialRoot) {
        let infoNodes = [];
        let tree;


        if(!node || node.attributeTable.length === 0)
            return;
        else if(node.dataTable.length === 0) {
            node.leafValue = "empty";
            node.name = "Empty node";
            tree = new Tree(node);
        }
        //Check if all elements are positive.
        else if(node.dataTable.filter(row => {return row[row.length - 1].toLowerCase().trim() === "si"}).length === node.dataTable.length) {
            node.name = node.attributeTable[node.attributeTable.length - 1];
            tree = new Tree(node);
        }
        //Check if all elements are negative.
        else if(node.dataTable.filter(row => {return row[row.length - 1].toLowerCase().trim() === "no"}).length === node.dataTable.length) {
            node.name = "No " + node.attributeTable[node.attributeTable.length - 1];
            tree = new Tree(node);
        }
        else {
            for(let i = 0; i < node.attributeTable.length - 1; i++)
                infoNodes.push(new InfoNode(node.attributeTable[i]));
            node.dataTable.forEach(row => {
                row.forEach((attrVal, index, arr) => {
                    let decision = row[arr.length - 1];
                    if(index < arr.length - 1) {
                        infoNodes[index].n++;
                        if(infoNodes[index].a.has(attrVal)) {
                            infoNodes[index].a.get(attrVal).increment(decision);
                        }
                        else
                            infoNodes[index].a.set(attrVal, new InfoValue(decision));
                    }
                });
            });
            //Calculate r value and merit.
            infoNodes.forEach(node => {
                node.calculateR();
                node.calculateMerit();
            });
            //sort nodes by merit.
            infoNodes.sort((a, b) =>  a.merit - b.merit );
            let attrName = infoNodes[0].nameAttr, attrPos = node.attributeTable.indexOf(attrName);
            node.infoNode = infoNodes[0]; node.name = infoNodes[0].nameAttr;
            tree = new Tree(node);
            infoNodes[0].a.forEach((val, key) => {
                this.execute(new Node(this.createAttrTable(node, attrName), this.createDataTable(node, attrPos, key), key), tree);
            });
        }
        if(initialRoot)
            this.tree = tree;
        else if(parentTree)
            parentTree.addChild(tree);
    }

    createAttrTable(node, bestAttr) {
        return node.attributeTable.filter(val => {
            return val.toLowerCase() !== bestAttr.toLowerCase().trim();
        });
    }

    createDataTable(node, bestAttrPos, bestAttrVal) {
        return node.dataTable.filter(row => {
            return row[bestAttrPos] === bestAttrVal;
        }).map(row => {
            row.splice(bestAttrPos, 1);
            return row;
        });
    }
}