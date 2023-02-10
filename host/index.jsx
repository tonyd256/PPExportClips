if(typeof($)=='undefined') {
  $={};
}

$._PPP_={
  render: function (outputPresetPath) {
    const activeSequence = app.project.activeSequence;

    if (activeSequence) {
      app.encoder.launchEncoder(); // This can take a while; let's get the ball rolling.

      var projPath = new File(app.project.path);
      var outputPath = Folder.selectDialog("Choose the output directory");

      if (outputPath && projPath.exists) {
        var outPreset = new File(outputPresetPath);

        if (outPreset.exists === true) {
          var outputFormatExtension = activeSequence.getExportFileExtension(outPreset.fsName);

          if (outputFormatExtension) {
            var outputFilename = 'clip.' + outputFormatExtension;
            var fullPathToFile =  outputPath.fsName + $._PPP_.getSep() + outputFilename;
            var outFileTest = new File(fullPathToFile);

            if (outFileTest.exists){
              var destroyExisting = confirm("A file with that name already exists; overwrite?", false, "Are you sure...?");
              if (destroyExisting){
                outFileTest.remove();
                outFileTest.close();
              }
            }

            const clips = activeSequence.videoTracks[0].clips;

            for (var i = 0; i < clips.length; i++) {
              if (clips[i].disabled) { continue; }

              activeSequence.setInPoint(clips[i].start);
              activeSequence.setOutPoint(clips[i].end);

              var jobID = app.encoder.encodeSequence(
                activeSequence,
                fullPathToFile,
                outPreset.fsName,
                app.encoder.ENCODE_IN_TO_OUT,
                1);
              $._PPP_.message('jobID = ' + jobID);
            }
            outPreset.close();
            app.encoder.startBatch();
          }
        } else {
          alert("Could not find output preset.");
        }
      } else {
        alert("Could not find/create output path.");
      }
      projPath.close();
    } else {
      alert("No active sequence.");
    }
  },
  getActiveSequenceName : function () {
    if (app.project.activeSequence) {
      return app.project.activeSequence.name;
    } else {
      return "No active sequence.";
    }
  },
  getExportPresets : function() {
    const presetPath = app.getPProPrefPath.replace("Premiere Pro", "Adobe Media Encoder").replace("Profile-tony", "Presets");
    const folder = new Folder(presetPath);
    if (folder.exists) {
      const files = folder.getFiles("*.epr");
      return files;
    }
    return [];
  },
  message : function (message) {
    app.setSDKEventMessage(message, 'info');
  },
  getSep : function() {
    if (Folder.fs == 'Macintosh') {
      return '/';
    } else {
      return '\\';
    }
  },
};
