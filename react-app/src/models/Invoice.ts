import {Customer} from "./Customer";
import {Item} from "./Item";

export interface Invoice {
    customer: Customer,
    items: Item[],
    totalMoney: number
}

export interface InvoiceXLSXRow {
    id: string|number
    contractCode: number|string,
    itemOrder: number,
    itemName: string,
    unitType: string,
    quantity: number,
    price: number,
    tax: number,
    thanhTien: number
    tongTien: number,
    tienThue: number
    itemType: number,

}

export interface InvoiceXLSXFirstRow extends InvoiceXLSXRow{
    taxNumber: string,
    customerName: string,
    customerFirm: string,
    customerAddress: string,
    customerMail: string,
    customerPhone: string,
    customerBankAcct: string,
    customerBankName: string,
    customerCode: string,
    paymentType: number,
    currency: string,
    // below field is total item info, fill with first row of each customer
    tongTienTruocThue: number,
    tygia: number,
    tongTienThue: number,
    tongTienDaCoThue: number,
    moneyAsText: string
}