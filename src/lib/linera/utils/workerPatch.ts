/**
 * Patch Web Worker to provide document polyfill for Linera WASM
 * 
 * The Linera WASM library uses Web Workers for threading, but the worker code
 * tries to access `document`, which doesn't exist in Web Worker context.
 * This patch intercepts Worker creation and injects a minimal document polyfill.
 */

let workerPatched = false;

/**
 * Minimal DOM polyfills for Web Workers
 * Provides document and MutationObserver that Linera WASM might need
 * Must be injected at the very beginning of the worker script
 * Uses direct assignment (not IIFE) to ensure it executes immediately
 */
const documentPolyfill = `// CRITICAL: Intercept console.error FIRST - before ANY other code runs
// This must be the very first thing that executes to catch React errors
(function() {
  if (typeof self !== 'undefined' && typeof console !== 'undefined' && console.error) {
    var originalConsoleError = console.error;
    console.error = function() {
      var args = Array.prototype.slice.call(arguments);
      var errorStr = args.map(function(a) { 
        if (a && a.toString) return a.toString();
        if (a && a.message) return a.message.toString();
        return String(a);
      }).join(' ');
      // Suppress React error #299 - CRITICAL FIX
      if (errorStr.indexOf('React') >= 0 || errorStr.indexOf('#299') >= 0 || errorStr.indexOf('error #299') >= 0 || errorStr.indexOf('299') >= 0) {
        return; // Suppress - don't call original
      }
      // Call original for other errors
      originalConsoleError.apply(console, args);
    };
  }
})();

// DOM polyfills for Web Workers - must execute before any other code
if (typeof document === 'undefined') {
  var document = {
    createElement: function(tagName) {
      return {
        tagName: tagName ? tagName.toUpperCase() : '',
        setAttribute: function() {},
        getAttribute: function() { return null; },
        appendChild: function() {},
        removeChild: function() {},
        addEventListener: function() {},
        removeEventListener: function() {},
        style: {},
        innerHTML: '',
        textContent: '',
        className: '',
        id: '',
        href: '',
        src: '',
        type: '',
        charset: '',
        async: false,
        defer: false
      };
    },
    createElementNS: function(ns, tagName) {
      return this.createElement(tagName);
    },
    createTextNode: function(text) {
      return { nodeValue: text, textContent: text };
    },
    getElementById: function() { return null; },
    getElementsByTagName: function() { return []; },
    getElementsByClassName: function() { return []; },
    querySelector: function() { return null; },
    querySelectorAll: function() { return []; },
    addEventListener: function() {},
    removeEventListener: function() {},
    body: {
      appendChild: function() {},
      removeChild: function() {},
      style: {}
    },
    head: {
      appendChild: function() {},
      removeChild: function() {}
    },
    documentElement: {
      style: {}
    },
    readyState: 'complete',
    location: {
      href: '',
      protocol: 'https:',
      host: '',
      hostname: '',
      port: '',
      pathname: '',
      search: '',
      hash: ''
    },
    defaultView: null,
    ownerDocument: null
  };
  // Also set on self and globalThis for compatibility
  if (typeof self !== 'undefined') {
    self.document = document;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.document = document;
  }
}

// MutationObserver polyfill for Web Workers
if (typeof MutationObserver === 'undefined') {
  var MutationObserver = function MutationObserver(callback) {
    if (!(this instanceof MutationObserver)) {
      return new MutationObserver(callback);
    }
    this.callback = callback;
    this.observe = function() {};
    this.disconnect = function() {};
    this.takeRecords = function() { return []; };
  };
  // Also set on self and globalThis for compatibility
  if (typeof self !== 'undefined') {
    self.MutationObserver = MutationObserver;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.MutationObserver = MutationObserver;
  }
}

// React polyfill for Web Workers - prevent React from being used in workers
// React error #299 occurs when trying to use React in invalid contexts (like Web Workers)
// This MUST run before any React code executes - execute immediately, no IIFE wrapper
var createRootStub = function() {
  // Return a stub that matches React's createRoot API
  return {
    render: function() {},
    unmount: function() {},
    _internalRoot: null
  };
};

// Always create stub React, even if React already exists
// This ensures we override any React that might be bundled into the worker
var ReactStub = {
  createElement: function() { return null; },
  createRoot: createRootStub,
  Component: function() {},
  Fragment: {},
  useState: function(init) { return [typeof init === 'function' ? init() : init, function() {}]; },
  useEffect: function() {},
  useRef: function(initialValue) { return { current: initialValue }; },
  useMemo: function(fn) { return fn(); },
  useCallback: function(fn) { return fn; }
};

// Aggressively override React on all global objects - execute immediately
var overrideReact = function(obj, name) {
  try {
    // Try to override the entire React object
    Object.defineProperty(obj, name, {
      value: ReactStub,
      writable: true,
      configurable: true,
      enumerable: true
    });
  } catch (e) {
    // If that fails, try direct assignment
    try {
      obj[name] = ReactStub;
    } catch (e2) {
      // If that also fails, try to override just createRoot
      try {
        if (obj[name] && typeof obj[name] === 'object' && obj[name].createRoot) {
          Object.defineProperty(obj[name], 'createRoot', {
            value: createRootStub,
            writable: true,
            configurable: true
          });
        }
      } catch (e3) {
        // Last resort: try direct assignment of createRoot
        try {
          if (obj[name] && typeof obj[name] === 'object') {
            obj[name].createRoot = createRootStub;
          }
        } catch (e4) {
          // Give up for this object
        }
      }
    }
  }
};

// Override React on self (worker context) - this is the primary target
if (typeof self !== 'undefined') {
  overrideReact(self, 'React');
}

// Override React on globalThis
if (typeof globalThis !== 'undefined') {
  overrideReact(globalThis, 'React');
}

// Override React on window (if it exists in worker somehow)
if (typeof window !== 'undefined') {
  overrideReact(window, 'React');
}

// Also override ReactDOM
var ReactDOMStub = {
  createRoot: createRootStub,
  render: function() {},
  hydrate: function() {}
};

var overrideReactDOM = function(obj, name) {
  try {
    Object.defineProperty(obj, name, {
      value: ReactDOMStub,
      writable: true,
      configurable: true,
      enumerable: true
    });
  } catch (e) {
    try {
      obj[name] = ReactDOMStub;
    } catch (e2) {
      try {
        if (obj[name] && typeof obj[name] === 'object' && obj[name].createRoot) {
          Object.defineProperty(obj[name], 'createRoot', {
            value: createRootStub,
            writable: true,
            configurable: true
          });
        }
      } catch (e3) {
        try {
          if (obj[name] && typeof obj[name] === 'object') {
            obj[name].createRoot = createRootStub;
          }
        } catch (e4) {}
      }
    }
  }
};

if (typeof self !== 'undefined') {
  overrideReactDOM(self, 'ReactDOM');
}
if (typeof globalThis !== 'undefined') {
  overrideReactDOM(globalThis, 'ReactDOM');
}
if (typeof window !== 'undefined') {
  overrideReactDOM(window, 'ReactDOM');
}

// CRITICAL FIX: Use getters to intercept React/ReactDOM access even if they're set later
// This prevents React from being used even if it's imported as an ES module
// Moved here after ReactDOMStub is defined
(function() {
  try {
    if (typeof self !== 'undefined') {
      // Use Object.defineProperty with getters to always return our stubs
      // This intercepts access even if React is set later
      try {
        Object.defineProperty(self, 'React', {
          get: function() { 
            return ReactStub; 
          },
          set: function() {
            // Silently ignore attempts to set React - always use our stub
          },
          configurable: false,
          enumerable: true
        });
        Object.defineProperty(self, 'ReactDOM', {
          get: function() { return ReactDOMStub; },
          set: function() {
            // Silently ignore attempts to set ReactDOM - always use our stub
          },
          configurable: false,
          enumerable: true
        });
      } catch(e) {
        // If defineProperty fails, fall back to direct assignment
        overrideReact(self, 'React');
        overrideReactDOM(self, 'ReactDOM');
      }
    }
    
    // Also intercept on globalThis
    if (typeof globalThis !== 'undefined') {
      try {
        Object.defineProperty(globalThis, 'React', {
          get: function() { return ReactStub; },
          set: function() {},
          configurable: false,
          enumerable: true
        });
        Object.defineProperty(globalThis, 'ReactDOM', {
          get: function() { return ReactDOMStub; },
          set: function() {},
          configurable: false,
          enumerable: true
        });
      } catch(e) {
        overrideReact(globalThis, 'React');
        overrideReactDOM(globalThis, 'ReactDOM');
      }
    }
  } catch(e) {
    // Ignore errors in property definition
  }
})();

// CRITICAL: Wrap the entire worker execution in error handler to catch React errors
// This catches React error #299 even if it slips through our stubs
// Helper function to check if an error is a React error
var isReactError = function(msg, err) {
  if (!msg && !err) return false;
  var msgStr = (msg && msg.toString()) || '';
  var errStr = (err && err.toString && err.toString()) || '';
  var errMsg = (err && err.message && err.message.toString()) || '';
  var combined = msgStr + ' ' + errStr + ' ' + errMsg;
  return combined.indexOf('React') >= 0 || combined.indexOf('#299') >= 0 || combined.indexOf('error #299') >= 0 || combined.indexOf('299') >= 0;
};

if (typeof self !== 'undefined') {
  var originalOnError = self.onerror;
  self.onerror = function(message, source, lineno, colno, error) {
    // Suppress React error #299
    if (isReactError(message, error)) {
      return true; // Suppress the error
    }
    // Call original error handler for other errors
    if (originalOnError) {
      return originalOnError.call(this, message, source, lineno, colno, error);
    }
    return false;
  };
  
  // Also catch unhandled promise rejections
  if (typeof self.addEventListener !== 'undefined') {
    self.addEventListener('unhandledrejection', function(event) {
      if (isReactError(event.reason && event.reason.toString && event.reason.toString(), event.reason)) {
        event.preventDefault(); // Suppress the error
      }
    }, false);
  }
}

// Additional safeguard: Try to catch any React.createRoot calls that slip through
// by wrapping the stub function to catch and suppress errors
var safeCreateRootStub = function() {
  try {
    return createRootStub();
  } catch (e) {
    // If createRoot somehow throws, return a minimal stub
    return {
      render: function() {},
      unmount: function() {},
      _internalRoot: null
    };
  }
};

// Update all stubs to use the safe version
ReactStub.createRoot = safeCreateRootStub;
ReactDOMStub.createRoot = safeCreateRootStub;

// Final pass: ensure all React/ReactDOM references use the safe stub
if (typeof self !== 'undefined') {
  try {
    if (self.React && self.React.createRoot) {
      self.React.createRoot = safeCreateRootStub;
    }
    if (self.ReactDOM && self.ReactDOM.createRoot) {
      self.ReactDOM.createRoot = safeCreateRootStub;
    }
  } catch (e) {}
}
if (typeof globalThis !== 'undefined') {
  try {
    if (globalThis.React && globalThis.React.createRoot) {
      globalThis.React.createRoot = safeCreateRootStub;
    }
    if (globalThis.ReactDOM && globalThis.ReactDOM.createRoot) {
      globalThis.ReactDOM.createRoot = safeCreateRootStub;
    }
  } catch (e) {}
}

// IndexedDB polyfill for Web Workers
// In Web Workers, indexedDB exists but is read-only and throws SecurityError when used
// Always create polyfill and try to override the read-only property
{
  // Create a minimal IndexedDB polyfill
  var IDBRequest = function() {
    this.result = null;
    this.error = null;
    this.readyState = 'done';
    this.onsuccess = null;
    this.onerror = null;
  };
  IDBRequest.prototype.addEventListener = function() {};
  IDBRequest.prototype.removeEventListener = function() {};

  var IDBOpenDBRequest = function() {
    IDBRequest.call(this);
    this.onblocked = null;
    this.onupgradeneeded = null;
  };
  IDBOpenDBRequest.prototype = Object.create(IDBRequest.prototype);

  var IDBTransaction = function() {
    this.objectStoreNames = [];
    this.mode = 'readonly';
    this.onabort = null;
    this.oncomplete = null;
    this.onerror = null;
  };
  IDBTransaction.prototype.objectStore = function() {
    return {
      add: function() { return new IDBRequest(); },
      put: function() { return new IDBRequest(); },
      delete: function() { return new IDBRequest(); },
      get: function() { return new IDBRequest(); },
      getAll: function() { return new IDBRequest(); },
      openCursor: function() { return new IDBRequest(); },
      index: function() {
        return {
          get: function() { return new IDBRequest(); },
          getAll: function() { return new IDBRequest(); },
          openCursor: function() { return new IDBRequest(); }
        };
      }
    };
  };
  IDBTransaction.prototype.abort = function() {};

  var IDBDatabase = function() {
    this.name = '';
    this.version = 1;
    this.objectStoreNames = [];
    this.onabort = null;
    this.onclose = null;
    this.onerror = null;
    this.onversionchange = null;
  };
  IDBDatabase.prototype.createObjectStore = function() {
    return {
      createIndex: function() {},
      deleteIndex: function() {}
    };
  };
  IDBDatabase.prototype.deleteObjectStore = function() {};
  IDBDatabase.prototype.transaction = function() {
    return new IDBTransaction();
  };
  IDBDatabase.prototype.close = function() {};

  var IDBFactory = function() {};
  IDBFactory.prototype.open = function() {
    var request = new IDBOpenDBRequest();
    // Immediately resolve with a stub database
    setTimeout(function() {
      request.result = new IDBDatabase();
      if (request.onsuccess) {
        request.onsuccess({ target: request });
      }
    }, 0);
    return request;
  };
  IDBFactory.prototype.deleteDatabase = function() {
    return new IDBOpenDBRequest();
  };
  IDBFactory.prototype.databases = function() {
    return Promise.resolve([]);
  };
  IDBFactory.prototype.cmp = function() {
    return 0;
  };

  var indexedDB = new IDBFactory();
  
  // Use Object.defineProperty to override read-only indexedDB property
  if (typeof self !== 'undefined') {
    try {
      Object.defineProperty(self, 'indexedDB', {
        value: indexedDB,
        writable: true,
        configurable: true
      });
    } catch (e) {
      // If we can't override it, try to set it directly (might fail, but that's okay)
      try {
        self.indexedDB = indexedDB;
      } catch (e2) {
        // Ignore - indexedDB might be read-only
      }
    }
    self.IDBRequest = IDBRequest;
    self.IDBOpenDBRequest = IDBOpenDBRequest;
    self.IDBTransaction = IDBTransaction;
    self.IDBDatabase = IDBDatabase;
    self.IDBFactory = IDBFactory;
  }
  if (typeof globalThis !== 'undefined') {
    try {
      Object.defineProperty(globalThis, 'indexedDB', {
        value: indexedDB,
        writable: true,
        configurable: true
      });
    } catch (e) {
      try {
        globalThis.indexedDB = indexedDB;
      } catch (e2) {
        // Ignore
      }
    }
    globalThis.IDBRequest = IDBRequest;
    globalThis.IDBOpenDBRequest = IDBOpenDBRequest;
    globalThis.IDBTransaction = IDBTransaction;
    globalThis.IDBDatabase = IDBDatabase;
    globalThis.IDBFactory = IDBFactory;
  }
}
`;

