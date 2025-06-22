import { FurnitureInput, FurnitureUpdateInput} from "../libs/types/furniture";
import FurnitureModel from "../Schema_models/furniture.schema.models"
import Errors, { Message } from "../libs/error";
import { HttpCode } from "../libs/error";
import { Furniture } from "../libs/types/furniture";
import { shapeIntoMongooseObjectId } from "../libs/config";
import { T } from "../libs/types/common";
import { FurnitureInquiry } from "../libs/types/furnitures";
import { FurnitureStatus } from "../libs/enums/furniture.enum";
import { ObjectId } from "mongoose";
import { ViewInput } from "../libs/types/view";
import { ViewGroup } from "../libs/enums/view.enum";
import ViewService from "./view.service";

class FurnitureService {
private readonly furnitureModel;
public ViewService: any;

constructor() {
    this.furnitureModel = FurnitureModel,
    this.ViewService = new ViewService;
}

// SPA project
public async getFurnitures(inquiry: FurnitureInquiry): Promise<Furniture[]> {
    console.log("inquiry:", inquiry);
    const match: T = { FurnitureStatus: FurnitureStatus.AVAILABLE };
    if (inquiry.furnitureCollection)
        match.furnitureCollection = inquiry.furnitureCollection;
    if(inquiry.search) {
        match.furnitureName = {
            $regex:new RegExp(inquiry.search, "i")
        };
    }
    const sort: T =
        inquiry.order === "furniturePrice"
            ? { [inquiry.order]: 1 }
            : { [inquiry.order]: -1 };
    const result = await this.furnitureModel.aggregate([
        { $match: match },
        { $sort: sort },
        { $skip: (inquiry.page * 1 - 1) * inquiry.limit },
        { $limit: inquiry.limit * 1 },
    ]).exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
}

public async getFurniture(memberId: ObjectId | null, id: string): Promise<Furniture> {
    
    const furnituretId = shapeIntoMongooseObjectId(id);
    

    let result = await this.furnitureModel.findOne({_id: furnituretId, furnitureStatus: FurnitureStatus.AVAILABLE})
    .exec();
    console.log("id ketdi", id);
    
    if (!result) throw new Errors (HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    
    // TODO: If authenticated user => first sight view log creation
    if (memberId) {
        // view log existence
        const input: ViewInput = {
            memberId: memberId,
            viewRefId: furnituretId,
            viewGroup: ViewGroup.FURNITURE
        }
        const existView = await this.ViewService.checkViewExistence(input);
        
        // insert new view 
    if (!existView) {
        console.log("planning to insert new view:");
        await this.ViewService.insertMemberView(input);

       result = await this.furnitureModel.findByIdAndUpdate(
        furnituretId, 
            { $inc: { furnitureViews: +1 } },
            { new: true }
        ).exec();
        
    }

        // Increase Counts
    }

    return result as unknown as Furniture;
}

public async getRandomFurnitures(): Promise<Furniture[]> {
    const result = await this.furnitureModel.aggregate([
        { $match: { FurnitureStatus: FurnitureStatus.AVAILABLE } },
        { $sample: { size: 2 } } 
    ]).exec();

    if (!result || result.length === 0)
        throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
}


public async getComingSoonFurniture(limit: number = 4): Promise<Furniture[]> {
    try {
        return await this.furnitureModel.find({ furnitureStatus: FurnitureStatus.OUT_OF_STOCK })
            .sort({ updatedAt: -1 }) 
            .limit(limit)
            .lean(); 
    } catch (err) {
        console.error("Error fetching coming soon furniture:", err);
        throw new Error("Failed to fetch coming soon furniture");
    }
}



// SSR project 

public async getAllFurnitures():Promise<Furniture[]> {
    
    const result = await this.furnitureModel.find().exec();
    if (!result) throw new Errors (HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result as unknown as Furniture[];
 }

public async createNewProduct(input:FurnitureInput): Promise<Furniture>
 {
    try {
      const result = await this.furnitureModel.create(input);
      return result as unknown as Furniture;
    }catch (err) {
        console.error("error, model:createNewProduct:", err)
        throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
 }

public async updateChosenProduct (
    id: string,
    input: FurnitureUpdateInput
 ): Promise<Furniture> {
    // string => ObjectID 
    id = shapeIntoMongooseObjectId(id);
    const result = await this.furnitureModel.findOneAndUpdate({_id: id}, input, {new:true} )
    .exec();
    if (!result) throw new Errors (HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result as unknown as Furniture;
 }

}


export default FurnitureService;