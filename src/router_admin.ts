import express from "express";
const routerAdmin = express.Router();
import storeController from "./controllers/store.controller";
import furnitureController from "./controllers/furniture.controller"; 
// import { uploadProductImage } from "./libs/utils/uploader";
import makeUploader from "./libs/utils/uploader";

/* Store*/

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
    storeController.verifyRestaurant,
    furnitureController.getAllProducts);
routerAdmin.post("/furniture/create",
    storeController.verifyRestaurant,
    // uploadProductImage.single('productImage'), uploading only one picture
    makeUploader("products").array("productImages", 5),
    furnitureController.createNewProduct);
routerAdmin.post("/furniture/:id", 
    storeController.verifyRestaurant,
    furnitureController.updateChosenProduct);  


routerAdmin.get("/user/all",
    storeController.verifyRestaurant,
    storeController.getUsers
)

routerAdmin.post("/user/edit",
    storeController.verifyRestaurant,
    storeController.updateChosenUser
)


/* Users*/
export default routerAdmin;
