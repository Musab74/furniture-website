import { FurnitureCollection, FurnitureSize, FurnitureStatus } from "../enums/furniture.enum";
import { ObjectId } from "mongoose";

export interface Furniture {
    _id: ObjectId;
    furnitureStatus: FurnitureStatus;
    furnitureCollection: FurnitureCollection;
    furnitureName: string;
    furniturePrice: number;
    furnitureLeftCount: number;
    furnitureSize: FurnitureSize;
    furnitureVolume: number;
    furnitureDesc?: string;
    furnitureImages: string[];
    furnitureViews: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface FurnitureInquiry {
    order: string;
    page: number;
    limit: number;
    furnitureCollection?: FurnitureCollection;
    search?: string;
}

export interface FurnitureInput {
    furnitureStatus?: FurnitureStatus;
    furnitureCollection: FurnitureCollection;
    furnitureName: string;
    furniturePrice: number;
    furnitureLeftCount: number;
    furnitureSize?: FurnitureSize;
    furnitureVolume?: number;
    furnitureDesc?: string;
    furnitureImages: string[];
}

export interface FurnitureUpdateInput {
    _id: ObjectId;
    furnitureStatus?: FurnitureStatus;
    furnitureCollection?: FurnitureCollection;
    furnitureName?: string;
    furniturePrice?: number;
    furnitureLeftCount?: number;
    furnitureSize?: FurnitureSize;
    furnitureVolume?: number;
    furnitureDesc?: string;
    furnitureImages?: string[];
    furnitureViews?: number;
}
