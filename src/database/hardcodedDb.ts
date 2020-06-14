import {ServiceDependency} from "../dataTypes/serviceDependency";
import {PriceConfiguration} from "../dataTypes/priceConfiguration";
import {ServicePackage} from "../dataTypes/servicePackage";

export const serviceDependencies = [
    new ServiceDependency("Photography", ["TwoDayEvent"]),
    new ServiceDependency("VideoRecording", ["BlurayPackage", "TwoDayEvent"])
]
export const priceConfigurations = [
    new PriceConfiguration("Photography", 2020, 1700),
    new PriceConfiguration("Photography", 2021, 1800),
    new PriceConfiguration("Photography", 2022, 1900),
    new PriceConfiguration("VideoRecording", 2020, 1700),
    new PriceConfiguration("VideoRecording", 2021, 1800),
    new PriceConfiguration("VideoRecording", 2022, 1900),
    new PriceConfiguration("BlurayPackage", null, 300),
    new PriceConfiguration("TwoDayEvent", null, 400),
    new PriceConfiguration("WeddingSession", null, 600),
]
export const packages = [
    new ServicePackage([["Photography", "VideoRecording"]], 2020, 1200),
    new ServicePackage([["Photography", "VideoRecording"]], 2021, 1300),
    new ServicePackage([["Photography", "VideoRecording"]], 2022, 1300),
    new ServicePackage([["WeddingSession", "Photography"], ["WeddingSession", "VideoRecording"]], null, 300),
    new ServicePackage([["WeddingSession", "Photography"]], 2022, 600),
]