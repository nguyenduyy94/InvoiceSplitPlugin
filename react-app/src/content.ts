import {Invoice} from "./models/Invoice";
import {Progress} from "./models/Progress";
import {Item} from "./models/Item";

const port = chrome.runtime.connect();

const MAUSOHD_ID = 'mau-so-hdon';
const VALUE_1C22TSS = '621345db021ce9aa6bd5c12a'
const HINH_THUC_THANH_TOAN_ID = 'hinh-thuc-thanh-toan';
const HO_TEN_ID = 'kh-ho-ten-nguoi-mua';
const DIA_CHI_ID = 'kh-dia-chi';
const SDT_ID = 'kh-so-dt';
const ADD_ITEM_DATA_ACTION = 'add-to-grid';
const TABLE_ID = 'grid';
const STT_NAME = 'STT';
const TEN_HANG_HOA_NAME = 'ProductName';
const MA_SP_NAME = 'ProductName';
const UNIT_NAME = 'Unit';
const SOLUONG_NAME = 'Quantity';
const DONGIA_NAME = 'Price';
const THANHTIEN_NAME = 'Total';
const VAT_NAME = 'VATRate';
const SUBMIT_DATA_ACTION = "accept";
const MODAL_OK_CLASSNAME = 'ajs-button btn btn-sm btn-primary btn-ses';
const MODAL_OK_TEXT = "OK";
const MST_NGUOI_BAN_ID = 'nban-mst';

const delay = (ms:any) => new Promise(res => setTimeout(res, ms));

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
            console.log("Start Fill Form");
            await startFillForm(request.payload, sendResponse);
        }
    }
);

async function startFillForm(invoices:Invoice[], sendResponse:(response:Progress)=>void) {
    // let mstEle = document.getElementById(MST_NGUOI_BAN_ID);
    // while (!mstEle) {
    //     console.log("Wait 3s...");
    // }
    const website = "hoadon78.sesgroup.vn/hddt/main/einvoices/init";

    for (const invoice of invoices) {

        if (window.location.hostname.indexOf(website) > 0) {
            console.log({ error : "Invalid website", message: "Please navigate to https://hoadon78.sesgroup.vn/hddt/main/einvoices/init first", percent: 0});
            return
        }

        const createBtn = document.querySelector('[data-action="einvoice-cre"]');
        if (createBtn != null) {
            // @ts-ignore
            createBtn.click();
        } else {
            console.log({ error : "Invalid website", message: "Button einvoice-cre not found"});
        }

        await delay(5000);

        const err = await fillInvoice(invoices[0]);

        if (err) {
            console.warn(err);
        }

        const submitBtn = document.querySelector('[data-action="' + SUBMIT_DATA_ACTION + '"]');
        if (submitBtn != null) {
            (submitBtn as HTMLButtonElement).click();
        } else {
            console.log({error: "Button " + SUBMIT_DATA_ACTION + " not found", message: ""});
        }

        await delay(5000);

        const okBtnCandidates: HTMLCollectionOf<Element> = document.getElementsByClassName(MODAL_OK_CLASSNAME);
        let okBtn = null;
        for (let i = 0; i < okBtnCandidates.length; i++) {
            if (okBtnCandidates[i].innerHTML === MODAL_OK_TEXT) {
                okBtn = okBtnCandidates[i]
            }
        }

        if (okBtn == null) {
            console.log({error: "Button " + MODAL_OK_TEXT + " not found", message: ""})
        } else {
            (okBtn as HTMLButtonElement).click();
            await delay(5000);
        }
    }

    console.log({message: 'END',  percent: 100});
}

const fillInvoice = async (invoice:Invoice) => {
    console.log("fillInvoice " + JSON.stringify(invoice.customer));
    let err = await fillCustomerInfo(invoice.customer.name, invoice.customer.address, invoice.customer.phone || '', "3");
    if (err) {
        return err;
    }
    err = await fillItems(invoice.items);
    if (err) {
        return err;
    }
    return null;
};

