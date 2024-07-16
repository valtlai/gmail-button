const tabsPermission = { permissions: ['tabs'] };
const menuItemId = 'oneTabOnly';

// Extension clicked on the browser toolbar:
// Open or activate a Gmail tab
chrome.action.onClicked.addListener(async () => {
	const oneTabOnly = await chrome.permissions.contains(tabsPermission);

	const openNewTab = () =>
		chrome.tabs.create({ url: 'https://mail.google.com/mail/' });

	if (!oneTabOnly) {
		openNewTab();
		return;
	}

	const [existingTab] = await chrome.tabs.query({
		url: '*://mail.google.com/*',
		currentWindow: true,
	});

	if (existingTab) {
		chrome.tabs.update(existingTab.id, { active: true });
	} else {
		openNewTab();
	}
});

// Extension installed:
// Create a context menu item for the option to activate an existing Gmail tab
chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: menuItemId,
		type: 'checkbox',
		title: chrome.i18n.getMessage('oneTabOnly'),
		contexts: ['action'],
	});
});

// Context menu item clicked:
// Request or remove the permission to query tabs
chrome.contextMenus.onClicked.addListener(async ({ checked }) => {
	if (!checked) {
		chrome.permissions.remove(tabsPermission);
		return;
	}

	chrome.contextMenus.update(menuItemId, {
		checked: false, // keep unchecked while a permission prompt is present
		enabled: false, // avoid duplicate permission prompts
	});

	const granted = await chrome.permissions.request(tabsPermission);
	chrome.contextMenus.update(menuItemId, {
		checked: granted,
		enabled: true,
	});
});
