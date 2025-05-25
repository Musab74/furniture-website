import { T } from "../libs/types/common";
import Errors, { HttpCode, Message } from "../libs/error";
import { Request, Response } from "express";
import FurnitureService from "../models/furniture.service";
import { FurnitureInput } from "../libs/types/furniture";
import { AdminRequest } from "../libs/types/member";

const furnitureService = new FurnitureService();

const productContoller: T = {};

productContoller.getAllProducts = async (req: Request, res: Response) => {
    try {
        console.log("Body:", req.body);
      const data = await furnitureService.getAllProducts();
      console.log("data:", data);
      res.render("products", {products: data});
      
    } catch (err) {
        console.log("Error getAllProducts", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};
//SPA


// SSR
productContoller.createNewProduct = async (req: AdminRequest, res: Response) => {
    try {
        console.log("Body:");
        console.log("req.files:", req.files);
        if (!req.files?.length)
            throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);
        
        const data: FurnitureInput = req.body;
        data.furnitureImages = req.files?.map(ele => {
            return ele.path;
        });

        await furnitureService.createNewProduct(data);

        res.send(`<script> alert ("Succesfully created"); window.location.replace('/admin/product/all') </script>`
        );

        console.log("data", data);
    } catch (err) {
        console.log("Error createNewProduct", err);
        const message = 
        err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(
            `<script> alert ("${message}"); window.location.replace('/admin/product/all') </script>`
        )}
};

productContoller.updateChosenProduct = async (req: Request, res: Response) => {
    try {
        console.log("Body:", req.body);
        const id = req.params.id;

        const result = await furnitureService.updateChosenProduct(id, req.body);

        res.status(HttpCode.OK).json({data: result});
        
    } catch (err) {
        console.log("Error updateChosenProduct", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

export default productContoller;