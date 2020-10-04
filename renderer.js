const {
    ipcRenderer
} = require("electron");

const context = new AudioContext();
var source = null;

const gainNode = context.createGain();
const filterNode = context.createBiquadFilter();
const processor = context.createScriptProcessor(4096, 1, 1);


const stopButton = document.getElementById("stop");
const startButton = document.getElementById("start");
var shouldStop = true;
var buffer = [];

window.onload = function () {
    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
    }).then(handleAudioData);

    ipcRenderer.send("connect-to-server", "connect");
}

const handleAudioData = function (stream) {
    source = context.createMediaStreamSource(stream);
    source.connect(processor);
    processor.connect(context.destination);
    processor.onaudioprocess = function (e) {
        if (shouldStop === false) {
            var buffer = String(e.inputBuffer.getChannelData(0));
            ipcRenderer.send("send-voice-data", buffer);
        }
    }

    filterNode.type = 'highpass';
    filterNode.frequency = 10000;
    gainNode.gain.value = 0.5;
}

stopButton.addEventListener("click", function () {
    shouldStop = true;
    // source.disconnect(filterNode);
    console.log(buffer.length);
})

startButton.addEventListener("click", function () {
    shouldStop = false;
    // source.connect(filterNode);
    // filterNode.connect(gainNode);
    // gainNode.connect(context.destination);
})

ipcRenderer.on("send-voice-data", function (event, arg) {
    //console.log(arg);
    var bytes = arg.split(',');
    for (var i = 0; i < bytes.length; i++) {
        buffer.push(parseFloat(bytes[i]));
    }
})