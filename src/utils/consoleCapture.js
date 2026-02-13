const MAX_ENTRIES = 500;
let logEntries = [];
let listeners = [];
let initialized = false;

function formatArg(arg) {
  if (arg === null) return 'null';
  if (arg === undefined) return 'undefined';
  if (typeof arg === 'string') return arg;
  if (arg instanceof Error) return `${arg.name}: ${arg.message}\n${arg.stack || ''}`;
  try {
    return JSON.stringify(arg, null, 2);
  } catch {
    return String(arg);
  }
}

function createEntry(type, args) {
  return {
    id: Date.now() + '-' + Math.random().toString(36).substr(2, 6),
    type,
    message: args.map(formatArg).join(' '),
    timestamp: new Date().toISOString(),
  };
}

function notifyListeners() {
  listeners.forEach(fn => fn([...logEntries]));
}

export function initConsoleCapture() {
  if (initialized) return;
  initialized = true;

  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalInfo = console.info;

  console.log = (...args) => {
    originalLog.apply(console, args);
    const entry = createEntry('log', args);
    logEntries = [entry, ...logEntries].slice(0, MAX_ENTRIES);
    notifyListeners();
  };

  console.warn = (...args) => {
    originalWarn.apply(console, args);
    const entry = createEntry('warn', args);
    logEntries = [entry, ...logEntries].slice(0, MAX_ENTRIES);
    notifyListeners();
  };

  console.error = (...args) => {
    originalError.apply(console, args);
    const entry = createEntry('error', args);
    logEntries = [entry, ...logEntries].slice(0, MAX_ENTRIES);
    notifyListeners();
  };

  console.info = (...args) => {
    originalInfo.apply(console, args);
    const entry = createEntry('info', args);
    logEntries = [entry, ...logEntries].slice(0, MAX_ENTRIES);
    notifyListeners();
  };

  window.addEventListener('error', (event) => {
    const entry = createEntry('error', [`Uncaught: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`]);
    logEntries = [entry, ...logEntries].slice(0, MAX_ENTRIES);
    notifyListeners();
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason instanceof Error ? event.reason.message : String(event.reason);
    const entry = createEntry('error', [`Unhandled Promise Rejection: ${reason}`]);
    logEntries = [entry, ...logEntries].slice(0, MAX_ENTRIES);
    notifyListeners();
  });
}

export function getLogEntries() {
  return [...logEntries];
}

export function clearLogEntries() {
  logEntries = [];
  notifyListeners();
}

export function subscribeToLogs(callback) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter(fn => fn !== callback);
  };
}
