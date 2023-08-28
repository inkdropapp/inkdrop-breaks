'use strict';

var inkdrop = require('inkdrop');

function escapeStringRegexp(string) {
  if (typeof string !== 'string') {
    throw new TypeError('Expected a string');
  }

  // Escape characters with special meaning either inside or outside character sets.
  // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
  return string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
}

/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 */


/**
 * Generate an assertion from a test.
 *
 * Useful if you’re going to test many nodes, for example when creating a
 * utility where something else passes a compatible test.
 *
 * The created function is a bit faster because it expects valid input only:
 * a `node`, `index`, and `parent`.
 *
 * @param test
 *   *   when nullish, checks if `node` is a `Node`.
 *   *   when `string`, works like passing `(node) => node.type === test`.
 *   *   when `function` checks if function passed the node is true.
 *   *   when `object`, checks that all keys in test are in node, and that they have (strictly) equal values.
 *   *   when `array`, checks if any one of the subtests pass.
 * @returns
 *   An assertion.
 */
const convert =
/**
 * @type {(
 *   (<Kind extends Node>(test: PredicateTest<Kind>) => AssertPredicate<Kind>) &
 *   ((test?: Test) => AssertAnything)
 * )}
 */

/**
 * @param {Test} [test]
 * @returns {AssertAnything}
 */
function (test) {
  if (test === undefined || test === null) {
    return ok;
  }
  if (typeof test === 'string') {
    return typeFactory(test);
  }
  if (typeof test === 'object') {
    return Array.isArray(test) ? anyFactory(test) : propsFactory(test);
  }
  if (typeof test === 'function') {
    return castFactory(test);
  }
  throw new Error('Expected function, string, or object as test');
};

/**
 * @param {Array<string | Props | TestFunctionAnything>} tests
 * @returns {AssertAnything}
 */
function anyFactory(tests) {
  /** @type {Array<AssertAnything>} */
  const checks = [];
  let index = -1;
  while (++index < tests.length) {
    checks[index] = convert(tests[index]);
  }
  return castFactory(any);

  /**
   * @this {unknown}
   * @param {Array<unknown>} parameters
   * @returns {boolean}
   */
  function any(...parameters) {
    let index = -1;
    while (++index < checks.length) {
      if (checks[index].call(this, ...parameters)) return true;
    }
    return false;
  }
}

/**
 * Turn an object into a test for a node with a certain fields.
 *
 * @param {Props} check
 * @returns {AssertAnything}
 */
function propsFactory(check) {
  return castFactory(all);

  /**
   * @param {Node} node
   * @returns {boolean}
   */
  function all(node) {
    /** @type {string} */
    let key;
    for (key in check) {
      // @ts-expect-error: hush, it sure works as an index.
      if (node[key] !== check[key]) return false;
    }
    return true;
  }
}

/**
 * Turn a string into a test for a node with a certain type.
 *
 * @param {string} check
 * @returns {AssertAnything}
 */
function typeFactory(check) {
  return castFactory(type);

  /**
   * @param {Node} node
   */
  function type(node) {
    return node && node.type === check;
  }
}

/**
 * Turn a custom test into a test for a node that passes that test.
 *
 * @param {TestFunctionAnything} check
 * @returns {AssertAnything}
 */
function castFactory(check) {
  return assertion;

  /**
   * @this {unknown}
   * @param {unknown} node
   * @param {Array<unknown>} parameters
   * @returns {boolean}
   */
  function assertion(node, ...parameters) {
    return Boolean(node && typeof node === 'object' && 'type' in node &&
    // @ts-expect-error: fine.
    Boolean(check.call(this, node, ...parameters)));
  }
}
function ok() {
  return true;
}

/**
 * @param {string} d
 * @returns {string}
 */
function color(d) {
  return '\u001B[33m' + d + '\u001B[39m';
}

/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 * @typedef {import('unist-util-is').Test} Test
 */


