// scaffold out a service worker
// https://developers.google.com/web/tools/workbox/guides/generate-service-worker/workbox-build

let active = false;

function makeColor(color: string): void {
    document.body.style.backgroundColor = color;
}

console.log('MGD: background script loaded')

chrome.action.onClicked.addListener((tab) => {
    active = !active;
    const color = active ? 'orange' : 'white';
    console.log('MGD: background script clicked', color);
    chrome.scripting.executeScript({
        target: { tabId: tab.id ? tab.id : -1 },
        func: makeColor,
        args: [color],
    }).then();
});