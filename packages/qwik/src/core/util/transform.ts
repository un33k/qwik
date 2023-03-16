/**
 * Decode HTML entities.
 *
 * @param html - HTML string to decode
 * @returns Decoded string
 */
export const decodeHTML /*#__PURE__*/ = (html: string): string => {
  const entities: { [id: string]: string } = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    nbsp: '\xa0',
    quot: '"',
  };
  return html.replace(/&([a-z]+);/gi, (match: string, entity: string) => {
    entity = entity.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(entities, entity)) {
      return entities[entity];
    }
    return match;
  });
};

/**
 * Encode HTML entities.
 *
 * @param html - HTML string to encode
 * @returns Encoded string
 */
export const encodeHTML = /*#__PURE__*/ (html: string): string => {
  const entities: { [id: string]: string } = {
    '&': '&amp;',
    "'": '&apos;',
    '>': '&gt;',
    '<': '&lt;',
    '\xa0': '&nbsp;',
    '"': '&quot;',
  };
  return html.replace(/[&'"<> \xa0]/g, (match: string) => {
    return entities[match] || match;
  });
};

/**
 * Convert a function to a string, and adds execution option.
 *
 * @param fn - Function to convert to string
 * @param execute - Whether to execute the function
 * @returns String
 */
export const stringifyFunction = (fn: Function, execute = true) => {
  let toStr = fn.toString();
  if (execute) {
    toStr = `${toStr}\n${fn.name}();`;
  }
  return `${toStr}\n`;
};

/**
 * Combine a list of functions or strings into a single string, optionally
 * executing them in the order they are passed in.
 *
 * @param fns - List of functions or strings
 * @param execute - Whether to execute the functions
 * @returns String
 */
export function combineExecutables(fns: (string | Function)[], execute = true): string {
  const reducer = (acc: string, fn: string | Function) => {
    if (typeof fn === 'function') {
      return `${acc} ${stringifyFunction(fn, execute)} \n`;
    } else if (typeof fn === 'string') {
      return `${acc} ${fn} \n`;
    }
    throw new Error('Invalid argument type for combineExecutables');
  };

  return fns.reduce(reducer, '');
}