/**
 * Continue traversing as normal.
 */
const CONTINUE = true;

/**
 * Stop traversing immediately.
 */
const EXIT = false;

/**
 * Do not traverse this node’s children.
 */
const SKIP = 'skip';

/**
 * Visit nodes, with ancestral information.
 *
 * This algorithm performs *depth-first* *tree traversal* in *preorder*
 * (**NLR**) or if `reverse` is given, in *reverse preorder* (**NRL**).
 *
 * You can choose for which nodes `visitor` is called by passing a `test`.
 * For complex tests, you should test yourself in `visitor`, as it will be
 * faster and will have improved type information.
 *
 * Walking the tree is an intensive task.
 * Make use of the return values of the visitor when possible.
 * Instead of walking a tree multiple times, walk it once, use `unist-util-is`
 * to check if a node matches, and then perform different operations.
 *
 * You can change the tree.
 * See `Visitor` for more info.
 *
 * @param tree
 *   Tree to traverse.
 * @param test
 *   `unist-util-is`-compatible test
 * @param visitor
 *   Handle each node.
 * @param reverse
 *   Traverse in reverse preorder (NRL) instead of the default preorder (NLR).
 * @returns
 *   Nothing.
 */
const visitParents =
/**
 * @type {(
 *   (<Tree extends Node, Check extends Test>(tree: Tree, test: Check, visitor: BuildVisitor<Tree, Check>, reverse?: boolean | null | undefined) => void) &
 *   (<Tree extends Node>(tree: Tree, visitor: BuildVisitor<Tree>, reverse?: boolean | null | undefined) => void)
 * )}
 */

/**
 * @param {Node} tree
 * @param {Test} test
 * @param {Visitor<Node>} visitor
 * @param {boolean | null | undefined} [reverse]
 * @returns {void}
 */
function (tree, test, visitor, reverse) {
  if (typeof test === 'function' && typeof visitor !== 'function') {
    reverse = visitor;
    // @ts-expect-error no visitor given, so `visitor` is test.
    visitor = test;
    test = null;
  }
  const is = convert(test);
  const step = reverse ? -1 : 1;
  factory(tree, undefined, [])();

  /**
   * @param {Node} node
   * @param {number | undefined} index
   * @param {Array<Parent>} parents
   */
  function factory(node, index, parents) {
    /** @type {Record<string, unknown>} */
    // @ts-expect-error: hush
    const value = node && typeof node === 'object' ? node : {};
    if (typeof value.type === 'string') {
      const name =
      // `hast`
      typeof value.tagName === 'string' ? value.tagName :
      // `xast`
      typeof value.name === 'string' ? value.name : undefined;
      Object.defineProperty(visit, 'name', {
        value: 'node (' + color(node.type + (name ? '<' + name + '>' : '')) + ')'
      });
    }
    return visit;
    function visit() {
      /** @type {ActionTuple} */
      let result = [];
      /** @type {ActionTuple} */
      let subresult;
      /** @type {number} */
      let offset;
      /** @type {Array<Parent>} */
      let grandparents;
      if (!test || is(node, index, parents[parents.length - 1] || null)) {
        result = toResult(visitor(node, parents));
        if (result[0] === EXIT) {
          return result;
        }
      }

      // @ts-expect-error looks like a parent.
      if (node.children && result[0] !== SKIP) {
        // @ts-expect-error looks like a parent.
        offset = (reverse ? node.children.length : -1) + step;
        // @ts-expect-error looks like a parent.
        grandparents = parents.concat(node);

        // @ts-expect-error looks like a parent.
        while (offset > -1 && offset < node.children.length) {
          // @ts-expect-error looks like a parent.
          subresult = factory(node.children[offset], offset, grandparents)();
          if (subresult[0] === EXIT) {
            return subresult;
          }
          offset = typeof subresult[1] === 'number' ? subresult[1] : offset + step;
        }
      }
      return result;
    }
  }
};

