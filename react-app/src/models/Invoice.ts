import {Customer} from "./Customer";
import {Item} from "./Item";

export interface Invoice {
    customer: Customer,
    items: Item[],
}