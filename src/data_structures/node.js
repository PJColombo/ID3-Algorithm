export default class Node {
    constructor(attributeTable, dataTable) {
        this._attributeTable = attributeTable;
        this._dataTable = dataTable;
    }

    get attributeTable() {
        return this._attributeTable;
    }

    get dataTable() {
        return this._dataTable;
    }
}

