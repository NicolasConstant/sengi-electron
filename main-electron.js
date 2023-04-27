const { join } = require("path");
const { app, Menu, MenuItem, BrowserWindow, shell } = require("electron");
const settings = require('electron-settings');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
const globalAny = global;
let language = settings.getSync('spellcheckLanguage') || 'en-US';

if (process.env.NODE_ENV !== 'development') {
    globalAny.__static = require('path').join(__dirname, '/assets/icons').replace(/\\/g, '\\\\');
}

function setSpellCheckLanguage(lang) {
    win.webContents.session.setSpellCheckerLanguages([lang]);
    settings.set('spellcheckLanguage', lang);
    language = lang;
}

function createWindow() {
    // Set icon
    let icon = join(globalAny.__static, '/png/512x512.png');
    if (process.platform === "win32") {
        icon = join(globalAny.__static, '/win/icon.ico');
    }

    // Create the browser window
    win = new BrowserWindow({
        width: 377,
        height: 800,
        title: "Sengi",
        icon: icon,
        backgroundColor: "#131925",
        useContentSize: true,
        webPreferences: {
            spellcheck: language !== 'off'
        }
        // webPreferences: {
        //     contextIsolation: true,
        //     nodeIntegration: false,
        //     nodeIntegrationInWorker: false
        //   }
    });

    win.webContents.on('context-menu', (event, params) => {
        const menu = new Menu()

        // Add each spelling suggestion
        for (const suggestion of params.dictionarySuggestions) {
            menu.append(new MenuItem({
                label: suggestion,
                click: () => win.webContents.replaceMisspelling(suggestion)
            }))
        }

        // Allow users to add the misspelled word to the dictionary
        if (params.misspelledWord) {
            menu.append(
                new MenuItem({
                    label: 'Add to dictionary',
                    click: () => win.webContents.session.addWordToSpellCheckerDictionary(params.misspelledWord)
                })
            )
        }

        menu.popup()
    });

    win.setAutoHideMenuBar(true);
    win.setMenuBarVisibility(false);

    const sengiUrl = "https://sengi.nicolas-constant.com";
    win.loadURL(sengiUrl);

    const template = [
        {
            label: "View",
            submenu: [
                {
                    label: "Return on Sengi",
                    click() {
                        win.loadURL(sengiUrl);
                    }
                },
                { type: "separator" },
                { role: "reload" },
                { role: "forcereload" },
                { type: "separator" },
                { role: "resetzoom" },
                { role: "zoomin", accelerator: "CommandOrControl+numadd" },
                { role: "zoomout", accelerator: "CommandOrControl+numsub" },
                { type: "separator" },
                { role: "togglefullscreen" },
                { type: "separator" },
                { role: "close" },
                { role: "quit" }
            ]
        },
        {
            label: "SpellCheck",
            submenu: [
                {
                    label: "Off (need restart)",
                    type: 'radio',
                    checked: language === 'off',
                    click: function () {                        
                        settings.set('spellcheckLanguage', 'off');
                        language = 'off';
                    }
                },
                {
                    label: "Afrikaans",
                    type: 'radio',
                    checked: language === 'af',
                    click: function () {
                        setSpellCheckLanguage('af');
                    }
                },
                {
                    label: "Bulgarian",
                    type: 'radio',
                    checked: language === 'bg',
                    click: function () {
                        setSpellCheckLanguage('bg');
                    }
                },
                {
                    label: "Czech",
                    type: 'radio',
                    checked: language === 'cs',
                    click: function () {
                        setSpellCheckLanguage('cs');
                    }
                },
                {
                    label: "Danish",
                    type: 'radio',
                    checked: language === 'da',
                    click: function () {
                        setSpellCheckLanguage('da');
                    }
                },
                {
                    label: "German",
                    type: 'radio',
                    checked: language === 'de',
                    click: function () {
                        setSpellCheckLanguage('de');
                    }
                },
                {
                    label: "Greek",
                    type: 'radio',
                    checked: language === 'el',
                    click: function () {
                        setSpellCheckLanguage('el');
                    }
                },
                {
                    label: "English",
                    type: 'radio',
                    checked: language === 'en-US',
                    click: function () {
                        setSpellCheckLanguage('en-US');

                        // const possibleLanguages = win.webContents.session.availableSpellCheckerLanguages;
                        // console.warn(possibleLanguages);
                    }
                },
                {
                    label: "Spanish",
                    type: 'radio',
                    checked: language === 'es',
                    click: function () {
                        setSpellCheckLanguage('es');
                    }
                },
                {
                    label: "Estonian",
                    type: 'radio',
                    checked: language === 'et',
                    click: function () {
                        setSpellCheckLanguage('et');
                    }
                },
                {
                    label: "Persian",
                    type: 'radio',
                    checked: language === 'fa',
                    click: function () {
                        setSpellCheckLanguage('fa');
                    }
                },
                {
                    label: "French",
                    type: 'radio',
                    checked: language === 'fr-FR',
                    click: function () {
                        setSpellCheckLanguage('fr-FR');
                    }
                },
                {
                    label: "Hebrew",
                    type: 'radio',
                    checked: language === 'he',
                    click: function () {
                        setSpellCheckLanguage('he');
                    }
                },
                {
                    label: "Hindi",
                    type: 'radio',
                    checked: language === 'hi',
                    click: function () {
                        setSpellCheckLanguage('hi');
                    }
                },
                {
                    label: "Croatian",
                    type: 'radio',
                    checked: language === 'hr',
                    click: function () {
                        setSpellCheckLanguage('hr');
                    }
                },
                {
                    label: "Hungarian",
                    type: 'radio',
                    checked: language === 'hu',
                    click: function () {
                        setSpellCheckLanguage('hu');
                    }
                },
                {
                    label: "Armenian",
                    type: 'radio',
                    checked: language === 'hy',
                    click: function () {
                        setSpellCheckLanguage('hy');
                    }
                },
                {
                    label: "Indonesian",
                    type: 'radio',
                    checked: language === 'id',
                    click: function () {
                        setSpellCheckLanguage('id');
                    }
                },
                {
                    label: "Italian",
                    type: 'radio',
                    checked: language === 'it-IT',
                    click: function () {
                        setSpellCheckLanguage('it-IT');
                    }
                },
                {
                    label: "Korean",
                    type: 'radio',
                    checked: language === 'ko',
                    click: function () {
                        setSpellCheckLanguage('ko');
                    }
                },
                {
                    label: "Lithuanian",
                    type: 'radio',
                    checked: language === 'lt',
                    click: function () {
                        setSpellCheckLanguage('lt');
                    }
                },
                {
                    label: "Latvian",
                    type: 'radio',
                    checked: language === 'lv',
                    click: function () {
                        setSpellCheckLanguage('lv');
                    }
                },
                {
                    label: "Norwegian",
                    type: 'radio',
                    checked: language === 'nb',
                    click: function () {
                        setSpellCheckLanguage('nb');
                    }
                },
                {
                    label: "Dutch",
                    type: 'radio',
                    checked: language === 'nl',
                    click: function () {
                        setSpellCheckLanguage('nl');
                    }
                },
                {
                    label: "Polish",
                    type: 'radio',
                    checked: language === 'pl',
                    click: function () {
                        setSpellCheckLanguage('pl');
                    }
                },
                {
                    label: "Portuguese",
                    type: 'radio',
                    checked: language === 'pt',
                    click: function () {
                        setSpellCheckLanguage('pt');
                    }
                },
                {
                    label: "Romanian",
                    type: 'radio',
                    checked: language === 'ro',
                    click: function () {
                        setSpellCheckLanguage('ro');
                    }
                },
                {
                    label: "Russian",
                    type: 'radio',
                    checked: language === 'ru',
                    click: function () {
                        setSpellCheckLanguage('ru');
                    }
                },
                {
                    label: "Serbo-Croatian",
                    type: 'radio',
                    checked: language === 'sh',
                    click: function () {
                        setSpellCheckLanguage('sh');
                    }
                },
                {
                    label: "Slovak",
                    type: 'radio',
                    checked: language === 'sk',
                    click: function () {
                        setSpellCheckLanguage('sk');
                    }
                },
                {
                    label: "Slovenian",
                    type: 'radio',
                    checked: language === 'sl',
                    click: function () {
                        setSpellCheckLanguage('sl');
                    }
                },
                {
                    label: "Albanian",
                    type: 'radio',
                    checked: language === 'sq',
                    click: function () {
                        setSpellCheckLanguage('sq');
                    }
                },
                {
                    label: "Serbian",
                    type: 'radio',
                    checked: language === 'sr',
                    click: function () {
                        setSpellCheckLanguage('sr');
                    }
                },
                {
                    label: "Swedish",
                    type: 'radio',
                    checked: language === 'sv',
                    click: function () {
                        setSpellCheckLanguage('sv');
                    }
                },
                {
                    label: "Tamil",
                    type: 'radio',
                    checked: language === 'ta',
                    click: function () {
                        setSpellCheckLanguage('ta');
                    }
                },
                {
                    label: "Turkish",
                    type: 'radio',
                    checked: language === 'tr',
                    click: function () {
                        setSpellCheckLanguage('tr');
                    }
                },
                {
                    label: "Ukrainian",
                    type: 'radio',
                    checked: language === 'uk',
                    click: function () {
                        setSpellCheckLanguage('uk');
                    }
                },
                {
                    label: "Vietnamese",
                    type: 'radio',
                    checked: language === 'vi',
                    click: function () {
                        setSpellCheckLanguage('vi');
                    }
                }        
            ]
        },
        {
            role: "help",
            submenu: [
                { role: "toggledevtools" },
                {
                    label: "Open GitHub project",
                    click() {
                        require("electron").shell.openExternal(
                            "https://github.com/NicolasConstant/sengi"
                        );
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    win.setMenu(menu);

    // Check if we are on a MAC
    if (process.platform === "darwin") {
        // Create our menu entries so that we can use MAC shortcuts
        Menu.setApplicationMenu(
            Menu.buildFromTemplate([
                {
                    label: "Sengi",
                    submenu: [
                        { role: "close" },
                        { role: 'quit' }
                    ]
                },
                // {
                //     label: "File",
                //     submenu: [                       
                //     ]
                // },
                {
                    label: "Edit",
                    submenu: [
                        { role: "undo" },
                        { role: "redo" },
                        { type: "separator" },
                        { role: "cut" },
                        { role: "copy" },
                        { role: "paste" },
                        { role: "pasteandmatchstyle" },
                        { role: "delete" },
                        { role: "selectall" }
                    ]
                },
                // {
                //     label: "Format",
                //     submenu: [
                //     ]
                // },
                {
                    label: "View",
                    submenu: [
                        {
                            label: "Return on Sengi",
                            click() {
                                win.loadURL(sengiUrl);
                            }
                        },
                        { type: "separator" },
                        { role: "reload" },
                        { role: "forcereload" },
                        { type: 'separator' },
                        { role: 'togglefullscreen' }
                    ]
                },
                // {
                //     label: "Window",
                //     submenu: [
                //     ]
                // },
                {
                    role: "Help",
                    submenu: [
                        { role: "toggledevtools" },
                        {
                            label: "Open GitHub project",
                            click() {
                                require("electron").shell.openExternal(
                                    "https://github.com/NicolasConstant/sengi"
                                );
                            }
                        }
                    ]
                }
            ])
        );
    }

    //open external links to browser
    win.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    // Emitted when the window is closed.
    win.on("closed", () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });

    // win.webContents.on('context-menu', (event, params) => {
    //     const menu = new Menu();

    //     // Add each spelling suggestion
    //     for (const suggestion of params.dictionarySuggestions) {
    //         menu.append(new MenuItem({
    //             label: suggestion,
    //             click: () => mainWindow.webContents.replaceMisspelling(suggestion)
    //         }));
    //     }

    //     // Allow users to add the misspelled word to the dictionary
    //     if (params.misspelledWord) {
    //         menu.append(
    //             new MenuItem({
    //                 label: 'Add to dictionary',
    //                 click: () => mainWindow.webContents.session.addWordToSpellCheckerDictionary(params.misspelledWord)
    //             }));
    //     }

    //     menu.popup();
    // });
}

app.commandLine.appendSwitch("force-color-profile", "srgb");


const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (win) {
            if (win.isMinimized()) win.restore()
            win.focus()
        }
    });

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on("ready", createWindow);
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});
