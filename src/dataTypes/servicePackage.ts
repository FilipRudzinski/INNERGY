import {ServiceType, ServiceYear} from "../index";

export class ServicePackage {
    constructor(public requiredServices: ServiceType[][], public year: ServiceYear, public discountValue: number) {
    }
}