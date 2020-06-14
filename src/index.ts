import {packages, priceConfigurations, serviceDependencies} from "./database/hardcodedDb";
import {canAddToPackage, deselectDependentServices} from "./functionsLib/serviceFunctions";
import {calculateBasePrice, calculateFinalPrice} from "./functionsLib/priceFunctions";


export type ServiceYear = 2020 | 2021 | 2022;
export type ServiceType = "Photography" | "VideoRecording" | "BlurayPackage" | "TwoDayEvent" | "WeddingSession";

export function updateSelectedServices(
    previouslySelectedServices: ServiceType[],
    action: { type: "Select" | "Deselect"; service: ServiceType }) {
    switch (action.type) {
        case "Select":
            if (canAddToPackage(previouslySelectedServices, action.service, serviceDependencies)) {
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

export function calculatePrice(selectedServices: ServiceType[], selectedYear: ServiceYear) {
    let basePrice = calculateBasePrice(selectedServices, selectedYear, priceConfigurations);
    let finalPrice = calculateFinalPrice(selectedServices, selectedYear, packages, basePrice);
    return ({basePrice: basePrice, finalPrice: finalPrice});
}


