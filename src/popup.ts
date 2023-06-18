export {}

async function init() {
    const tabs = await chrome.tabs.query({
        url: [
            "https://developer.chrome.com/docs/webstore/*",
            "https://developer.chrome.com/docs/extensions/*"
        ]
    });

    // Get the tabs and display them
    const collator = new Intl.Collator();
    tabs.sort((a, b) => {
        const a_title = a.title || "";
        const b_title = b.title || "";
        return collator.compare(a_title, b_title)
    });
    console.log("MarkGroupsDown/tabs", tabs);

    const li_template: HTMLTemplateElement = document.getElementById("li_template") !! as HTMLTemplateElement;
    const elements: Set<HTMLElement> = new Set();
    for (const tab of tabs) {
        console.log("MarkGroupsDown/tab", tab);
        const element = li_template.content.firstElementChild?.cloneNode(true) !! as HTMLElement;

        const title = tab.title?.split("-")[0].trim();
        const pathname = new URL(tab.url ?? "").pathname.slice("/docs".length);

        setTextContent(element, ".title", title ?? "");
        setTextContent(element, ".pathname", pathname);
        addEventListener(element, "a", "click", async () => {
            await chrome.tabs.update(tab.id ?? 0, { active: true });
            await chrome.windows.update(tab.windowId, { focused: true });
        });

        elements.add(element);
    }
    document.querySelector("ul")?.append(...elements);

    // Button to group tabs
    const button = document.querySelector("button") !! as HTMLButtonElement;
    button.addEventListener("click", async () => {
        const tabIds = tabs.map(({ id }) => id ?? -1).filter((id) => id !== -1);
        const group = await chrome.tabs.group({ tabIds });
        await chrome.tabGroups.update(group, { title: "DOCS" });
    });
}

function setTextContent(element: HTMLElement, querySelector: string, text: string) {
    const target = element.querySelector(querySelector);
    if (!target) {
        return;
    }
    target.textContent = text;
}

function addEventListener(element: HTMLElement, querySelector: string, type: string, listener: EventListenerOrEventListenerObject) {
    const target = element.querySelector(querySelector);
    if (!target) {
        return;
    }
    target.addEventListener(type, listener);
}

await init();