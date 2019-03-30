export default class Node {
    constructor(attributeTable, dataTable, branch) {
        this._attributeTable = attributeTable;
        this._dataTable = dataTable;
        this.name = "";
        this.branch = branch;
        this.infoNode = null;
    }

    get attributeTable() {
        return this._attributeTable;
    }

    get dataTable() {
        return this._dataTable;
    }
}

