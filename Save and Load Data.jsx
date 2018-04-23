// Save and Load Item, Layer, Effects, and Property Data

// global vars
var location = "C:\\data";

// UI
var mainWindow = new Window("palette", "Save and Load Data", undefined);
mainWindow.orientation = "column";

var groupOne = mainWindow.add("group", undefined, "groupOne");
groupOne.orientation = "row";
var typeDropDown = groupOne.add("dropdownlist", undefined, ["Item", "Layer", "Effect"]);
typeDropDown.selection = 0;

var groupTwo = mainWindow.add("group", undefined, "groupTwo");
groupTwo.orientation = "row";
var loadButton = groupTwo.add("button", undefined, "Load");
var saveButton = groupTwo.add("button", undefined, "Save");

mainWindow.center();
mainWindow.show();

loadButton.onClick = function() {
    var loadData;
    // 0 == item
    // 1 == layer
    // 2 == effect
    switch(typeDropDown.selection.index) {
        case 0:
            loadData = loadFile("/item.txt");
                var itemData = loadData.split(",");
            var comp = app.project.activeItem;
            // name, width, height, framerate, duration
            comp.name = itemData[0].toString();
            comp.width = parseInt(itemData[1]);
            comp.height = parseInt(itemData[2]);
            comp.frameDuration = 1 / parseInt(itemData[3]);
            comp.duration = parseInt(itemData[4]);
        break;
        case 1:
            loadData = loadFile("/layer.txt");
            var layerData = loadData.split(",");
            var layer = app.project.activeItem.selectedLayers[0];
            // name, position, scale, opacity, rotation
            layer.name = layerData[0].toString();
            layer.property("Position").setValue([parseInt(layerData[1]), parseInt(layerData[2])]);
            layer.property("Scale").setValue([parseInt(layerData[4]), parseInt(layerData[5])]);
            layer.property("Opacity").setValue(parseInt(layerData[7]));
            layer.property("Rotation").setValue(parseInt(layerData[8]));
            
        break;
        case 2:
            loadData = loadFile("/effect.txt");
            var effectData = loadData.split(",");
            var layer = app.project.activeItem.selectedLayers[0];
            // name, numProperties
            layer.Effects.property(1).name = effectData[0].toString();
        break;
        }
    
    }

function loadFile(fileString) {
    var readData;
    var thisFile = File(location + fileString);
    thisFile.open("r");
    readData = thisFile.readln();
    thisFile.close();

    return readData;
    }

saveButton.onClick = function() {
    // 0 == item
    // 1 == layer
    // 2 == effect
    switch(typeDropDown.selection.index) {
        case 0:
            checkFile("item", itemData());
        break;
        case 1:
            checkFile("layer", layerData());
        break;
        case 2:
            checkFile("effect", effectData());
        break;
        }
    }

function checkFile(parameterString, data) {
    var thisFile = File(location + "/" + parameterString + ".txt");
    if(!thisFile.exists) {
        thisFile.open("w");
        thisFile = new File(location + "/" + parameterString + ".txt");
        thisFile.write(data);
        thisFile.close();
        } else {
            thisFile.open("w");
            thisFile.write(data);
            thisFile.close();
            }
    }

function itemData() {
    if(app.project.activeItem == null || app.project.activeItem == undefined) {
            alert("Please select a comp first");
            return false;
        } else {
            var comp = app.project.activeItem;
    // name, width, height, framerate, duration
    return [comp.name, comp.width, comp.height, 1/ comp.frameDuration, comp.duration];
    }
    }

function layerData() {
    if(app.project.activeItem == null || app.project.activeItem == undefined) {
            alert("Please select a comp first");
            return false;
        }
        if(app.project.activeItem.selectedLayers.length != 1) {
                alert("Please select a layer");
                return false;
            } else {
                    var layer = app.project.activeItem.selectedLayers[0];
                    // name, position, scale, opacity, rotation
                    return [layer.name, layer.property("Position").value, layer.property("Scale").value, layer.property("Opacity").value, layer.property("Rotation").value];
                }
    }

function effectData() {
    if(app.project.activeItem == null || app.project.activeItem == undefined) {
            alert("Please select a comp first");
            return false;
        }
        if(app.project.activeItem.selectedLayers.length != 1) {
                alert("Please select a layer");
                return false;
            } 
            if(app.project.activeItem.selectedLayers[0].Effects.numProperties != 1) {
                    alert("Please select an effect");
                    return false;
                }
        else {
                    var layer = app.project.activeItem.selectedLayers[0];
                    // name, numProperties
                    return [layer.effect(1).name, layer.Effects.property(1).numProperties];
                }
    }
