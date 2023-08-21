const { join } = require("path");
const { app, Menu, MenuItem, BrowserWindow, shell, ipcMain } = require("electron");
const settings = require('electron-settings');
const LanguageDetect = require('languagedetect');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
const globalAny = global;
let language = settings.getSync('spellcheckLanguage') || 'en';
const lngDetector = new LanguageDetect();
lngDetector.setLanguageType("iso2");
let menuAutohide = settings.getSync('menuAutohide') || false;

// console.warn('This is a test.')
// console.warn(lngDetector.detect('This is a test.', 2));
// console.warn()
// console.warn('Ceci est un test.')
// console.warn(lngDetector.detect('Ceci est un test.', 2));
// console.warn()
// console.warn('Das')
// console.warn(lngDetector.detect('Das', 2));
// console.warn()
// console.warn('Das ist')
// console.warn(lngDetector.detect('Das ist', 2));
// console.warn()
// console.warn('Das ist eine')
// console.warn(lngDetector.detect('Das ist eine', 2));
// console.warn()
// console.warn('Das ist eine test.')
// console.warn(lngDetector.detect('Das ist eine test.', 2));

if (process.env.NODE_ENV !== 'development') {
    globalAny.__static = require('path').join(__dirname, '/assets/icons').replace(/\\/g, '\\\\');
}

function setSpellCheckLanguage(lang) {
    win.webContents.session.setSpellCheckerLanguages([lang]);
    settings.set('spellcheckLanguage', lang);
    language = lang;
}

let menu;

const supportedLangs = ['sq', 'hy', 'bg', 'hr', 'cs', 'da', 'nl', 'en', 'et', 'fr', 'de', 'el', 'he', 'hi', 'hu', 'id', 'it', 'ko', 'lv', 'lt', 'nb', 'fa', 'pl', 'pt', 'ro', 'ru', 'sr', 'sh', 'sk', 'sl', 'es', 'sv', 'ta', 'tr', 'uk', 'vi'];

