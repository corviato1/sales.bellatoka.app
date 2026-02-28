const KEY_STORE = "bt_k";
const MARKER = "bt_enc:";

function getKey() {
  let key = localStorage.getItem(KEY_STORE);
  if (!key) {
    key = Math.random().toString(36).substring(2, 18);
    localStorage.setItem(KEY_STORE, key);
  }
  return key;
}

function xorEncode(str, key) {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    result += String.fromCharCode(
      str.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return result;
}

export function secureSet(storageKey, data) {
  const json = JSON.stringify(data);
  const key = getKey();
  const encoded = MARKER + btoa(unescape(encodeURIComponent(xorEncode(json, key))));
  localStorage.setItem(storageKey, encoded);
}

export function secureGet(storageKey) {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return null;

  if (!raw.startsWith(MARKER)) {
    try {
      const data = JSON.parse(raw);
      secureSet(storageKey, data);
      return data;
    } catch {
      return null;
    }
  }

  try {
    const key = getKey();
    const encoded = raw.slice(MARKER.length);
    const decoded = xorEncode(decodeURIComponent(escape(atob(encoded))), key);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}
