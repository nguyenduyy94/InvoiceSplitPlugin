const port = chrome.runtime.connect();

chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        console.log(JSON.stringify(request));

        if (request.greeting === "hello")
            sendResponse({farewell: "goodbye"});

        else if (request.type === 'getWorkspaceInfo') {
            // TODO :
        } else if (request.type === 'startFillForm') {
            await startFillForm(request.payload);
            sendResponse("OK")
        }
    }
);

async function startFillForm(invoices) {
    document.getElementsByTagName("a");
}

console.log('Content Script Injected!!');