/**
 * Turn a return value into a clean result.
 *
 * @param {VisitorResult} value
 *   Valid return values from visitors.
 * @returns {ActionTuple}
 *   Clean result.
 */
function toResult(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === 'number') {
    return [CONTINUE, value];
  }
  return [value];
}

/**
 * @typedef {import('mdast').Parent} MdastParent
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').Content} Content
 * @typedef {import('mdast').PhrasingContent} PhrasingContent
 * @typedef {import('mdast').Text} Text
 * @typedef {import('unist-util-visit-parents').Test} Test
 * @typedef {import('unist-util-visit-parents').VisitorResult} VisitorResult
 */

const own = {}.hasOwnProperty;

/**
 * Find patterns in a tree and replace them.
 *
 * The algorithm searches the tree in *preorder* for complete values in `Text`
 * nodes.
 * Partial matches are not supported.
 *
 * @param tree
 *   Tree to change.
 * @param find
 *   Patterns to find.
 * @param replace
 *   Things to replace with (when `find` is `Find`) or configuration.
 * @param options
 *   Configuration (when `find` is not `Find`).
 * @returns
 *   Given, modified, tree.
 */
// To do: next major: remove `find` & `replace` combo, remove schema.
const findAndReplace =
/**
 * @type {(
 *   (<Tree extends Node>(tree: Tree, find: Find, replace?: Replace | null | undefined, options?: Options | null | undefined) => Tree) &
 *   (<Tree extends Node>(tree: Tree, schema: FindAndReplaceSchema | FindAndReplaceList, options?: Options | null | undefined) => Tree)
 * )}
 **/

/**
 * @template {Node} Tree
 * @param {Tree} tree
 * @param {Find | FindAndReplaceSchema | FindAndReplaceList} find
 * @param {Replace | Options | null | undefined} [replace]
 * @param {Options | null | undefined} [options]
 * @returns {Tree}
 */
function (tree, find, replace, options) {
  /** @type {Options | null | undefined} */
  let settings;
  /** @type {FindAndReplaceSchema|FindAndReplaceList} */
  let schema;
  if (typeof find === 'string' || find instanceof RegExp) {
    // @ts-expect-error don’t expect options twice.
    schema = [[find, replace]];
    settings = options;
  } else {
    schema = find;
    // @ts-expect-error don’t expect replace twice.
    settings = replace;
  }
  if (!settings) {
    settings = {};
  }
  const ignored = convert(settings.ignore || []);
  const pairs = toPairs(schema);
  let pairIndex = -1;
  while (++pairIndex < pairs.length) {
    visitParents(tree, 'text', visitor);
  }

  // To do next major: don’t return the given tree.
  return tree;

  /** @type {import('unist-util-visit-parents/complex-types.js').BuildVisitor<Root, 'text'>} */
  function visitor(node, parents) {
    let index = -1;
    /** @type {Parent | undefined} */
    let grandparent;
    while (++index < parents.length) {
      const parent = parents[index];
      if (ignored(parent,
      // @ts-expect-error: TS doesn’t understand but it’s perfect.
      grandparent ? grandparent.children.indexOf(parent) : undefined, grandparent)) {
        return;
      }
      grandparent = parent;
    }
    if (grandparent) {
      return handler(node, parents);
    }
  }

  /**
   * Handle a text node which is not in an ignored parent.
   *
   * @param {Text} node
   *   Text node.
   * @param {Array<Parent>} parents
   *   Parents.
   * @returns {VisitorResult}
   *   Result.
   */
  function handler(node, parents) {
    const parent = parents[parents.length - 1];
    const find = pairs[pairIndex][0];
    const replace = pairs[pairIndex][1];
    let start = 0;
    // @ts-expect-error: TS is wrong, some of these children can be text.
    const index = parent.children.indexOf(node);
    let change = false;
    /** @type {Array<PhrasingContent>} */
    let nodes = [];
    find.lastIndex = 0;
    let match = find.exec(node.value);
    while (match) {
      const position = match.index;
      /** @type {RegExpMatchObject} */
      const matchObject = {
        index: match.index,
        input: match.input,
        // @ts-expect-error: stack is fine.
        stack: [...parents, node]
      };
      let value = replace(...match, matchObject);
      if (typeof value === 'string') {
        value = value.length > 0 ? {
          type: 'text',
          value
        } : undefined;
      }

      // It wasn’t a match after all.
      if (value !== false) {
        if (start !== position) {
          nodes.push({
            type: 'text',
            value: node.value.slice(start, position)
          });
        }
        if (Array.isArray(value)) {
          nodes.push(...value);
        } else if (value) {
          nodes.push(value);
        }
        start = position + match[0].length;
        change = true;
      }
      if (!find.global) {
        break;
      }
      match = find.exec(node.value);
    }
    if (change) {
      if (start < node.value.length) {
        nodes.push({
          type: 'text',
          value: node.value.slice(start)
        });
      }
      parent.children.splice(index, 1, ...nodes);
    } else {
      nodes = [node];
    }
    return index + nodes.length;
  }
};

