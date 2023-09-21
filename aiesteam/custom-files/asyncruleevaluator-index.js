
/*
 * asyncruleevaluator-index.js
 * this file needs to go to the node_modules.
 * node_modules/async-rule-evaluator/build/index.js
 * Modified to throw an error if the variable is not defined
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parse;
exports.resetObjectResolver = resetObjectResolver;
exports.getObjectResolver = getObjectResolver;
exports.toFunction = toFunction;

var _lodash = _interopRequireDefault(require("lodash.topath"));

var _parser = require("../parser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AsyncFunction = Object.getPrototypeOf(async () => true).constructor;
const OBJECT_RESOLVER = Symbol('Property resolver assigned to filtered objects');
const std = {
  numify(v) {
    if (v !== null && typeof v === 'object') {
      return 1;
    }

    return Number(v);
  },

  isfn(fns, funcName) {
    return Object.hasOwnProperty.call(fns, funcName) && typeof fns[funcName] === 'function';
  },

  unknown(funcName) {
    throw ReferenceError(`Unknown function: ${funcName}()`);
  },

  coerceArray(value) {
    if (Array.isArray(value)) return value;
    return [value];
  },

  coerceBoolean(value) {
    if (typeof value === 'boolean') return +value;
    return value;
  },

  isSubset(a, b) {
    const A = std.coerceArray(a);
    const B = std.coerceArray(b);
    return +A.every(val => B.includes(val));
  },

  isSubsetInexact(a, b) {
    const A = std.coerceArray(a);
    const B = std.coerceArray(b);
    return +A.every(val => B.findIndex(v => String(v) === String(val)) >= 0);
  },

  buildString(inQuote, inLiteral) {
    const quote = String(inQuote)[0];
    const literal = String(inLiteral);
    let built = '';
    if (literal[0] !== quote || literal[literal.length - 1] !== quote) throw new Error('Unexpected internal error: String literal doesn\'t begin/end with the right quotation mark.');

    for (let i = 1; i < literal.length - 1; i += 1) {
      if (literal[i] === '\\') {
        i += 1;
        if (i >= literal.length - 1) throw new Error('Unexpected internal error: Unescaped backslash at the end of string literal.');
        if (literal[i] === '\\') built += '\\';else if (literal[i] === quote) built += quote;else throw new Error(`Unexpected internal error: Invalid escaped character in string literal: ${literal[i]}`);
      } else if (literal[i] === quote) {
        throw new Error('Unexpected internal error: String literal contains unescaped quotation mark.');
      } else {
        built += literal[i];
      }
    }

    return JSON.stringify(built);
  }

};
_parser.parser.yy = std;

function parse(input) {
  return _parser.parser.parse(input);
}

function resetObjectResolver(obj) {
  delete obj[OBJECT_RESOLVER];
}

function getObjectResolver(obj) {
  if (!obj) {
    return () => undefined;
  }

  if (obj[OBJECT_RESOLVER]) {
    return obj[OBJECT_RESOLVER];
  }

  const cachedPromises = new WeakMap();

  async function objectResolver(name) {
    let current = obj;
    const path = (0, _lodash.default)(name);
    let index = 0;
    const {
      length
    } = path; // Walk the specified path, looking for functions and promises along the way.
    // If we find a function, invoke it and cache the result (which is often a promise)

    while (current != null && index < length) {
      const key = String(path[index]);

      let currentVal = Object.prototype.hasOwnProperty.call(current, key) ? current[key] : undefined;
      if(currentVal === undefined) throw new Error("Undefined Variable: "+String(path[index])) // throw an error
         
      if (typeof currentVal === 'function') {
        let cacheEntry = cachedPromises.get(current);

        if (cacheEntry && Object.hasOwnProperty.call(cacheEntry, key)) {
          currentVal = cacheEntry[key];
        } else {
          // By passing objectResolver to the fn, it can "depend" on other promises
          // and still get the cache benefits
          currentVal = currentVal(objectResolver, obj, current, name); // Need to get this again because someone else may have made it
         
          
          cacheEntry = cachedPromises.get(current);

          if (!cacheEntry) {
            cacheEntry = {};
            cachedPromises.set(current, cacheEntry);
          }

          cacheEntry[key] = currentVal;
        }
      } // eslint-disable-next-line no-await-in-loop


      current = await currentVal;
      index += 1;
    }

    return index && index === length ? current : undefined;
  }

  Object.defineProperty(obj, OBJECT_RESOLVER, {
    value: objectResolver,
    enumerable: false,
    configurable: true
  });
  return objectResolver;
}

function toFunction(input, {
  functions,
  onParse,
  customResolver
} = {}) {
  const allFunctions = {
    abs: Math.abs,
    ceil: Math.ceil,
    floor: Math.floor,
    log: Math.log,
    max: Math.max,
    min: Math.min,
    random: Math.random,
    round: Math.round,
    sqrt: Math.sqrt,

    length(o) {
      return (o === null || o === void 0 ? void 0 : o.length) || 0;
    },

    lower(a) {
      if (a === null || a === undefined) {
        return a;
      }

      return a.toString().toLocaleLowerCase();
    },

    substr(a, from, length) {
      if (a === null || a === undefined) {
        return a;
      }

      return a.toString().substr(from, length);
    },

    ...functions
  };

  const tree = _parser.parser.parse(input);

  const js = [];
  const pathReferences = [];
  js.push('return ');

  function toJs(node) {
    if (Array.isArray(node)) {
      if (node[1] === 'await prop(') {
        pathReferences.push(JSON.parse(node[2]));
      }

      node.forEach(toJs);
    } else {
      js.push(node);
    }
  }

  tree.forEach(toJs);
  js.push(';');
  const func = new AsyncFunction('fns', 'std', 'prop', js.join(''));

  if (onParse) {
    onParse({
      input,
      tree,
      functionObject: func,
      pathReferences
    });
  }

  return async function asyncRuleEvaluator(data) {
    return func(allFunctions, std, customResolver || getObjectResolver(data));
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJBc3luY0Z1bmN0aW9uIiwiT2JqZWN0IiwiZ2V0UHJvdG90eXBlT2YiLCJjb25zdHJ1Y3RvciIsIk9CSkVDVF9SRVNPTFZFUiIsIlN5bWJvbCIsInN0ZCIsIm51bWlmeSIsInYiLCJOdW1iZXIiLCJpc2ZuIiwiZm5zIiwiZnVuY05hbWUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJ1bmtub3duIiwiUmVmZXJlbmNlRXJyb3IiLCJjb2VyY2VBcnJheSIsInZhbHVlIiwiQXJyYXkiLCJpc0FycmF5IiwiY29lcmNlQm9vbGVhbiIsImlzU3Vic2V0IiwiYSIsImIiLCJBIiwiQiIsImV2ZXJ5IiwidmFsIiwiaW5jbHVkZXMiLCJpc1N1YnNldEluZXhhY3QiLCJmaW5kSW5kZXgiLCJTdHJpbmciLCJidWlsZFN0cmluZyIsImluUXVvdGUiLCJpbkxpdGVyYWwiLCJxdW90ZSIsImxpdGVyYWwiLCJidWlsdCIsImxlbmd0aCIsIkVycm9yIiwiaSIsIkpTT04iLCJzdHJpbmdpZnkiLCJwYXJzZXIiLCJ5eSIsInBhcnNlIiwiaW5wdXQiLCJyZXNldE9iamVjdFJlc29sdmVyIiwib2JqIiwiZ2V0T2JqZWN0UmVzb2x2ZXIiLCJ1bmRlZmluZWQiLCJjYWNoZWRQcm9taXNlcyIsIldlYWtNYXAiLCJvYmplY3RSZXNvbHZlciIsIm5hbWUiLCJjdXJyZW50IiwicGF0aCIsImluZGV4Iiwia2V5IiwiY3VycmVudFZhbCIsInByb3RvdHlwZSIsImNhY2hlRW50cnkiLCJnZXQiLCJzZXQiLCJkZWZpbmVQcm9wZXJ0eSIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ0b0Z1bmN0aW9uIiwiZnVuY3Rpb25zIiwib25QYXJzZSIsImN1c3RvbVJlc29sdmVyIiwiYWxsRnVuY3Rpb25zIiwiYWJzIiwiTWF0aCIsImNlaWwiLCJmbG9vciIsImxvZyIsIm1heCIsIm1pbiIsInJhbmRvbSIsInJvdW5kIiwic3FydCIsIm8iLCJsb3dlciIsInRvU3RyaW5nIiwidG9Mb2NhbGVMb3dlckNhc2UiLCJzdWJzdHIiLCJmcm9tIiwidHJlZSIsImpzIiwicGF0aFJlZmVyZW5jZXMiLCJwdXNoIiwidG9KcyIsIm5vZGUiLCJmb3JFYWNoIiwiZnVuYyIsImpvaW4iLCJmdW5jdGlvbk9iamVjdCIsImFzeW5jUnVsZUV2YWx1YXRvciIsImRhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUVBLE1BQU1BLGFBQWEsR0FBR0MsTUFBTSxDQUFDQyxjQUFQLENBQXNCLFlBQVksSUFBbEMsRUFBd0NDLFdBQTlEO0FBQ0EsTUFBTUMsZUFBZSxHQUFHQyxNQUFNLENBQUMsZ0RBQUQsQ0FBOUI7QUFFQSxNQUFNQyxHQUFHLEdBQUc7QUFDVkMsRUFBQUEsTUFBTSxDQUFDQyxDQUFELEVBQUk7QUFDUixRQUFJQSxDQUFDLEtBQUssSUFBTixJQUFjLE9BQU9BLENBQVAsS0FBYSxRQUEvQixFQUF5QztBQUN2QyxhQUFPLENBQVA7QUFDRDs7QUFDRCxXQUFPQyxNQUFNLENBQUNELENBQUQsQ0FBYjtBQUNELEdBTlM7O0FBUVZFLEVBQUFBLElBQUksQ0FBQ0MsR0FBRCxFQUFNQyxRQUFOLEVBQWdCO0FBQ2xCLFdBQU9YLE1BQU0sQ0FBQ1ksY0FBUCxDQUFzQkMsSUFBdEIsQ0FBMkJILEdBQTNCLEVBQWdDQyxRQUFoQyxLQUE2QyxPQUFPRCxHQUFHLENBQUNDLFFBQUQsQ0FBVixLQUF5QixVQUE3RTtBQUNELEdBVlM7O0FBWVZHLEVBQUFBLE9BQU8sQ0FBQ0gsUUFBRCxFQUFXO0FBQ2hCLFVBQU1JLGNBQWMsQ0FBRSxxQkFBb0JKLFFBQVMsSUFBL0IsQ0FBcEI7QUFDRCxHQWRTOztBQWdCVkssRUFBQUEsV0FBVyxDQUFDQyxLQUFELEVBQVE7QUFDakIsUUFBSUMsS0FBSyxDQUFDQyxPQUFOLENBQWNGLEtBQWQsQ0FBSixFQUEwQixPQUFPQSxLQUFQO0FBQzFCLFdBQU8sQ0FBQ0EsS0FBRCxDQUFQO0FBQ0QsR0FuQlM7O0FBcUJWRyxFQUFB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eEIsWUFBRCxFQUFlbEUsR0FBZixFQUFvQmlFLGNBQWMsSUFBSXJCLGlCQUFpQixDQUFDa0QsSUFBRCxDQUF2RCxDQUFYO0FBQ0QsR0FGRDtBQUdEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHRvUGF0aCBmcm9tICdsb2Rhc2gudG9wYXRoJztcbmltcG9ydCB7IHBhcnNlciB9IGZyb20gJy4uL3BhcnNlcic7XG5cbmNvbnN0IEFzeW5jRnVuY3Rpb24gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoYXN5bmMgKCkgPT4gdHJ1ZSkuY29uc3RydWN0b3I7XG5jb25zdCBPQkpFQ1RfUkVTT0xWRVIgPSBTeW1ib2woJ1Byb3BlcnR5IHJlc29sdmVyIGFzc2lnbmVkIHRvIGZpbHRlcmVkIG9iamVjdHMnKTtcblxuY29uc3Qgc3RkID0ge1xuICBudW1pZnkodikge1xuICAgIGlmICh2ICE9PSBudWxsICYmIHR5cGVvZiB2ID09PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfVxuICAgIHJldHVybiBOdW1iZXIodik7XG4gIH0sXG5cbiAgaXNmbihmbnMsIGZ1bmNOYW1lKSB7XG4gICAgcmV0dXJuIE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKGZucywgZnVuY05hbWUpICYmIHR5cGVvZiBmbnNbZnVuY05hbWVdID09PSAnZnVuY3Rpb24nO1xuICB9LFxuXG4gIHVua25vd24oZnVuY05hbWUpIHtcbiAgICB0aHJvdyBSZWZlcmVuY2VFcnJvcihgVW5rbm93biBmdW5jdGlvbjogJHtmdW5jTmFtZX0oKWApO1xuICB9LFxuXG4gIGNvZXJjZUFycmF5KHZhbHVlKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSByZXR1cm4gdmFsdWU7XG4gICAgcmV0dXJuIFt2YWx1ZV07XG4gIH0sXG5cbiAgY29lcmNlQm9vbGVhbih2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJykgcmV0dXJuICt2YWx1ZTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH0sXG5cbiAgaXNTdWJzZXQoYSwgYikge1xuICAgIGNvbnN0IEEgPSBzdGQuY29lcmNlQXJyYXkoYSk7XG4gICAgY29uc3QgQiA9IHN0ZC5jb2VyY2VBcnJheShiKTtcbiAgICByZXR1cm4gK0EuZXZlcnkodmFsID0+IEIuaW5jbHVkZXModmFsKSk7XG4gIH0sXG5cbiAgaXNTdWJzZXRJbmV4YWN0KGEsIGIpIHtcbiAgICBjb25zdCBBID0gc3RkLmNvZXJjZUFycmF5KGEpO1xuICAgIGNvbnN0IEIgPSBzdGQuY29lcmNlQXJyYXkoYik7XG4gICAgcmV0dXJuICtBLmV2ZXJ5KHZhbCA9PiBCLmZpbmRJbmRleCh2ID0+IChTdHJpbmcodikgPT09IFN0cmluZyh2YWwpKSkgPj0gMCk7XG4gIH0sXG5cbiAgYnVpbGRTdHJpbmcoaW5RdW90ZSwgaW5MaXRlcmFsKSB7XG4gICAgY29uc3QgcXVvdGUgPSBTdHJpbmcoaW5RdW90ZSlbMF07XG4gICAgY29uc3QgbGl0ZXJhbCA9IFN0cmluZyhpbkxpdGVyYWwpO1xuICAgIGxldCBidWlsdCA9ICcnO1xuXG4gICAgaWYgKGxpdGVyYWxbMF0gIT09IHF1b3RlIHx8IGxpdGVyYWxbbGl0ZXJhbC5sZW5ndGggLSAxXSAhPT0gcXVvdGUpIHRocm93IG5ldyBFcnJvcignVW5leHBlY3RlZCBpbnRlcm5hbCBlcnJvcjogU3RyaW5nIGxpdGVyYWwgZG9lc25cXCd0IGJlZ2luL2VuZCB3aXRoIHRoZSByaWdodCBxdW90YXRpb24gbWFyay4nKTtcblxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbGl0ZXJhbC5sZW5ndGggLSAxOyBpICs9IDEpIHtcbiAgICAgIGlmIChsaXRlcmFsW2ldID09PSAnXFxcXCcpIHtcbiAgICAgICAgaSArPSAxO1xuICAgICAgICBpZiAoaSA+PSBsaXRlcmFsLmxlbmd0aCAtIDEpIHRocm93IG5ldyBFcnJvcignVW5leHBlY3RlZCBpbnRlcm5hbCBlcnJvcjogVW5lc2NhcGVkIGJhY2tzbGFzaCBhdCB0aGUgZW5kIG9mIHN0cmluZyBsaXRlcmFsLicpO1xuXG4gICAgICAgIGlmIChsaXRlcmFsW2ldID09PSAnXFxcXCcpIGJ1aWx0ICs9ICdcXFxcJztcbiAgICAgICAgZWxzZSBpZiAobGl0ZXJhbFtpXSA9PT0gcXVvdGUpIGJ1aWx0ICs9IHF1b3RlO1xuICAgICAgICBlbHNlIHRocm93IG5ldyBFcnJvcihgVW5leHBlY3RlZCBpbnRlcm5hbCBlcnJvcjogSW52YWxpZCBlc2NhcGVkIGNoYXJhY3RlciBpbiBzdHJpbmcgbGl0ZXJhbDogJHtsaXRlcmFsW2ldfWApO1xuICAgICAgfSBlbHNlIGlmIChsaXRlcmFsW2ldID09PSBxdW90ZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuZXhwZWN0ZWQgaW50ZXJuYWwgZXJyb3I6IFN0cmluZyBsaXRlcmFsIGNvbnRhaW5zIHVuZXNjYXBlZCBxdW90YXRpb24gbWFyay4nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJ1aWx0ICs9IGxpdGVyYWxbaV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGJ1aWx0KTtcbiAgfSxcbn07XG5cbnBhcnNlci55eSA9IHN0ZDtcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlKGlucHV0KSB7XG4gIHJldHVybiBwYXJzZXIucGFyc2UoaW5wdXQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRPYmplY3RSZXNvbHZlcihvYmopIHtcbiAgZGVsZXRlIG9ialtPQkpFQ1RfUkVTT0xWRVJdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0T2JqZWN0UmVzb2x2ZXIob2JqKSB7XG4gIGlmICghb2JqKSB7XG4gICAgcmV0dXJuICgpID0+IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlmIChvYmpbT0JKRUNUX1JFU09MVkVSXSkge1xuICAgIHJldHVybiBvYmpbT0JKRUNUX1JFU09MVkVSXTtcbiAgfVxuICBjb25zdCBjYWNoZWRQcm9taXNlcyA9IG5ldyBXZWFrTWFwKCk7XG4gIGFzeW5jIGZ1bmN0aW9uIG9iamVjdFJlc29sdmVyKG5hbWUpIHtcbiAgICBsZXQgY3VycmVudCA9IG9iajtcbiAgICBjb25zdCBwYXRoID0gdG9QYXRoKG5hbWUpO1xuICAgIGxldCBpbmRleCA9IDA7XG4gICAgY29uc3QgeyBsZW5ndGggfSA9IHBhdGg7XG5cbiAgICAvLyBXYWxrIHRoZSBzcGVjaWZpZWQgcGF0aCwgbG9va2luZyBmb3IgZnVuY3Rpb25zIGFuZCBwcm9taXNlcyBhbG9uZyB0aGUgd2F5LlxuICAgIC8vIElmIHdlIGZpbmQgYSBmdW5jdGlvbiwgaW52b2tlIGl0IGFuZCBjYWNoZSB0aGUgcmVzdWx0ICh3aGljaCBpcyBvZnRlbiBhIHByb21pc2UpXG4gICAgd2hpbGUgKGN1cnJlbnQgIT0gbnVsbCAmJiBpbmRleCA8IGxlbmd0aCkge1xuICAgICAgY29uc3Qga2V5ID0gU3RyaW5nKHBhdGhbaW5kZXhdKTtcbiAgICAgIGxldCBjdXJyZW50VmFsID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGN1cnJlbnQsIGtleSkgPyBjdXJyZW50W2tleV0gOiB1bmRlZmluZWQ7XG4gICAgICBpZiAodHlwZW9mIGN1cnJlbnRWYWwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgbGV0IGNhY2hlRW50cnkgPSBjYWNoZWRQcm9taXNlcy5nZXQoY3VycmVudCk7XG4gICAgICAgIGlmIChjYWNoZUVudHJ5ICYmIE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKGNhY2hlRW50cnksIGtleSkpIHtcbiAgICAgICAgICBjdXJyZW50VmFsID0gY2FjaGVFbnRyeVtrZXldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEJ5IHBhc3Npbmcgb2JqZWN0UmVzb2x2ZXIgdG8gdGhlIGZuLCBpdCBjYW4gXCJkZXBlbmRcIiBvbiBvdGhlciBwcm9taXNlc1xuICAgICAgICAgIC8vIGFuZCBzdGlsbCBnZXQgdGhlIGNhY2hlIGJlbmVmaXRzXG4gICAgICAgICAgY3VycmVudFZhbCA9IGN1cnJlbnRWYWwob2JqZWN0UmVzb2x2ZXIsIG9iaiwgY3VycmVudCwgbmFtZSk7XG4gICAgICAgICAgLy8gTmVlZCB0byBnZXQgdGhpcyBhZ2FpbiBiZWNhdXNlIHNvbWVvbmUgZWxzZSBtYXkgaGF2ZSBtYWRlIGl0XG4gICAgICAgICAgY2FjaGVFbnRyeSA9IGNhY2hlZFByb21pc2VzLmdldChjdXJyZW50KTtcbiAgICAgICAgICBpZiAoIWNhY2hlRW50cnkpIHtcbiAgICAgICAgICAgIGNhY2hlRW50cnkgPSB7fTtcbiAgICAgICAgICAgIGNhY2hlZFByb21pc2VzLnNldChjdXJyZW50LCBjYWNoZUVudHJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2FjaGVFbnRyeVtrZXldID0gY3VycmVudFZhbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWF3YWl0LWluLWxvb3BcbiAgICAgIGN1cnJlbnQgPSBhd2FpdCBjdXJyZW50VmFsO1xuICAgICAgaW5kZXggKz0gMTtcbiAgICB9XG4gICAgcmV0dXJuIChpbmRleCAmJiBpbmRleCA9PT0gbGVuZ3RoKSA/IGN1cnJlbnQgOiB1bmRlZmluZWQ7XG4gIH1cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgT0JKRUNUX1JFU09MVkVSLCB7IHZhbHVlOiBvYmplY3RSZXNvbHZlciwgZW51bWVyYWJsZTogZmFsc2UsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9KTtcbiAgcmV0dXJuIG9iamVjdFJlc29sdmVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9GdW5jdGlvbihpbnB1dCwgeyBmdW5jdGlvbnMsIG9uUGFyc2UsIGN1c3RvbVJlc29sdmVyIH0gPSB7fSkge1xuICBjb25zdCBhbGxGdW5jdGlvbnMgPSB7XG4gICAgYWJzOiBNYXRoLmFicyxcbiAgICBjZWlsOiBNYXRoLmNlaWwsXG4gICAgZmxvb3I6IE1hdGguZmxvb3IsXG4gICAgbG9nOiBNYXRoLmxvZyxcbiAgICBtYXg6IE1hdGgubWF4LFxuICAgIG1pbjogTWF0aC5taW4sXG4gICAgcmFuZG9tOiBNYXRoLnJhbmRvbSxcbiAgICByb3VuZDogTWF0aC5yb3VuZCxcbiAgICBzcXJ0OiBNYXRoLnNxcnQsXG4gICAgbGVuZ3RoKG8pIHsgcmV0dXJuIG8/Lmxlbmd0aCB8fCAwOyB9LFxuICAgIGxvd2VyKGEpIHtcbiAgICAgIGlmIChhID09PSBudWxsIHx8IGEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gYTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhLnRvU3RyaW5nKCkudG9Mb2NhbGVMb3dlckNhc2UoKTtcbiAgICB9LFxuICAgIHN1YnN0cihhLCBmcm9tLCBsZW5ndGgpIHtcbiAgICAgIGlmIChhID09PSBudWxsIHx8IGEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gYTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhLnRvU3RyaW5nKCkuc3Vic3RyKGZyb20sIGxlbmd0aCk7XG4gICAgfSxcbiAgICAuLi5mdW5jdGlvbnMsXG4gIH07XG5cbiAgY29uc3QgdHJlZSA9IHBhcnNlci5wYXJzZShpbnB1dCk7XG4gIGNvbnN0IGpzID0gW107XG4gIGNvbnN0IHBhdGhSZWZlcmVuY2VzID0gW107XG5cbiAganMucHVzaCgncmV0dXJuICcpO1xuICBmdW5jdGlvbiB0b0pzKG5vZGUpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShub2RlKSkge1xuICAgICAgaWYgKG5vZGVbMV0gPT09ICdhd2FpdCBwcm9wKCcpIHtcbiAgICAgICAgcGF0aFJlZmVyZW5jZXMucHVzaChKU09OLnBhcnNlKG5vZGVbMl0pKTtcbiAgICAgIH1cbiAgICAgIG5vZGUuZm9yRWFjaCh0b0pzKTtcbiAgICB9IGVsc2Uge1xuICAgICAganMucHVzaChub2RlKTtcbiAgICB9XG4gIH1cbiAgdHJlZS5mb3JFYWNoKHRvSnMpO1xuICBqcy5wdXNoKCc7Jyk7XG4gIGNvbnN0IGZ1bmMgPSBuZXcgQXN5bmNGdW5jdGlvbignZm5zJywgJ3N0ZCcsICdwcm9wJywganMuam9pbignJykpO1xuXG4gIGlmIChvblBhcnNlKSB7XG4gICAgb25QYXJzZSh7XG4gICAgICBpbnB1dCxcbiAgICAgIHRyZWUsXG4gICAgICBmdW5jdGlvbk9iamVjdDogZnVuYyxcbiAgICAgIHBhdGhSZWZlcmVuY2VzLFxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGFzeW5jIGZ1bmN0aW9uIGFzeW5jUnVsZUV2YWx1YXRvcihkYXRhKSB7XG4gICAgcmV0dXJuIGZ1bmMoYWxsRnVuY3Rpb25zLCBzdGQsIGN1c3RvbVJlc29sdmVyIHx8IGdldE9iamVjdFJlc29sdmVyKGRhdGEpKTtcbiAgfTtcbn1cbiJdfQ==