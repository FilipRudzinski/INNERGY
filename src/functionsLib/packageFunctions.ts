import {compareRequiredServices} from "./serviceFunctions";
import {ServiceType, ServiceYear} from "../index";
import {ServicePackage} from "../dataTypes/servicePackage";
import {PackageCollision} from "../dataTypes/packageCollision";

export function getPossiblePackagesForServices(selectedServices: ServiceType[], selectedYear: ServiceYear, servicePackages: ServicePackage[]) {
    let possiblePackages: ServicePackage[] = [];
    servicePackages.forEach(function (servicePackage: ServicePackage) {
        //Can package be applied for selected service? Check also if package already exist on list
        if (canApplyPackageToServices(servicePackage, selectedServices, selectedYear) && !packageAlreadyExists(servicePackage, possiblePackages)) {
            possiblePackages.push(servicePackage);
        }
    });
    return possiblePackages;
}

function packageAlreadyExists(servicePackage: ServicePackage, packages: ServicePackage[]) {
    return packages.some(x => compareRequiredServices(x.requiredServices, servicePackage.requiredServices)
        && servicePackage.year == x.year);
}

function canApplyPackageToServices(servicePackage: ServicePackage, selectedServices: ServiceType[], selectedYear: ServiceYear) {
    return servicePackage.requiredServices.some(a => a.every(x => selectedServices.includes(x)
        && (servicePackage.year == null || servicePackage.year == selectedYear)));
}

export function filterCollidedPackages(possiblePackages: ServicePackage[]) {
    let packageCollisions: PackageCollision[] = [];
    //Enumerate packages and detect collisions
    possiblePackages.forEach(function (servicePackage: ServicePackage) {
        let otherPackagers = possiblePackages.filter(x => x != servicePackage);
        let collisions = getPackagesCollision(servicePackage, otherPackagers);
        if (collisions.length > 0) {
            let cols: ServicePackage[] = [];
            collisions.forEach(a => cols.push(a))
            let newCollision = new PackageCollision(servicePackage, cols);
            if (!packageCollisionAlreadyExists(newCollision, packageCollisions)) {
                packageCollisions.push(new PackageCollision(servicePackage, collisions));
            }
        }
    });
    packageCollisions.forEach(x => {
        //Choose best package
        let result = getBestPackage(x);
        result.rest.forEach(x => {
            //Remove packages that collides
            possiblePackages = possiblePackages.filter(a => a != x);
        })
    });
    return possiblePackages;
}

function getBestPackage(packageCollision: PackageCollision) {
    const sorted = packageCollision.collisions.sort((a, b) => {
        return b.discountValue - a.discountValue;
    });
    return {bestPackage: sorted[0], rest: sorted.filter(x => x !== sorted[0])};
}

function packageCollisionAlreadyExists(packageCollision: PackageCollision, packageCollisions: PackageCollision[]) {
    return packageCollisions.some(x => packageCollisionsAreEqual(packageCollision, x));
}

function packageCollisionsAreEqual(packageCollisionA: PackageCollision, packageCollisionB: PackageCollision) {
    return packageCollisionA.collisions.some(x => packageCollisionB.collisions.some(y => compareRequiredServices(y.requiredServices, x.requiredServices)));
}

function getPackagesCollision(servicePackage: ServicePackage, possiblePackages: ServicePackage[]) {
    return possiblePackages.filter(x => compareRequiredServices(x.requiredServices, servicePackage.requiredServices));
}