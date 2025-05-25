import { FurnitureInput, FurnitureUpdateInput} from "../libs/types/furniture";
import FurnitureModel from "../Schema_models/furniture.schema.models"
import Errors, { Message } from "../libs/error";
import { HttpCode } from "../libs/error";
import { Furniture } from "../libs/types/furniture";
import { shapeIntoMongooseObjectId } from "../libs/config";
import { memberType } from "../libs/enums/member.enum";

class FurnitureService {
private readonly furnitureModel;

constructor() {
    this.furnitureModel = FurnitureModel
}

// SSR
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