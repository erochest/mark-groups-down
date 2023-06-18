
const tabs = await chrome.tabs.query({
    url: [
        "https://developer.chrome.com/docs/webstore/*",
        "https://developer.chrome.com/docs/extensions/*"
    ]
});

// Get the tabs and display them
const collator = new Intl.Collator();
tabs.sort((a, b) => collator.compare(a.title, b.title));
console.log("MarkGroupsDown/tabs", tabs);

const li_template = document.getElementById("li_template");
const elements = new Set();
for (const tab of tabs) {
    console.log("MarkGroupsDown/tab", tab);
    const element = li_template.content.firstElementChild.cloneNode(true);

    const title = tab.title.split("-")[0].trim();
    const pathname = new URL(tab.url).pathname.slice("/docs".length);

    element.querySelector(".title").textContent = title;
    element.querySelector(".pathname").textContent = pathname;
    element.querySelector("a").addEventListener("click", async () => {
        await chrome.tabs.update(tab.id, { active: true });
        await chrome.windows.update(tab.windowId, { focused: true });
    });

    elements.add(element);
}
document.querySelector("ul").append(...elements);

// Button to group tabs
const button = document.querySelector("button");
button.addEventListener("click", async () => {
    const tabIds = tabs.map(({ id }) => id);
    const group = await chrome.tabs.group({ tabIds });
    await chrom.tabGroups.update(group, { title: "DOCS" });
});