function createWindow() {
    //https://stackoverflow.com/questions/44391448/electron-require-is-not-defined
    ipcMain.on("changeSpellchecker", (event, args) => {
        if(args.length !== 2) return;
        if(language === 'off') return;
        if(!supportedLangs.includes(args)) return;

        setSpellCheckLanguage(args);
        menu.getMenuItemById(`lang-${args}`).checked = true;
    });

    ipcMain.on("detectLang", (event, args) => {
        console.warn(args);
        let detected = lngDetector.detect(args, 2);
        win.webContents.send("detectedLang", detected);
    });

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
            spellcheck: language !== 'off',
            nodeIntegration: false, // is default value after Electron v5
            nodeIntegrationInWorker: false,
            nodeIntegrationInSubFrames: false,
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false, // turn off remote
            preload: join(__dirname.replace('app.asar', ''), "preload.js") // use a preload script
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

    function applyAutohideSettings() {

        if (menuAutohide) {
            win.setAutoHideMenuBar(true);
            win.setMenuBarVisibility(false);
        } else {
            win.setAutoHideMenuBar(false);
            win.setMenuBarVisibility(true);
        }
    }

    applyAutohideSettings();

    const sengiUrl = "https://sengi.nicolas-constant.com";
    //const sengiUrl = "https://11dd-107-159-22-16.ngrok-free.app";
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
                {
                    label: "Menu Autohide",
                    type: 'checkbox',
                    checked: menuAutohide,
                    click: function () {
                        menuAutohide = !menuAutohide;
                        settings.set('menuAutohide', menuAutohide);
                        applyAutohideSettings();
                    }
                },
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
                    id: "lang-sq",
                    label: "Albanian",
                    type: 'radio',
                    checked: language === 'sq',
                    click: function () {
                        setSpellCheckLanguage('sq');
                    }
                },
                {
                    id: "lang-hy",
                    label: "Armenian",
                    type: 'radio',
                    checked: language === 'hy',
                    click: function () {
                        setSpellCheckLanguage('hy');
                    }
                },
                {
                    id: "lang-bg",
                    label: "Bulgarian",
                    type: 'radio',
                    checked: language === 'bg',
                    click: function () {
                        setSpellCheckLanguage('bg');
                    }
                },
                {
                    id: "lang-hr",
                    label: "Croatian",
                    type: 'radio',
                    checked: language === 'hr',
                    click: function () {
                        setSpellCheckLanguage('hr');
                    }
                },
                {
                    id: "lang-cs",
                    label: "Czech",
                    type: 'radio',
                    checked: language === 'cs',
                    click: function () {
                        setSpellCheckLanguage('cs');
                    }
                },
                {
                    id: "lang-da",
                    label: "Danish",
                    type: 'radio',
                    checked: language === 'da',
                    click: function () {
                        setSpellCheckLanguage('da');
                    }
                },
                {
                    id: "lang-nl",
                    label: "Dutch",
                    type: 'radio',
                    checked: language === 'nl',
                    click: function () {
                        setSpellCheckLanguage('nl');
                    }
                },
                {
                    id: "lang-en",
                    label: "English",
                    type: 'radio',
                    checked: language === 'en',
                    click: function () {
                        setSpellCheckLanguage('en');

                        // const possibleLanguages = win.webContents.session.availableSpellCheckerLanguages;
                        // console.warn(possibleLanguages);
                    }
                },
                {
                    id: "lang-et",
                    label: "Estonian",
                    type: 'radio',
                    checked: language === 'et',
                    click: function () {
                        setSpellCheckLanguage('et');
                    }
                },
                {
                    id: "lang-fr",
                    label: "French",
                    type: 'radio',
                    checked: language === 'fr',
                    click: function () {
                        setSpellCheckLanguage('fr');
                    }
                },
                {
                    id: "lang-de",
                    label: "German",
                    type: 'radio',
                    checked: language === 'de',
                    click: function () {
                        setSpellCheckLanguage('de');
                    }
                },
                {
                    id: "lang-el",
                    label: "Greek",
                    type: 'radio',
                    checked: language === 'el',
                    click: function () {
                        setSpellCheckLanguage('el');
                    }
                },
                {
                    id: "lang-he",
                    label: "Hebrew",
                    type: 'radio',
                    checked: language === 'he',
                    click: function () {
                        setSpellCheckLanguage('he');
                    }
                },
                {
                    id: "lang-hi",
                    label: "Hindi",
                    type: 'radio',
                    checked: language === 'hi',
                    click: function () {
                        setSpellCheckLanguage('hi');
                    }
                },
                {
                    id: "lang-hu",
                    label: "Hungarian",
                    type: 'radio',
                    checked: language === 'hu',
                    click: function () {
                        setSpellCheckLanguage('hu');
                    }
                },
                {
                    id: "lang-id",
                    label: "Indonesian",
                    type: 'radio',
                    checked: language === 'id',
                    click: function () {
                        setSpellCheckLanguage('id');
                    }
                },
                {
                    id: "lang-it",
                    label: "Italian",
                    type: 'radio',
                    checked: language === 'it',
                    click: function () {
                        setSpellCheckLanguage('it');
                    }
                },
                {
                    id: "lang-ko",
                    label: "Korean",
                    type: 'radio',
                    checked: language === 'ko',
                    click: function () {
                        setSpellCheckLanguage('ko');
                    }
                },
                {
                    id: "lang-lv",
                    label: "Latvian",
                    type: 'radio',
                    checked: language === 'lv',
                    click: function () {
                        setSpellCheckLanguage('lv');
                    }
                },
                {
                    id: "lang-lt",
                    label: "Lithuanian",
                    type: 'radio',
                    checked: language === 'lt',
                    click: function () {
                        setSpellCheckLanguage('lt');
                    }
                },
                {
                    id: "lang-nb",
                    label: "Norwegian",
                    type: 'radio',
                    checked: language === 'nb',
                    click: function () {
                        setSpellCheckLanguage('nb');
                    }
                },
                {
                    id: "lang-fa",
                    label: "Persian",
                    type: 'radio',
                    checked: language === 'fa',
                    click: function () {
                        setSpellCheckLanguage('fa');
                    }
                },
                {
                    id: "lang-pl",
                    label: "Polish",
                    type: 'radio',
                    checked: language === 'pl',
                    click: function () {
                        setSpellCheckLanguage('pl');
                    }
                },
                {
                    id: "lang-pt",
                    label: "Portuguese",
                    type: 'radio',
                    checked: language === 'pt',
                    click: function () {
                        setSpellCheckLanguage('pt');
                    }
                },
                {
                    id: "lang-ro",
                    label: "Romanian",
                    type: 'radio',
                    checked: language === 'ro',
                    click: function () {
                        setSpellCheckLanguage('ro');
                    }
                },
                {
                    id: "lang-ru",
                    label: "Russian",
                    type: 'radio',
                    checked: language === 'ru',
                    click: function () {
                        setSpellCheckLanguage('ru');
                    }
                },
                {
                    id: "lang-sr",
                    label: "Serbian",
                    type: 'radio',
                    checked: language === 'sr',
                    click: function () {
                        setSpellCheckLanguage('sr');
                    }
                },
                {
                    id: "lang-sh",
                    label: "Serbo-Croatian",
                    type: 'radio',
                    checked: language === 'sh',
                    click: function () {
                        setSpellCheckLanguage('sh');
                    }
                },
                {
                    id: "lang-sk",
                    label: "Slovak",
                    type: 'radio',
                    checked: language === 'sk',
                    click: function () {
                        setSpellCheckLanguage('sk');
                    }
                },                
                {
                    id: "lang-sl",
                    label: "Slovenian",
                    type: 'radio',
                    checked: language === 'sl',
                    click: function () {
                        setSpellCheckLanguage('sl');
                    }
                },
                {
                    id: "lang-es",
                    label: "Spanish",
                    type: 'radio',
                    checked: language === 'es',
                    click: function () {
                        setSpellCheckLanguage('es');
                    }
                },
                {
                    id: "lang-sv",
                    label: "Swedish",
                    type: 'radio',
                    checked: language === 'sv',
                    click: function () {
                        setSpellCheckLanguage('sv');
                    }
                },
                {
                    id: "lang-ta",
                    label: "Tamil",
                    type: 'radio',
                    checked: language === 'ta',
                    click: function () {
                        setSpellCheckLanguage('ta');
                    }
                },
                {
                    id: "lang-tr",
                    label: "Turkish",
                    type: 'radio',
                    checked: language === 'tr',
                    click: function () {
                        setSpellCheckLanguage('tr');
                    }
                },
                {
                    id: "lang-uk",
                    label: "Ukrainian",
                    type: 'radio',
                    checked: language === 'uk',
                    click: function () {
                        setSpellCheckLanguage('uk');
                    }
                },
                {
                    id: "lang-vi",
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
        }, 
        {
            label: "Patreon",
            click: function(){
                require("electron").shell.openExternal(
                    "https://patreon.com/nicolasconstant"
                );
            }
        }
    ];

    menu = Menu.buildFromTemplate(template);
    win.setMenu(menu);
    //Menu.setApplicationMenu(menu);


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