const fillCustomerInfo = async (name:string, address:string, phone:string, hinhThucThanhToan:string) => {
    console.log("fillCustomerInfo...");
    console.log("MAUHOSO...");
    const mausoEle:HTMLElement|null = document.getElementById(MAUSOHD_ID);
    if (mausoEle) {
        (mausoEle as HTMLSelectElement).value = VALUE_1C22TSS
    } else {
        return 'Can not find element ' + MAUSOHD_ID
    }

    await delay(2000);

    console.log("HOTEN...");
    const nameEle:HTMLElement|null = document.getElementById(HO_TEN_ID);
    if (nameEle) {
        (nameEle as HTMLInputElement).value = name
    } else {
        return 'Can not find element ' + HO_TEN_ID
    }

    await delay(2000);


    console.log("SDT...");
    const phoneEle:HTMLElement|null = document.getElementById(SDT_ID);
    if (phoneEle) {
        (phoneEle as HTMLInputElement).value = phone
    } else {
        return 'Can not find element ' + SDT_ID
    }
    await delay(2000);


    console.log("DIA CHI...");
    const addressEle:HTMLElement|null = document.getElementById(DIA_CHI_ID);
    if (addressEle) {
        (addressEle as HTMLInputElement).value = address
    } else {
        return 'Can not find element ' + DIA_CHI_ID
    }
    await delay(2000);


    console.log("HHTT...");

    const hhttEle:HTMLElement|null = document.getElementById(HINH_THUC_THANH_TOAN_ID);
    if (hhttEle) {
        (hhttEle as HTMLSelectElement).value = hinhThucThanhToan
    } else {
        return 'Can not find element ' + HINH_THUC_THANH_TOAN_ID
    }
    await delay(2000);


    return null;
};

const fillItems = async (items:Item[]) => {
    const tableEle = document.getElementById(TABLE_ID);
    if (tableEle) {
        const addRowBtn = document.querySelector('[data-action="'+ ADD_ITEM_DATA_ACTION  +'"]');
        if (addRowBtn) {
            for (let i = 0; i < items.length; i++) {
                await delay(2000);
                (addRowBtn as HTMLButtonElement).click()

            }

        } else {
            return 'Can not find button ' + ADD_ITEM_DATA_ACTION
        }

        const rowEles:NodeListOf<Element> = tableEle.querySelectorAll('[role="row"]');
        if (rowEles.length <= 1) {
            return 'Table rows seems not available'
        } else {
            for (let i = 1; i < rowEles.length; i++) {
                const row:Element = rowEles[i];
                if (i <= items.length) {
                    await fillItem(row, items[i - 1], i)
                }
            }
        }
        return null;
    } else {
        return 'Can not find table ' + TABLE_ID;
    }

};


const keyboardEnterEvent = new KeyboardEvent('keydown', {
    code: 'Enter',
    key: 'Enter',
    charCode: 13,
    keyCode: 13,
    view: window,
    bubbles: true
});

const fillItem = async (row:Element, data:Item, index:number) => {
    console.log("fillItem " + JSON.stringify(data));
    const sttEle = row.querySelector('[name="' + STT_NAME + '"]');
    console.log("STT");
    if (sttEle) {
        (sttEle as HTMLInputElement).value = index.toString();
        sttEle.dispatchEvent(keyboardEnterEvent);
    } else {
        return 'Can not find cell ' + STT_NAME  + " at row " + index
    }
    await delay(2000);

    const nameEle = row.querySelector('[name="' + TEN_HANG_HOA_NAME + '"]');
    console.log("ProducName");
    if (nameEle) {
        (nameEle as HTMLInputElement).value = data.name
        nameEle.dispatchEvent(keyboardEnterEvent);
    } else {
        return 'Can not find cell ' + TEN_HANG_HOA_NAME  + " at row " + index
    }
    await delay(2000);

    console.log("Unit");
    const unitEle = row.querySelector('[name="' + UNIT_NAME + '"]');
    if (unitEle) {
        (unitEle as HTMLInputElement).value = data.unit
        unitEle.dispatchEvent(keyboardEnterEvent);
    } else {
        return 'Can not find cell ' + UNIT_NAME  + " at row " + index
    }
    await delay(2000);


    console.log("Quantity");
    const soluongEle = row.querySelector('[name="' + SOLUONG_NAME + '"]');
    if (soluongEle) {
        (soluongEle as HTMLInputElement).value = data.quantity.toString()
        soluongEle.dispatchEvent(keyboardEnterEvent);
    } else {
        return 'Can not find cell ' + SOLUONG_NAME  + " at row " + index
    }
    await delay(2000);


    console.log("Price");
    const priceEle = row.querySelector('[name="' + DONGIA_NAME + '"]');
    if (priceEle) {
        (priceEle as HTMLInputElement).value = data.price.toString();
        priceEle.dispatchEvent(keyboardEnterEvent);
    } else {
        return 'Can not find cell ' + DONGIA_NAME  + " at row " + index
    }
    await delay(2000);


    return null;
};

console.log('Content Script Injected!!');