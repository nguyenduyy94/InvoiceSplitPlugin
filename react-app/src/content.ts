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
    const website = "https://hoadon78.sesgroup.vn/hddt/main/einvoices/init";
    if (window.location.hostname !== website) {
        sendResponse({ error : "Invalid website", message: "Please navigate to https://hoadon78.sesgroup.vn/hddt/main/einvoices/init first"});
        return
    }

    const createBtn = document.querySelector('[data-action="einvoice-cre"]');
    if (createBtn != null) {
        // @ts-ignore
        createBtn.click();
    } else {
        sendResponse({ error : "Invalid website", message: "Button einvoice-cre not found"});
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