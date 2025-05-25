// Furniture sizes (e.g., for chairs, tables, etc.)
export enum FurnitureSize {
    SMALL = "SMALL",
    MEDIUM = "MEDIUM",
    LARGE = "LARGE",
    KIDS="KIDS"
}

// Furniture dimensions or volume capacity (optional - could be for storage, shelving, etc.)
export enum FurnitureCapacity {
    SINGLE = "SINGLE",
    DOUBLE = "DOUBLE",
    FAMILY = "FAMILY",
}


// Product availability or lifecycle status
export enum FurnitureStatus {
    OUT_OF_STOCK = "OUT_OF_STOCK",
    AVAILABLE = "AVAILABLE",
    DELETE = "DELETE",
}

// Furniture collections/categories
export enum FurnitureCollection {
    BEDROOM = "BEDROOM",
    LIVING_ROOM = "LIVING_ROOM",
    DINING_ROOM = "DINING_ROOM",
    OFFICE = "OFFICE",
    OUTDOOR = "OUTDOOR",
}
