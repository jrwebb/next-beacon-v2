
const cache = {};

export function rerieveKq (name) {
	return cache[name]
}

export function storeKq (name, kq) {
	cache[name] = kq;
}
