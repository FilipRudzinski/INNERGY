import {ServiceType} from "../index";

export class ServiceDependency {
    constructor(public mainService: ServiceType, public dependentServices: ServiceType[]) {
    }
}