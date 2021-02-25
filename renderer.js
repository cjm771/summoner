// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const { ipcRenderer } = require('electron');

ipcRenderer.send('ready');
ipcRenderer.on('existingText', function (event, text) {
  console.log(text); // text
  document.querySelector('textarea').value = text;
});

document.querySelector('.primary').addEventListener('click', () => {
  ipcRenderer.send('saveText', document.querySelector('textarea').value);
  window.close();
})

document.querySelector('.secondary').addEventListener('click', () => {
  window.close();
})