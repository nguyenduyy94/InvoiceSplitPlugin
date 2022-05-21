import {Invoice} from "./models/Invoice";
import {Progress} from "./models/Progress";

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
            await startFillForm(request.payload, sendResponse);
            sendResponse("OK")
        }
    }
);

async function startFillForm(invoices:Invoice[], sendResponse:(response:Progress)=>void) {
    if (window.location.hostname !== 'hoadon789.com') {
        sendResponse({ error : "Invalid website", message: "Invalid website"});
        return
    }

    document.getElementsByTagName("a");
    // Begin fill data & feed back progress
    sendResponse({message: "Starting", percent: 0});

    for (const invoice of invoices) {
        const {customer, items} = invoice;
        sendResponse({message: 'Customer ' + customer.name, percent: 1})
    }
}

console.log('Content Script Injected!!');