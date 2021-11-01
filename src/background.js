const OPT_KEY = 'one';
const MENU_ID = 'one';

/** Opening tab **/

chrome.action.onClicked.addListener(async () => {
	const { one } = await chrome.storage.local.get([OPT_KEY]);

	const open = () =>
		chrome.tabs.create({ url: 'https://mail.google.com/mail/' });

	if (!one) {
		open();
		return;
	}

	const tabs = await chrome.tabs.query({
		url: '*://mail.google.com/*',
		currentWindow: true,
	});

	if (tabs[0]) chrome.tabs.update(tabs[0].id, { active: true });
	else open();
});

/** Initialization **/

chrome.runtime.onInstalled.addListener(() => {
	// TODO: Convert to a promise
	chrome.runtime.getPlatformInfo(({ os }) => {
		// TODO: Fix: `chrome.i18n.getMessage()` is unavailable
		const menuTitle = chrome.i18n
			.getMessage('one')
			.replace(/@(\w)/g, (_, msg) => (os === 'mac' ? msg : msg.toLowerCase()));

		chrome.contextMenus.create({
			id: MENU_ID,
			type: 'checkbox',
			title: menuTitle,
			contexts: ['action'],
		});
	});
});

/** Option & permission **/

chrome.contextMenus.onClicked.addListener(async ({ checked }) => {
	const permission = { permissions: ['tabs'] };
	const saveOption = (on) => chrome.storage.local.set({ [OPT_KEY]: on });

	if (!checked) {
		chrome.permissions.remove(permission);
		saveOption(false);
		return;
	}

	chrome.contextMenus.update(MENU_ID, { checked: false, enabled: false });

	// TODO: update `minimum_chrome_version` and the changelog
	// when this starts working in stable Chrome
	const granted = await chrome.permissions.request(permission);
	chrome.contextMenus.update(MENU_ID, { checked: granted, enabled: true });
	saveOption(granted);
});
