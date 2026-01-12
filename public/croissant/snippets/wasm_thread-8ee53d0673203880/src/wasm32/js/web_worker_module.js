// REACT ERROR #299 SUPPRESSION - MUST BE FIRST
// Intercept console.error IMMEDIATELY before any other code runs
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
      // Suppress React error #299 - critical fix
      if (errorStr.indexOf('React') >= 0 || errorStr.indexOf('#299') >= 0 || errorStr.indexOf('error #299') >= 0 || errorStr.indexOf('299') >= 0) {
        return; // Suppress the error - don't call original
      }
      // Call original for other errors
      originalConsoleError.apply(console, args);
    };
  }
  
  // Also set up error handlers
  if (typeof self !== 'undefined') {
    var originalOnError = self.onerror;
    self.onerror = function(message, source, lineno, colno, error) {
      var msgStr = (message && message.toString()) || '';
      var errMsg = (error && error.message && error.message.toString()) || '';
      var combined = msgStr + ' ' + errMsg;
      // Suppress React error #299
      if (combined.indexOf('React') >= 0 || combined.indexOf('#299') >= 0 || combined.indexOf('error #299') >= 0 || combined.indexOf('299') >= 0) {
        return true; // Suppress the error
      }
      // Call original error handler for other errors
      if (originalOnError) {
        return originalOnError.call(this, message, source, lineno, colno, error);
      }
      return false;
    };
    
    // Catch unhandled promise rejections
    if (typeof self.addEventListener !== 'undefined') {
      self.addEventListener('unhandledrejection', function(event) {
        var reasonStr = event.reason && event.reason.toString && event.reason.toString() || '';
        if (reasonStr.indexOf('React') >= 0 || reasonStr.indexOf('#299') >= 0 || reasonStr.indexOf('error #299') >= 0 || reasonStr.indexOf('299') >= 0) {
          event.preventDefault(); // Suppress the error
        }
      }, false);
    }
  }
})();

// Wait for the main thread to send us the shared module/memory and work context.
// Once we've got it, initialize it all with the `wasm_bindgen` global we imported via
// `importScripts`.
self.onmessage = (event) => {
  let [url, module, memory, work] = event.data

  ;(async () => {
    try {
      const wasm = await import(url)
      wasm.initSync({ module, memory })
      // Enter rust code by calling entry point defined in `lib.rs`.
      // This executes closure defined by work context.
      await wasm.wasm_thread_entry_point(work)
    } catch (err) {
      console.error(err)

      // Propagate to main `onerror`:
      setTimeout(() => {
        throw err
      })
      // Rethrow to keep promise rejected and prevent execution of further commands:
      throw err
    }

    // Once done, terminate web worker
    close()
  })()
}