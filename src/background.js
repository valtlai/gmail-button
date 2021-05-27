"use strict";

const OPT_KEY = "one";
const MENU_ID = "one";

/** Opening tab **/

chrome.browserAction.onClicked.addListener(() => {
  chrome.storage.local.get([OPT_KEY], ({ one }) => {
    const open = () =>
      chrome.tabs.create({ url: "https://mail.google.com/mail/" });

    if (!one) {
      open();
      return;
    }

    chrome.tabs.query({
      url: "*://mail.google.com/*",
      currentWindow: true,
    }, (tabs) => {
      if (tabs[0]) chrome.tabs.update(tabs[0].id, { active: true });
      else open();
    });
  });
});

/** Initialization **/

chrome.runtime.onInstalled.addListener(() => {
  chrome.runtime.getPlatformInfo(({ os }) => {
    const menuTitle = chrome.i18n.getMessage("one").replace(
      /@(\w)/gu,
      (_, p) => os === "mac" ? p.toUpperCase() : p.toLowerCase(),
    );

    chrome.contextMenus.create({
      id: MENU_ID,
      type: "checkbox",
      title: menuTitle,
      contexts: ["browser_action"],
    });
  });
});

/** Option & permission **/

chrome.contextMenus.onClicked.addListener(({ checked }) => {
  const permission = { permissions: ["tabs"] };
  const saveOption = (on) => chrome.storage.local.set({ [OPT_KEY]: on });

  if (!checked) {
    chrome.permissions.remove(permission);
    saveOption(false);
    return;
  }

  chrome.contextMenus.update(MENU_ID, { checked: false, enabled: false });

  chrome.permissions.request(permission, (granted) => {
    chrome.contextMenus.update(MENU_ID, { checked: granted, enabled: true });
    saveOption(granted);
  });
});
