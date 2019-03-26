export default class Tree {
    constructor(root, parent, children) {
        this._root = root;
        this.parent = parent;
        if(!children)
            this._children = [];
        else
            this._children = children;
    }

    addChild(node) {
        this._children.push(new Tree(node));
    }
    getChildren(i) {
        return this._children[i];
    }
    get root() {
        return this._root;
    }
}