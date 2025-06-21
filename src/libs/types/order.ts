import {ObjectId} from "mongoose";
import { OrderStatus } from "../enums/order.enum";
import { Furniture } from "./furniture";

export interface OrderItem {
    _id: ObjectId;
    itemQuantity:Number;
    itemPrice: Number;
    orderId: ObjectId;
    furnitureId: ObjectId;
    createAt:Date;
    updatedAt:Date;
}

export interface Order{
    _id: ObjectId;
    orderTotal: number;
    orderStatus: OrderStatus;
    memberId: ObjectId;
    createAt: Date;
    updatedAt: Date;
    // From aggregations
    orderItems:[];
    furnitureDate: Furniture[];
}

export interface OrderItemInput {
    itemQuantity: number,
    itemPrice: number,
    furnitureId:ObjectId,
    orderId?:ObjectId;
}

export interface OrderInquiry {
    page:number,
    limit:number,
    orderStatus: OrderStatus;
}

export interface OrderUpdateInput {
    orderId: string;
    orderStatus: OrderStatus;
}

