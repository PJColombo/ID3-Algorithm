import Node from '../src/data_structures/node';
import $ from "jquery";
import ID3 from './model/ID3';

const $attrFileSelector = "#inp-attrfile";
const $dataFileSelector = "#inp-datafile";
const $executeBtnSelector = "#btn-execute";
const fr1 = new FileReader(), fr2 = new FileReader();


let node = new Node('padre1', 4, 10);
console.log(node);
/*
let reader = new FileReader();

reader.onload(e => {
    let text = reader.result;
});*/


$(document).ready(() => {
    fr1.onload = () => {
        let attributesText = fr1.result;
        let attributesList = attributesText.split(/\\n/);
        fr2.onload = () => {
            let dataText = fr2.result;
            let dataList = dataText.split(/\n/).map(val => {
                return val.split(",");
            });
            let id3 = new ID3(new Node(attributesList, dataList));
            id3.execute(new Node(attributesList, dataList));
        };
    };

    console.log("I'm ready.");
    $($executeBtnSelector).on("click", onExecute);
});

function onExecute() {
    let attrFile = $($attrFileSelector).prop('files'),
        dataFile = $($dataFileSelector).prop('files');

    if(attrFile.length === 0 || dataFile.length === 0)
        alert("Upload both attribute and data files!");
    else {
        attrFile = attrFile[0];
        dataFile = dataFile[0];

        fr1.readAsText(attrFile);
        fr2.readAsText(dataFile);
    }
    console.log(attrFile);
}

function onLoadFile() {

}