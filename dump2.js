const source = `
void main() { 
  print([1,2,3]); 
  print([1,2,3].length);
  print([1,2,3][1]);
}
`;

fetch('https://stable.api.dartpad.dev/api/v3/compileDDC', {
  method: 'POST', 
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({source})
})
.then(r => r.json())
.then(r => {
  const jsCode = r.result;
  const setupScript = `
    (function() {
      const dartxSymbols = {};
      function registerSym(s) {
        if (dartxSymbols[s]) return dartxSymbols[s];
        const sym = Symbol("dartx." + s);
        dartxSymbols[s] = sym;
        if (s === 'length') {
          Object.defineProperty(Array.prototype, sym, { get: function() { return this.length; }, configurable: true });
        } else if (s === '_get') {
          Array.prototype[sym] = function(i) { return this[i]; };
        }
        return sym;
      }
      registerSym('length');
      registerSym('_get');

      self.dartx = new Proxy({}, {
        get: (_target, prop) => registerSym(String(prop))
      });

      const JSArrayClass = class JSArray extends Array {
        static of() { 
          const arr = arguments[arguments.length - 1];
          return Array.isArray(arr) ? arr : Array.from(arguments);
        }
      };

      self.dart_rti = { _Universe: { eval: () => () => ({}), addRules: () => {} } };
      self._interceptors = { JSArray: JSArrayClass };
      self.dart = {
        library: {}, constFn: f => f, lazyFn: f => f, trackLibraries: () => {},
        typeUniverse: {}, defineLazy: () => {}
      };
      self.core = { print: console.log };
      self.dart_sdk = {
        dart_rti: self.dart_rti, _interceptors: self._interceptors,
        core: self.core, dart: self.dart, dartx: self.dartx
      };
      self.define = (name, deps, factory) => { self.moduleExport = factory(self.dart_sdk); };
    })();
  `;
  const vm = require('vm');
  const sandbox = { console, self: {}, JSON, Object, Array, Symbol, String };
  sandbox.self = sandbox;
  try {
    vm.runInNewContext(setupScript + "\\n" + jsCode + "\\n; self.moduleExport.dartpad_sample__main.main()", sandbox);
  } catch(e) { console.error(e) }
})
.catch(console.error);
