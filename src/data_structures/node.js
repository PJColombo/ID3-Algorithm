export default class Node {
    constructor(attributeTable, dataTable) {
        this._attributeTable = attributeTable;
        this._dataTable = dataTable;
        this.name = "";
        this.infoNode = null;
    }

    get attributeTable() {
        return this._attributeTable;
    }

    get dataTable() {
        return this._dataTable;
    }
}

