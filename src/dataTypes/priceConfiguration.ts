import {ServiceType, ServiceYear} from "../index";

export class PriceConfiguration {
    constructor(public service: ServiceType, public year: ServiceYear, public price: number) {
    }
}