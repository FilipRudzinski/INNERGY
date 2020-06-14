export type ServiceYear = 2020 | 2021 | 2022;
export type ServiceType = "Photography" | "VideoRecording" | "BlurayPackage" | "TwoDayEvent" | "WeddingSession";

class ServiceDependency {
    constructor(public mainService: ServiceType,public dependentServices: ServiceType[]) {}
}

class PriceConfiguration {
    constructor(public service: ServiceType,public year : ServiceYear, public price : number) {
    }
}

class Package{
    constructor(public requiredServices: ServiceType[][],public year : ServiceYear, public discountValue : number) {
    }
}

class PackageCollision{
    constructor(public servicePackage: Package,public collisions: Package[]) {
        collisions.push(servicePackage);
    }
}

const serviceDependencies =  [
    new ServiceDependency("Photography", ["TwoDayEvent"]),
    new ServiceDependency("VideoRecording", ["BlurayPackage", "TwoDayEvent"])
]

const priceConfigurations =  [
    new PriceConfiguration("Photography",2020, 1700 ),
    new PriceConfiguration("Photography",2021, 1800 ),
    new PriceConfiguration("Photography",2022, 1900 ),
    new PriceConfiguration("VideoRecording",2020, 1700 ),
    new PriceConfiguration("VideoRecording",2021, 1800 ),
    new PriceConfiguration("VideoRecording",2022, 1900 ),
    new PriceConfiguration("BlurayPackage",null, 300 ),
    new PriceConfiguration("TwoDayEvent",null, 400 ),
    new PriceConfiguration("WeddingSession",null, 600 ),
]

const packages = [
    new Package([["Photography","VideoRecording"]], 2020, 1200),
    new Package([["Photography","VideoRecording"]], 2021, 1300 ),
    new Package([["Photography","VideoRecording"]], 2022, 1300 ),
    new Package([["WeddingSession", "Photography"],["WeddingSession", "VideoRecording"]], null, 300 ),
    new Package([["WeddingSession", "Photography"]], 2022, 600 ),
]

export function updateSelectedServices (
    previouslySelectedServices: ServiceType[],
    action: { type: "Select" | "Deselect"; service: ServiceType })
{
    switch (action.type) {
        case "Select":
            if(canAddToPackage(previouslySelectedServices, action.service, serviceDependencies))
            {
                previouslySelectedServices.push(action.service);
            }
            break;
        case "Deselect":
            previouslySelectedServices = previouslySelectedServices.filter(item => item !== action.service)
            previouslySelectedServices = deselectDependentServices(previouslySelectedServices, action.service, serviceDependencies);
            break;
    }
    return previouslySelectedServices;
}

function deselectDependentServices(previouslySelectedServices: ServiceType[], service: ServiceType, serviceDependencies : ServiceDependency[]) {
    let mainService = getMainService(service,serviceDependencies);
    if(mainService != null){
        mainService.dependentServices.forEach(value => {
            if(needToRemoveDependentService(value, previouslySelectedServices,serviceDependencies)){
                previouslySelectedServices = previouslySelectedServices.filter(item => item !== value)
            }
        });
    }
    return previouslySelectedServices;
}

function needToRemoveDependentService(dependentService: ServiceType,previouslySelectedServices: ServiceType[] ,serviceDependencies : ServiceDependency[]) {
    return !serviceDependencies.some(x => previouslySelectedServices.includes(x.mainService));
}

function getMainService(service: ServiceType, serviceDependencies : ServiceDependency[]) {
    return serviceDependencies.find(x => x.mainService == service);
}

function canAddToPackage(previouslySelectedServices: ServiceType[], service: ServiceType, serviceDependencies : ServiceDependency[]) {
    if(previouslySelectedServices.includes(service)) return false;
    return canAddSubService(previouslySelectedServices,service,serviceDependencies);
}

function canAddSubService(previouslySelectedServices: ServiceType[], service: ServiceType, serviceDependencies : ServiceDependency[]) 
{
    if(getMainServiceByDependent(service,serviceDependencies) != null){
        return serviceDependencies.some(x => x.dependentServices.includes(service) && previouslySelectedServices.includes(x.mainService))
    }
    return true;
}

function getMainServiceByDependent(service: ServiceType, serviceDependencies : ServiceDependency[]) {
    return serviceDependencies.find(x => x.dependentServices.includes(service));
}

export function calculatePrice (selectedServices: ServiceType[], selectedYear: ServiceYear) {
    let basePrice = 0;
    let finalPrice = 0;
    basePrice = calculateBasePrice(selectedServices,selectedYear, priceConfigurations);
    finalPrice = calculateFinalPrice(selectedServices,selectedYear, packages, basePrice);
    return ({basePrice: basePrice, finalPrice: finalPrice});
}


