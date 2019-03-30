export default class Tree {
    constructor(root, children) {
        this._root = root;
        if(!children)
            this._children = [];
        else
            this._children = children;
    }

    addChild(tree) {
        this._children.push(tree);
    }
    get children() {
        return this._children;
    }
    get root() {
        return this._root;
    }
}