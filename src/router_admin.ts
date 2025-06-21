import express from "express";
import storeController from "./controllers/store.controller";
import furnitureController from "./controllers/furniture.controller"; 
import makeUploader from "./libs/utils/uploader";

/* Store*/
const uploadFurnitureImages = makeUploader("furnitures").array("furnitureImages", 5);
const routerAdmin = express.Router();


routerAdmin.get("/", storeController.goHome); 

routerAdmin
.get("/login", storeController.getLogin)
.post("/login", storeController.processLogin);


routerAdmin
.get("/signup", storeController.getSignUp )
.post("/signup", 
    makeUploader("members").single("memberImage"),
    storeController.processSignUp);

routerAdmin.get("/check-me", storeController.checkAuthSession);
routerAdmin.get("/logout", storeController.LogOut)


/* Furniture*/
routerAdmin.get("/furniture/all", 
    storeController.verifyStore,
    furnitureController.getAllFurnitures);

routerAdmin.post("/furniture/create",
    storeController.verifyStore,
    uploadFurnitureImages,   
    furnitureController.createNewProduct);
routerAdmin.post("/furniture/:id", 
    storeController.verifyStore,
    furnitureController.updateChosenFurniture);  


routerAdmin.get("/user/all",
    storeController.verifyStore,
    storeController.getUsers
)

routerAdmin.post("/user/edit",
    storeController.verifyStore,
    storeController.updateChosenUser
)


/* Users*/
export default routerAdmin;
