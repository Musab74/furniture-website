import mongoose, { Schema } from "mongoose";
import {
    FurnitureCollection,
    FurnitureSize,
    FurnitureStatus,
    FurnitureCapacity
} from "../libs/enums/furniture.enum";

const furnitureSchema = new Schema(
    {
        furnitureStatus: {
            type: String,
            enum: FurnitureStatus,
            default: FurnitureStatus.OUT_OF_STOCK
        },

        furnitureName: {
            type: String,
            required: true,
        },

        furnitureCollection: {
            type: String,
            enum: FurnitureCollection,
            required: true,
        },

        furniturePrice: {
            type: Number,
            required: true,
        },

        furnitureLeftCount: {
            type: Number,
            default: 0
        },

        furnitureSize: {
            type: String,
            enum: FurnitureSize,
            default: FurnitureSize.MEDIUM
        },

        furnitureVolume: {
            type: String,
            enum: FurnitureCapacity,
            default: FurnitureCapacity.DOUBLE
        },

        furnitureDesc: {
            type: String,
            required: true
        },

        furnitureImages: {
            type: Array,
            default: []
        },

        furnitureViews: {
            type: Number,
            default: 0,
        },

    },
    { timestamps: true }
);

// Ensure uniqueness on name + volume
furnitureSchema.index({ furnitureName: 1, furnitureVolume: 1 }, { unique: true });

export default mongoose.model("Furniture", furnitureSchema);
