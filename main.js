// node
const path = require('path');
const fs = require('fs');
const { exec } = require("child_process");


// electron
const { app, remote, Menu, Tray, nativeImage, BrowserWindow, ipcMain } = require('electron');
const prompt = require('electron-prompt');
app.dock.hide();

const userDataPath = (app || remote.app).getPath('userData');
const spellsPath = path.join(userDataPath, 'spells');
const ext = '.spell.txt';
let tray = null;
console.log(`App name: ${app.name} Env: ${process.env.NODE_ENV}`)

const getFilePath = (fileName) => {
  return path.join(spellsPath, fileName);
}

const deleteFile =(filePath) => {
  fs.unlinkSync(filePath);
  buildContextMenu();
}

const editFile = (filePath, existingText) => {
  const mainWindow = new BrowserWindow({ title: "Edit Spell", width: 800, height: 600, webPreferences: {nodeIntegration: true, enableRemoteModule: true}});
  ipcMain.on('ready', (event) => {
    event.sender.send('existingText', existingText);
  });
  ipcMain.on('saveText', (event, textToSave) => {
    fs.writeFileSync(filePath, textToSave);
    buildContextMenu();
  });
  mainWindow.on('page-title-updated', function(e) {
    e.preventDefault();
  });
  mainWindow.setTitle('Edit Spell');
  mainWindow.loadURL('file://' + __dirname + '/index.html');
};

const addFile = (name) => {
  const newPath = getFilePath(`${name}${ext}`);
  console.log(`outputting to ..${newPath}`);
  const tmpl = `
#1
/System/Applications/Mail.app/

#2
/System/Applications/Calendar.app/

#3
/System/Applications/Notes.app/
  `;
  editFile(newPath, tmpl.trim());
};

const summon = (fp) => {
  const cmd = `sh sh/summon.sh "${fp}" "${process.env.NODE_ENV === 'development' ? 'Electron' : app.name}"`;
  console.log(cmd);
  exec(cmd, (err, stdout, stderr) => {
    console.log(err);
    console.log(stdout);
    console.log(stderr);
  });
}

const readSpellNames = () => {
  return new Promise((res, rej) => {
    fs.readdir(spellsPath, function(err, filenames) {
  
      if (err) {
        console.log('ERROR',err);
        res([]);
        return;
      }
  
      res(filenames.map((file) => {
        return file.replace(ext, '');
      }));
    });
  });
};

const buildContextMenu = async () => {
  const existingSpells = await readSpellNames();
  const spellsForMenu = [];

  if (existingSpells.length) {
    existingSpells.forEach((spellName) => {
      const fp = getFilePath(`${spellName}${ext}`);
      spellsForMenu.push({
        label: spellName, 
        submenu: [
          { label: 'Summon!', click: async () => {
            summon(fp);
          }},
          {
            label: 'Edit', click: async () => {
              const fileContents = await fs.readFileSync(fp,  'utf8');
              editFile(fp, fileContents); 
            }
          },
          { 
            label: 'Delete', click: async () => {
              deleteFile(fp);
            },
          }
        ]
      });
    });
    spellsForMenu.push({ type: 'separator' });
  }

  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'New Spell..',
      click: (menuItem, bw, e) => {
        prompt({
          title: 'New Spell',
          label: 'Enter a New Spell name (Existing will be overwritten)',
          width: 500,
          height: 300,
          value: 'My Spell',
          inputAttrs: {
            type: 'text'
          },
          type: 'input'
        })
        .then((r) => {
          if(r === null) {
            console.log('user cancelled');
            return 'ok';
          } else {
            if (r && r.trim() !== '') {
              addFile(r.trim());
            }
          }
        })
        .catch(console.error);
      }
    },
    { type: 'separator' },
    ...spellsForMenu,
    { label: 'Quit', role: 'quit' },
  ]);

  tray.setContextMenu(contextMenu);
};

app.on('window-all-closed', e => e.preventDefault() );
app.whenReady().then(async () => {
  if (!fs.existsSync(spellsPath)){
    fs.mkdirSync(spellsPath);
  }
  const icon = nativeImage.createFromPath('assets/summonerTemplate.png');
  tray = new Tray(icon);
  await buildContextMenu();
  tray.setToolTip('Summoner');
  tray.setImage(icon);
  tray.setPressedImage(icon);
})