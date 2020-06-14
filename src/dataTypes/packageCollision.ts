import {ServicePackage} from "./servicePackage";

export class PackageCollision {
    constructor(public servicePackage: ServicePackage, public collisions: ServicePackage[]) {
        collisions.push(servicePackage);
    }
}