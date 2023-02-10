function onLoaded() {
  var csInterface = new CSInterface();
  var appName = csInterface.hostEnvironment.appName;

  csInterface.evalScript('$._PPP_.getActiveSequenceName()', setActiveSequenceName);
  csInterface.evalScript('$._PPP_.getExportPresets()', setExportPresets);
}

function render() {
  const preset = document.getElementById("presets").value;
  evalScript('$._PPP_.render("'+decodeURI(preset)+'")');
}

function setActiveSequenceName(name) {
  var boilerPlate = "Active Sequence: ";
  var seq_display = document.getElementById("activeSeq");
  seq_display.innerHTML = boilerPlate + name;
}

function setExportPresets(presets) {
  const select = document.getElementById("presets");
  const arr = presets.split(",");
  for (var i = 0; i < arr.length; i++) {
    var opt = document.createElement("option");
    opt.value = arr[i];
    opt.innerHTML = decodeURI(arr[i].split(/.*[\/|\\]/).pop().split(".")[0]);
    select.appendChild(opt);
  }
}

function evalScript(script, callback) {
  new CSInterface().evalScript(script, callback);
}
