import  'bootstrap';
import './scss/app.scss';
import $ from "jquery";
import "./css/style.css";

import Node from '../src/data_structures/node';
import ID3 from './model/ID3';

const $attrFileSelector = "#inp-attrfile";
const $dataFileSelector = "#inp-datafile";
const $executeBtnSelector = "#btn-execute";
const $tableHeadSelector = "#input-table thead";
const $tableBodySelector = "#input-table tbody";
const fr1 = new FileReader(), fr2 = new FileReader();

let attributeTable, dataTable;
$(document).ready(() => {
    $($attrFileSelector).change(onChangeInpFile(fr1, $attrFileSelector, $tableHeadSelector));
    $($dataFileSelector).change(onChangeInpFile(fr2, $dataFileSelector, $tableBodySelector));
    fr1.onload = onloadAttrFile;
    fr2.onload = onloadDataFile;

       /* let id3 = new ID3(new Node(attributesList, dataList));
        id3.run();*/
    console.log("I'm ready.");
    $($executeBtnSelector).on("click", onExecute);
});

function onExecute() {
    if(!attributeTable || !dataTable ||
            attributeTable.length === 0 || dataTable.length === 0)
        alert("Upload both attribute and data files!");
    else {
        new ID3(new Node(attributeTable, dataTable)).run();
    }
}

function onChangeInpFile(fr, selector, tableSectionSelector) {
    return () => {
        let file = $(selector).prop('files');
        if(file.length > 0 )
            fr.readAsText(file[0]);
        else if(tableSectionSelector)
            $(tableSectionSelector).empty();
    };
}

function onloadAttrFile() {
    let attributesText = fr1.result;
    let attributesList = attributesText.split(/\n/).map(val => {
        return val.split(",");
    })[0];
    $($tableHeadSelector).empty();
    let headRow = `<tr>`;
    attributesList.forEach(attr => {
        headRow += `<th>${attr}</th>`;
    });
    headRow += `</tr>`;
    $($tableHeadSelector).append(headRow);
    attributeTable = attributesList;
}

function onloadDataFile() {
    let dataText = fr2.result;
    let dataList = dataText.split(/\n/).map(val => {
        return val.split(",");
    });
    $($tableBodySelector).empty();
    dataList.forEach(row => {
        let tRow = `<tr>`;
        row.forEach(data => {
            tRow += `<td>${data}</td>`;
        });
        tRow += "</tr>";
        $($tableBodySelector).append(tRow);
    });
    dataTable = dataList;
}