export enum OrderStatus {
    PENDING = "PENDING",            // Order placed, not yet processed
    PROCESSING = "PROCESSING",      // Preparing the order (packing, manufacturing, etc.)
    DELIVERED = "DELIVERED",        // Successfully delivered to customer
    CANCELLED = "CANCELLED",        // Cancelled by customer or admin
}
