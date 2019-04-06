import  'bootstrap';
/*Diagram builder library*/
import mermaid from 'mermaid';
import $ from "jquery";

import './scss/app.scss';
import "./css/style.css";

import Node from '../src/data_structures/node';
import ID3 from './model/ID3';

const $attrFileSelector = "#inp-attrfile";
const $dataFileSelector = "#inp-datafile";
const $executeBtnSelector = "#btn-execute";
const $tableSelector = "#input-table";
const $tableHeadSelector = "#input-table thead";
const $tableBodySelector = "#input-table tbody";
const $treeContainerSelector = ".tree-container";
const $treeSelector = "#tree";
const $rulesSelector = "#rules";
const fr1 = new FileReader(), fr2 = new FileReader();

let attributeTable, dataTable;

//Set up Mermaid
mermaid.initialize({
    theme: 'forest',
    startOnLoad: false
});

$(document).ready(() => {
    $($treeContainerSelector).hide();
    $($attrFileSelector).change(onChangeInpFile(fr1, $attrFileSelector, $tableHeadSelector));
    $($dataFileSelector).change(onChangeInpFile(fr2, $dataFileSelector, $tableBodySelector));
    fr1.onload = onloadAttrFile;
    fr2.onload = onloadDataFile;

    $($executeBtnSelector).on("click", onExecute);
});

function onExecute() {
    if(!attributeTable || !dataTable ||
            attributeTable.length === 0 || dataTable.length === 0)
        alert("Upload both attribute and data files!");
    else {
        $($tableSelector).hide();
        let dataTableCopy = dataTable.map(row => row.slice());
        let id3;
        let msg = isValid(attributeTable, dataTableCopy);
        if(msg.length === 0) {
            id3 = new ID3(new Node(attributeTable.slice(), dataTableCopy));
            id3.run();
            $($treeContainerSelector).show();
            drawTree(id3.tree);
        }
        else
            alert(msg);
    }
}

function isValid(attributeTable, dataTable) {
    let valid = true;
    let msg = "";
    let i = 0, row, rowLength = dataTable[0].length;
    if(attributeTable.length !== rowLength)
        return "Attribute table and data table doesn't have equal number of elements.";
    while(valid && i < dataTable.length) {
        row = dataTable[i];
        row[row.length - 1] = row[row.length - 1].trim();
        if(row[row.length -1] !== '+' && row[row.length - 1] !== '-') {
            valid = false;
            msg = "Data table decisions values are not valid. Please use '+' or '-'.";
        }
        else if(row.length !== rowLength) {
            valid = false;
            msg = `Data table missing attributes values on row ${i + 1}`;
        }
        i++;
    }
    return msg;
}
function onChangeInpFile(fr, selector, tableSectionSelector) {
    return () => {
        $($treeContainerSelector).hide();
        $($tableSelector).show();
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

function drawTree(tree) {
    /*Need to use object so we can call buildDiagram with a
    * reference parameter and update it in every recursive call.*/
    let diagram = {tree: `graph TB\n`, rules: []};
    buildDiagram(tree, diagram, 0);
    console.log(diagram.tree);
    $($treeSelector).empty();
    mermaid.render("theGraph", diagram.tree, (svgCode) => {
        $($treeSelector).html(svgCode);
    });
    $($rulesSelector).empty();
    diagram.rules.forEach(rule => {
        $($rulesSelector).append(`<p>${rule}</p>`);
    });

}
function buildDiagram(currentTree, diagram, counter, rule, currParentName, currParentID) {

    let currentTreeName = currentTree.root.name,
        branch = currentTree.root.branch, currentTreeID = currentTreeName.replace(/\s/g, "") + counter;
    branch = branch ? branch.replace(/\s/g, "") : branch;
    if(currParentName && currParentID) {
        if(branch) {
            if(currentTree.children.length === 0) {
                diagram.tree += `${currParentID}((${currParentName}))-->|${branch + branch.charAt(branch.length - 1)}|${currentTreeID}(${currentTreeName})\n`;
                diagram.rules.push(`${rule} ${branch}) ⇒ (${currentTree.root.attributeTable[currentTree.root.attributeTable.length - 1]} = ${currentTreeName})`);
            }
            else {
                diagram.tree += `${currParentID}((${currParentName}))-->|${branch + branch.charAt(branch.length - 1)}|${currentTreeID}((${currentTreeName}))\n`;
                rule += ` ${branch}) ∧ (${currentTreeName} = `;
            }
        }
        else {
            if(currentTree.children.length === 0)
                diagram.tree += `${currParentID}((${currParentName}))-->${currentTreeID}(${currentTreeName})\n`;
            else
                diagram.tree += `${currParentID}((${currParentName}))-->${currentTreeID}((${currentTreeName}))\n`;
        }

    }
    else
        rule =  `(${currentTreeName} =`;

    currentTree.children.forEach(child => {
        buildDiagram(child, diagram, ++counter, rule, currentTreeName, currentTreeID);
    });
}