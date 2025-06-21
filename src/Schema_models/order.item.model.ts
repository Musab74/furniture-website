import mongoose, {Schema} from "mongoose";

const orderItemSchema = new Schema({
    itemQuantity: {
        type: Number,
        required: true,
    },
    itemPrice: {
        type: Number,
        required: true,
    },
    orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order"
    },
    furnituretId: {
    type:Schema.Types.ObjectId,
    ref: "Furniture",
    },
}, {timestamps: true, collection: "orderItems"});

export default mongoose.model("OrderItem", orderItemSchema);