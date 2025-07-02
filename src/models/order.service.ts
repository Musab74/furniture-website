import { Member } from "../libs/types/member";
import { shapeIntoMongooseObjectId } from "../libs/config";
import { ObjectId } from "mongoose";
import orderModel from "../Schema_models/order.model";
import orderItemModel from "../Schema_models/order.item.model";
import MemberService from "./memberService";
import Errors from "../libs/error";
import { HttpCode } from "../libs/error";
import { Message } from "../libs/error";
import { OrderItemInput } from "../libs/types/order";
import { Order } from "../libs/types/order";
import { OrderInquiry } from "../libs/types/order";
import { OrderUpdateInput } from "../libs/types/order";

class OrderService{
    private readonly orderModel;
    private readonly orderItemModel;
    private readonly memberService;

    constructor() {
        this.orderModel = orderModel;
        this.orderItemModel = orderItemModel;
        this.memberService = new MemberService();
    
    
    }
    public async createOrder(member: Member, input: OrderItemInput[]):
        Promise<Order> {
        console.log("member ariived with input", member, input);
        const memberId = shapeIntoMongooseObjectId(member._id);
        const amount = input.reduce((accumulator: number, item: OrderItemInput) => {
            return accumulator + item.itemPrice * item.itemQuantity;
        }, 0);
        try {
            const newOrder: any = await this.orderModel.create({
                orderTotal: amount,
                memberId: memberId,
            })
            const orderId = newOrder._id;
            console.log("orderId", newOrder._id);
            await this.recordOrderItem(orderId, input)

            // TODO: create order items
            return newOrder;

        } catch (err) {
            console.log("Error model:createOrder", err);
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }

    private async recordOrderItem(orderId: ObjectId, input: OrderItemInput[]):Promise<void>{
       const listPromise = input.map( async (item)=> {
           item.orderId = orderId;
           item.furnitureId = shapeIntoMongooseObjectId(item.furnitureId);
            await this.orderItemModel.create(item);
            return "Inserted";
       });

       const orderItemsState = await Promise.all(listPromise);
       console.log("orderItemsState", orderItemsState);
       
       
    }

    public async getMyOrders(member: Member, inquiry:OrderInquiry): Promise<Order[]> {
       const memberId = shapeIntoMongooseObjectId(member._id);
       const matches = {memberId: memberId, orderStatus: inquiry.orderStatus};

       const result = await this.orderModel.aggregate([
        {$match: matches},
        {$sort: {updateAt: -1}},
        {$skip: (inquiry.page -1)*inquiry.limit},
        {$limit: inquiry.limit},
        {
            $lookup: {
                from:"orderItems",
                localField: "_id",  // ikkalar id lar bir xil qiymatga ega faqat boshqa boshqa collectionsda
                foreignField: "orderId",
                as: "orderItems",
            },
        },
        {
            $lookup: {
                from: "furnitures",
                localField: "orderItems.furnitureId",
                foreignField: "_id",
                as: "furnitureDate"
            },
        },

       ]).exec();
       if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND) 
        console.log("result ", result);
         

        return result;

    }
    public async updateOrder(member:Member, input:OrderUpdateInput):Promise<Order>{
       const memberId = shapeIntoMongooseObjectId(member._id);
       const orderId = shapeIntoMongooseObjectId(input.orderId),
       orderStatus = input.orderStatus;

      const result = await this.orderModel.findOneAndUpdate(
        {memberId:memberId, _id:orderId},
        {orderStatus, }, 
        {new:true}
      ).exec();

      if(!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

      return result as unknown as Order;
    }

}

export default OrderService;