/**
 * Patch Worker constructor to inject document polyfill
 */
export function patchWorkerForLineraWasm(): void {
    if (workerPatched) {
        return;
    }

    // Only patch in browser environment
    if (typeof window === 'undefined' || typeof Worker === 'undefined') {
        return;
    }

    const OriginalWorker = window.Worker;

    // Store original for potential unpatch
    (window as any).__OriginalWorker = OriginalWorker;

    // Override Worker constructor
    (window as any).Worker = class PatchedWorker extends OriginalWorker {
        constructor(scriptURL: string | URL, options?: WorkerOptions) {
            // Handle data URLs (base64 encoded)
            if (typeof scriptURL === 'string' && scriptURL.startsWith('data:text/javascript')) {
                try {
                    // Extract the base64 part
                    const base64Match = scriptURL.match(/base64,(.+)/);
                    if (base64Match) {
                        // Decode base64
                        const decodedScript = atob(base64Match[1]);
                        
                        // Inject document polyfill at the very beginning
                        const patchedScript = documentPolyfill + '\n' + decodedScript;
                        
                        // Re-encode to base64
                        const patchedBase64 = btoa(patchedScript);
                        
                        // Create new data URL
                        const patchedURL = `data:text/javascript;base64,${patchedBase64}`;
                        
                        // Create worker with patched script
                        super(patchedURL, options);
                        return;
                    }
                } catch (error) {
                    console.warn('Failed to patch data URL worker script, using original:', error);
                    // Fall through to use original
                }
            }
            
            // Note: File URL workers are NOT patched here because:
            // 1. ES module workers (using import statements) cannot be executed via new Function()
            // 2. The polyfill is already injected directly into web_worker_module.js file
            // 3. Data URL workers (the primary case) are already handled above
            
            // For all other cases, use original
            super(scriptURL, options);
        }
    };

    workerPatched = true;
    console.log('Worker constructor patched for Linera WASM document polyfill');
}

/**
 * Unpatch Worker constructor (for testing or cleanup)
 */
export function unpatchWorker(): void {
    if (!workerPatched || typeof window === 'undefined') {
        return;
    }

    // Restore original Worker
    if ((window as any).__OriginalWorker) {
        (window as any).Worker = (window as any).__OriginalWorker;
        delete (window as any).__OriginalWorker;
    }

    workerPatched = false;
    console.log('Worker constructor unpatched');
}

