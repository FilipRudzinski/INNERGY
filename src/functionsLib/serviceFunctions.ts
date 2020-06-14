import {ServiceType} from "../index";
import {ServiceDependency} from "../dataTypes/serviceDependency";
import {compareArrays} from "../utils";


export function deselectDependentServices(previouslySelectedServices: ServiceType[], service: ServiceType, serviceDependencies: ServiceDependency[]) {
    let mainService = getMainService(service, serviceDependencies);
    //If is main service then remove dependent sub-services
    if (mainService != null) {
        mainService.dependentServices.forEach(value => {
            //If service also depends on other main service then needs to stay
            if (needToRemoveDependentService(value, previouslySelectedServices, serviceDependencies)) {
                previouslySelectedServices = previouslySelectedServices.filter(item => item !== value)
            }
        });
    }
    return previouslySelectedServices;
}

function needToRemoveDependentService(dependentService: ServiceType, previouslySelectedServices: ServiceType[], serviceDependencies: ServiceDependency[]) {
    return !serviceDependencies.some(x => previouslySelectedServices.includes(x.mainService));
}

function getMainService(service: ServiceType, serviceDependencies: ServiceDependency[]) {
    return serviceDependencies.find(x => x.mainService == service);
}

export function getMainServiceByDependent(service: ServiceType, serviceDependencies: ServiceDependency[]) {
    return serviceDependencies.find(x => x.dependentServices.includes(service));
}

export function compareRequiredServices(requiredServicesA: ServiceType[][], requiredServicesB: ServiceType[][]) {
    return requiredServicesA.some(x =>
        requiredServicesB.some(a => compareArrays(a, x))
    )
}

export function canAddToPackage(previouslySelectedServices: ServiceType[], service: ServiceType, serviceDependencies: ServiceDependency[]) {
    if (previouslySelectedServices.includes(service)) return false;
    return canAddSubService(previouslySelectedServices, service, serviceDependencies);
}

function canAddSubService(previouslySelectedServices: ServiceType[], service: ServiceType, serviceDependencies: ServiceDependency[]) {
    if (getMainServiceByDependent(service, serviceDependencies) != null) {
        return serviceDependencies.some(x => x.dependentServices.includes(service) && previouslySelectedServices.includes(x.mainService))
    }
    return true;
}