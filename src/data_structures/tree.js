export default class Tree {
    constructor(root) {
        this._root = root;
        this._children = [];
    }

    addChild(node) {
        this._children.push(new Tree(node));
    }

    get root() {
        return this._root;
    }
}