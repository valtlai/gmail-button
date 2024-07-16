const tabsPermission = { permissions: ['tabs'] };
const MENU_ID = 'one';

/** Opening tab **/

chrome.action.onClicked.addListener(async () => {
	const oneTabOnly = await chrome.permissions.contains(tabsPermission);

	const open = () =>
		chrome.tabs.create({ url: 'https://mail.google.com/mail/' });

	if (!oneTabOnly) {
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
	if (!checked) {
		chrome.permissions.remove(tabsPermission);
		return;
	}

	chrome.contextMenus.update(MENU_ID, { checked: false, enabled: false });

	const granted = await chrome.permissions.request(tabsPermission);
	chrome.contextMenus.update(MENU_ID, { checked: granted, enabled: true });
});