function calculateBasePrice(selectedServices: ServiceType[], selectedYear: ServiceYear ,priceConfiguration: PriceConfiguration[]) {
    let basePrice = 0;
    selectedServices.forEach(
        function (serviceType: ServiceType) {
            basePrice += getPriceFor(serviceType,selectedYear,priceConfiguration);
        });
    return basePrice;
}

function getPriceFor(service: ServiceType,selectedYear: ServiceYear ,priceConfigurations: PriceConfiguration[]) {
    let priceConfiguration = priceConfigurations.find(x => x.service == service && (x.year == selectedYear || x.year == null));
    if(priceConfiguration != null){
        return priceConfiguration.price;
    }
    return 0;
}

function calculateFinalPrice(selectedServices: ServiceType[], selectedYear: ServiceYear, servicePackage: Package[], basePrice: number) {
    let finalPrice = basePrice;
    let packages = getPossiblePackagesForServices(selectedServices, selectedYear, servicePackage);
    packages = filterCollidedPackages(packages);
    packages.forEach(x => {
        finalPrice -= x.discountValue;
    });
    return finalPrice;
}

function getPossiblePackagesForServices(selectedServices: ServiceType[], selectedYear: ServiceYear, servicePackages: Package[]) {
    let possiblePackages: Package[] = [];
    servicePackages.forEach(function(servicePackage: Package){
        if(canApplyPackageToServices(servicePackage, selectedServices, selectedYear) && !packageAlreadyExists(servicePackage, possiblePackages))
        {
            possiblePackages.push(servicePackage);
        }
    });
    return possiblePackages;
}

function packageAlreadyExists(servicePackage : Package, packages: Package[]) {
    return packages.some(x => compareRequiredServices(x.requiredServices, servicePackage.requiredServices) 
        && servicePackage.year == x.year);
}

function compareRequiredServices( requiredServicesA: ServiceType[][], requiredServicesB: ServiceType[][]) {
    return requiredServicesA.some(x => 
        requiredServicesB.some(a => compareArrays(a,x))
    )
}

function compareArrays(list1 : any[], list2 : any[]) : boolean {
    if(list1.length != list2.length) return false;
    let equals = true;
    list1 = list1.sort();
    list2 = list2.sort();
    list1.forEach(function(element: any,index: number){
        let mismatch = list2[index] != element;
        if(mismatch) equals = false;
    })
    return equals;
}

function canApplyPackageToServices(servicePackage : Package, selectedServices: ServiceType[], selectedYear: ServiceYear) {
    return servicePackage.requiredServices.some(a => a.every(x => selectedServices.includes(x) 
        && (servicePackage.year == null || servicePackage.year == selectedYear)));
}

function filterCollidedPackages(possiblePackages: Package[]) {
    let packageCollisions: PackageCollision[] = [];
    possiblePackages.forEach(function(servicePackage: Package){
        let otherPackagers = possiblePackages.filter(x => x != servicePackage);
        let collisions = getPackagesCollision(servicePackage, otherPackagers);
        if(collisions.length > 0) {
            let cols: Package[] = [];
            collisions.forEach(a => cols.push(a))
            let newCollision = new PackageCollision(servicePackage, cols);
            if(!packageCollisionAlreadyExists(newCollision,packageCollisions)) {
                packageCollisions.push(new PackageCollision(servicePackage, collisions));
            }
        }
    });
    packageCollisions.forEach(x => 
    {
        let result = getBestPackage(x);
        result.rest.forEach(x => {
            possiblePackages = possiblePackages.filter(a => a != x);
        })
    });
    return possiblePackages;
}

function getBestPackage(packageCollision : PackageCollision) {
    const sorted = packageCollision.collisions.sort((a, b) => {
        return b.discountValue -  a.discountValue;
    });
    return {bestPackage: sorted[0], rest : sorted.filter(x => x !== sorted[0]) };
}

function packageCollisionAlreadyExists(packageCollision : PackageCollision ,packageCollisions: PackageCollision[]) {
    return packageCollisions.some(x => packageCollisionsAreEqual(packageCollision,x));
}

function packageCollisionsAreEqual(packageCollisionA : PackageCollision, packageCollisionB : PackageCollision) {
    return packageCollisionA.collisions.some(x => packageCollisionB.collisions.some(y => compareRequiredServices(y.requiredServices,x.requiredServices)));
   // return compareArrays(packageCollisionA.collisions, packageCollisionA.collisions);
}

function getPackagesCollision(servicePackage: Package, possiblePackages: Package[]) {
    return possiblePackages.filter(x => compareRequiredServices(x.requiredServices, servicePackage.requiredServices));
}
