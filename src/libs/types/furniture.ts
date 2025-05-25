import { ObjectId } from "mongoose";
import {
    FurnitureCollection,
    FurnitureStatus,
    FurnitureSize,
    FurnitureCapacity
} from "../enums/furniture.enum";

export interface Furniture {
    _id: ObjectId;
    furnitureStatus: FurnitureStatus;
    furnitureCollection: FurnitureCollection;
    furnitureName: string;
    furniturePrice: number;
    furnitureLeftCount: number;
    furnitureSize: FurnitureSize;
    furnitureCapacity: FurnitureCapacity;
    furnitureDesc?: string;
    furnitureImages: string[];
    furnitureViews: number;
}

export interface FurnitureInput {
    furnitureStatus?: FurnitureStatus;
    furnitureCollection: FurnitureCollection;
    furnitureName: string;
    furniturePrice: number;
    furnitureLeftCount: number;
    furnitureSize?: FurnitureSize;
    furnitureCapacity?: FurnitureCapacity;
    furnitureDesc?: string;
    furnitureImages: string[];
    furnitureViews: number;
}

export interface FurnitureUpdateInput {
    _id: ObjectId;
    furnitureStatus?: FurnitureStatus;
    furnitureCollection?: FurnitureCollection;
    furnitureName?: string;
    furniturePrice?: number;
    furnitureLeftCount?: number;
    furnitureSize?: FurnitureSize;
    furnitureCapacity?: FurnitureCapacity;
    furnitureDesc?: string;
    furnitureImages?: string[];
    furnitureViews?: number;
}
