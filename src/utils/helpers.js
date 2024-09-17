export function eq(a, b) { 
    return a === b; 
}

export function getProperty(obj, prop) {
    return obj && obj[prop] ? obj[prop] : '';
}

export function isAdmin(role) { 
    return role === 'admin'; 
}

export function or(a, b) {
    return a || b;
}