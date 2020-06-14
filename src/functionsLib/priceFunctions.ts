import {filterCollidedPackages, getPossiblePackagesForServices} from "./packageFunctions";
import {ServiceType, ServiceYear} from "../index";
import {PriceConfiguration} from "../dataTypes/priceConfiguration";
import {ServicePackage} from "../dataTypes/servicePackage";


export function calculateBasePrice(selectedServices: ServiceType[], selectedYear: ServiceYear, priceConfiguration: PriceConfiguration[]) {
    let basePrice = 0;
    //Add up all service prices
    selectedServices.forEach(
        function (serviceType: ServiceType) {
            basePrice += getPriceFor(serviceType, selectedYear, priceConfiguration);
        });
    return basePrice;
}

function getPriceFor(service: ServiceType, selectedYear: ServiceYear, priceConfigurations: PriceConfiguration[]) {
    let priceConfiguration = priceConfigurations.find(x => x.service == service && (x.year == selectedYear || x.year == null));
    if (priceConfiguration != null) {
        return priceConfiguration.price;
    }
    return 0;
}

export function calculateFinalPrice(selectedServices: ServiceType[], selectedYear: ServiceYear, servicePackage: ServicePackage[], basePrice: number) {
    let finalPrice = basePrice;
    //Gets all possible packages
    let packages = getPossiblePackagesForServices(selectedServices, selectedYear, servicePackage);
    //Filter packages that collide with others, and choose greater discount
    packages = filterCollidedPackages(packages);
    //Apply discount
    packages.forEach(x => {
        finalPrice -= x.discountValue;
    });
    return finalPrice;
}