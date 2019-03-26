import Tree from '../data_structures/tree';
import InfoNode from '../data_structures/InfoNode';
import InfoValue from "../data_structures/InfoValue";
import Node from "../data_structures/node";

export default class ID3 {
    constructor(rootNode) {
        //Node
        this.initialNode = rootNode;
        this.tree = null;
    }

    run() {
        console.log("Raiz");
        let initial = this.execute(this.initialNode);
        this.initialNode.infoNode = initial.root;
        this.tree = new Tree(this.initialNode, null);
        let i = 0;
        initial.children.forEach(childNode => {
            console.log("Hijo " + i);
            this.recur(childNode, this.tree);
            i++;
        });

    }

    recur(node, tree) {
        let data = this.execute(node);
        node.infoNode = data.root;
        if(data.children)
            data.children.forEach(childNode => {
                this.recur(childNode, new Tree(node, tree));
            });
    }
    recursiveRun(tree) {
        let resultNodes;
        resultNodes = this.execute(tree);
        node.infoNode = resultNodes.root;
        tree.addChild(new Tree(resultNodes.root), resultNodes.children);
        resultNodes.children.forEach(childNode => {
            this.recursiveRun(childNode)
        });
    }

    execute(node) {
        let selectedNodes = [], infoNodes = [];

        if(!node || node.attributeTable.length === 0)
            return;
        else if(node.dataTable.length === 0) {
            node.leafValue = "empty";
            return null;
        }
        //Check if all elements are positive.
        else if(node.dataTable.filter(row => {return row[row.length - 1].toLowerCase().trim() === "si"}).length === node.dataTable.length) {
            node.leafValue = "+";
            return true;
        }
        //Check if all elements are negative.
        else if(node.dataTable.filter(row => {return row[row.length - 1].toLowerCase().trim() === "no"}).length === node.dataTable.length) {
            node.leafValue = "-";
            return false;
        }

        console.log(node.dataTable.filter(row => {return row[row.length - 1].toLowerCase().trim() === "si"}).length);
        console.log(node.dataTable.filter(row => {return row[row.length - 1].toLowerCase().trim() === "no"}).length);


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
        //Calculate r value.
        infoNodes.forEach(node => {
            node.a.forEach(val => {
                val.calculateR(node.n);
            });
            node.calculateMerit();
        });
        //sort nodes base on merit value.
        infoNodes.sort((a, b) => {
            if(a.merit < b.merit)
                return -1;
            else if(a.merit > b.merit)
                return 1;
            else
                return 0;
        });
        console.log(infoNodes);
        let attrName = infoNodes[0].nameAttr, attrPos = node.attributeTable.indexOf(attrName);
        let attrTable = this.createAttrTable(node, attrName);
        infoNodes[0].a.forEach((val, key) => {
           selectedNodes.push(new Node(attrTable,
               this.createDataTable(node, attrPos, key)));
        });
        console.log(selectedNodes);
        return {root: infoNodes[0], children: selectedNodes};
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