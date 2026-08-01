const sessions = new Map();
export function getSession(id) { return sessions.get(id); }
export function setSession(id, data) { sessions.set(id, data); }
export function clearSession(id) { sessions.delete(id); }
