export const storage = {
	get: (key: string) => {
		return browser.storage.local.get(key);
	},

	set: (data: any) => {
		return browser.storage.local.set(data);
	},
};
