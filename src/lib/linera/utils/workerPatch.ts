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
const documentPolyfill = `// DOM polyfills for Web Workers - must execute before any other code
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
            // If it's a data URL (base64), we need to decode, patch, and re-encode
            if (typeof scriptURL === 'string' && scriptURL.startsWith('data:text/javascript')) {
                try {
                    // Extract the base64 part
                    const base64Match = scriptURL.match(/base64,(.+)/);
                    if (base64Match) {
                        // Decode base64
                        const decodedScript = atob(base64Match[1]);
                        
                        // Inject document polyfill at the very beginning
                        // Use IIFE to ensure it runs immediately
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
                    console.warn('Failed to patch worker script, using original:', error);
                    // Fall through to use original
                }
            }
            
            // For non-data URLs or if patching failed, use original
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

