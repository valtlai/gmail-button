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

	const [tab] = await chrome.tabs.query({
		url: '*://mail.google.com/*',
		currentWindow: true,
	});

	if (tab) chrome.tabs.update(tab.id, { active: true });
	else open();
});

/** Initialization **/

chrome.runtime.onInstalled.addListener(async () => {
	const { os } = await chrome.runtime.getPlatformInfo();

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

	const granted = await chrome.permissions.request(permission);
	chrome.contextMenus.update(MENU_ID, { checked: granted, enabled: true });
	saveOption(granted);
});
