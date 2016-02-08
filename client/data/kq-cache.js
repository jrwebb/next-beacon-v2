
const cache = {};

export function retrieveKq (name) {
	return cache[name];
}

export function storeKq (name, kq) {
	cache[name] = kq;
}
