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

// /**
//  * Convert a function to a string, and adds execution option.
//  *
//  * @param fn - Function to convert to string
//  * @param execute - Whether to execute the function
//  * @returns String
//  */
// export const functionToString = (fn: Function, execute = true): string => {
//   let toStr = fn.toString();
//   if (execute) {
//     const functionName = fn.name;
//     toStr = `${toStr}\n${functionName ? functionName + '();' : ''}`;
//   }
//   return toStr.replace(/\s+/g, ' ').trim() + '\n';
// };

export const functionToString = (fn: Function, execute = true): string => {
  let fnStr = fn.toString();

  // No support for arrow functions as they don't have a name.
  if (!fnStr.startsWith('function')) {
    throw new Error('Arrow functions are not supported');
  }

  if (execute) {
    const functionName = fn.name;
    fnStr = `${fnStr}\n${functionName ? functionName + '();' : ''}`;
  }
  return fnStr.replace(/\s+/g, ' ').trim() + '\n';
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
      return `${acc} ${functionToString(fn, execute)} \n`;
    } else if (typeof fn === 'string') {
      return `${acc} ${fn} \n`;
    }
    throw new Error('Invalid argument type for combineExecutables');
  };

  return fns.reduce(reducer, '');
}
