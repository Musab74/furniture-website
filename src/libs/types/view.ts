import { ObjectId, Types } from "mongoose";
import { ViewGroup } from "../enums/view.enum"; // adjust this as needed

export interface View {
    _id: Types.ObjectId;
    viewGroup: ViewGroup;
    memberId: Types.ObjectId;
    viewRefId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface ViewInput {
    memberId: ObjectId;
    viewRefId: ObjectId;
    viewGroup: ViewGroup;
}