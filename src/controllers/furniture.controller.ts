import { T } from "../libs/types/common";
import Errors, { HttpCode, Message } from "../libs/error";
import { Request, Response } from "express";
import FurnitureService from "../models/furniture.service";
import { FurnitureInput } from "../libs/types/furniture";
import { AdminRequest } from "../libs/types/member";

const furnitureService = new FurnitureService();

const furnitureController: T = {};

furnitureController.getAllFurnitures = async (req: Request, res: Response) => {
    try {
        console.log("Body:", req.body);
      const data = await furnitureService.getAllFurnitures();
      console.log("data:", data);
      res.render("furnitures", {furnitures: data});
      
    } catch (err) {
        console.log("Error getAllProducts", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};
//SPA


// SSR
furnitureController.createNewProduct = async (req: AdminRequest, res: Response) => {
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

        res.send(`<script> alert ("Succesfully created"); window.location.replace('/admin/furniture/all') </script>`
        );

        console.log("data", data);
    } catch (err) {
        console.log("Error createNewProduct", err);
        const message = 
        err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(
            `<script> alert ("${message}"); window.location.replace('/admin/furniture/all') </script>`
        )}
};

furnitureController.updateChosenProduct = async (req: Request, res: Response) => {
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

export default furnitureController;