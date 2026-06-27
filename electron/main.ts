import { app, BrowserWindow, Menu, dialog, ipcMain } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { spawn, ChildProcess } from 'node:child_process' // Импортируем spawn для управления процессами

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null = null // Изменено на let согласно логике инициализации
let serverProcess: ChildProcess | null = null // Переменная для хранения процесса FastAPI-сервера

/**
 * Функция автоматического запуска и контроля Python-сервера
 */
function startBackendServer() {
  const isDev = !!VITE_DEV_SERVER_URL;

  if (isDev) {
    // Режим разработки: запускаем скрипт main.py в вашей папке backend через системный Python
    const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';
    const scriptPath = path.join(process.env.APP_ROOT, 'backend', 'main.py');

    console.log(`[Electron] Запуск Python-сервера разработки: ${scriptPath}`);
    serverProcess = spawn(pythonCommand, [scriptPath]);
  } else {
    // Продакшн режим: запускаем именно ваш скомпилированный бинарник SMV_Server.exe
    // При сборке приложения он будет находиться в папке resources
    const serverExePath = path.join(process.resourcesPath, 'SMV_Server.exe');

    console.log(`[Electron] Запуск бинарного файла сервера: ${serverExePath}`);
    serverProcess = spawn(serverExePath);
  }

  // Перенаправляем логи вывода сервера в терминал Электрона для отладки
  serverProcess.stdout?.on('data', (data) => {
    console.log(`[Python Server Log]: ${data.toString().trim()}`);
  });

  serverProcess.stderr?.on('data', (data) => {
    console.error(`[Python Server Error]: ${data.toString().trim()}`);
  });
}

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    minHeight: 600,
    minWidth: 1000,
    icon: path.join(process.env.VITE_PUBLIC, 'icon-white.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// ====================================================================
// Управление жизненным циклом приложения agent-interpreter-ui
// ====================================================================

// Запуск сервера и создание окна при готовности приложения
app.whenReady().then(() => {
  Menu.setApplicationMenu(null)
  startBackendServer() // Сначала поднимаем бэкенд на порту 8000
  createWindow()       // Затем инициализируем графический интерфейс
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // Обязательно убиваем процесс сервера перед выходом,
    // чтобы порт 8000 не оставался занятым в Windows!
    if (serverProcess) {
      serverProcess.kill();
      console.log('[Electron] Процесс Python-сервера успешно остановлен.');
    }
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Дополнительная страховка на случай закрытия приложения через консоль или диспетчер задач
app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
})