/**
 * Turn a schema into pairs.
 *
 * @param {FindAndReplaceSchema | FindAndReplaceList} schema
 *   Schema.
 * @returns {Pairs}
 *   Clean pairs.
 */
function toPairs(schema) {
  /** @type {Pairs} */
  const result = [];
  if (typeof schema !== 'object') {
    throw new TypeError('Expected array or object as schema');
  }
  if (Array.isArray(schema)) {
    let index = -1;
    while (++index < schema.length) {
      result.push([toExpression(schema[index][0]), toFunction(schema[index][1])]);
    }
  } else {
    /** @type {string} */
    let key;
    for (key in schema) {
      if (own.call(schema, key)) {
        result.push([toExpression(key), toFunction(schema[key])]);
      }
    }
  }
  return result;
}

/**
 * Turn a find into an expression.
 *
 * @param {Find} find
 *   Find.
 * @returns {RegExp}
 *   Expression.
 */
function toExpression(find) {
  return typeof find === 'string' ? new RegExp(escapeStringRegexp(find), 'g') : find;
}

/**
 * Turn a replace into a function.
 *
 * @param {Replace} replace
 *   Replace.
 * @returns {ReplaceFunction}
 *   Function.
 */
function toFunction(replace) {
  return typeof replace === 'function' ? replace : () => replace;
}

/**
 * @typedef {import('mdast').Content} Content
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast-util-find-and-replace').ReplaceFunction} ReplaceFunction
 */


/**
 * Turn normal line endings into hard breaks.
 *
 * @param {Node} tree
 *   Tree to change.
 * @returns {void}
 *   Nothing.
 */
function newlineToBreak(tree) {
  findAndReplace(tree, /\r?\n|\r/g, replace);
}

/**
 * Replace line endings.
 *
 * @type {ReplaceFunction}
 */
function replace() {
  return {
    type: 'break'
  };
}

/**
 * @typedef {import('mdast').Root} Root
 */


/**
 * Plugin to support hard breaks without needing spaces or escapes (turns enters
 * into `<br>`s).
 *
 * @type {import('unified').Plugin<void[], Root>}
 */
function remarkBreaks() {
  return newlineToBreak;
}

module.exports = {
  activate() {
    return inkdrop.markdownRenderer.remarkPlugins.splice(0, 0, remarkBreaks);
  },
  deactivate() {
    if (inkdrop.markdownRenderer) {
      inkdrop.markdownRenderer.remarkPlugins = inkdrop.markdownRenderer.remarkPlugins.filter(plugin => {
        return plugin !== remarkBreaks;
      });
    }
  }
};
//# sourceMappingURL=index.js.map
