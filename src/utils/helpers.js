export function eq(a, b) { 
    return a === b; 
}

export function getProperty(obj, prop) {
    return obj && obj[prop] ? obj[prop] : '';
  }