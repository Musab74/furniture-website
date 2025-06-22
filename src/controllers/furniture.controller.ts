import { T } from "../libs/types/common";
import Errors, { HttpCode, Message } from "../libs/error";
import { Request, Response } from "express";
import FurnitureService from "../models/furniture.service";
import { FurnitureInput } from "../libs/types/furniture";
import { AdminRequest, ExtendedRequest } from "../libs/types/member";
import { FurnitureCollection } from "../libs/enums/furniture.enum";
import { FurnitureInquiry } from "../libs/types/furnitures";
import { Types } from "mongoose";

const furnitureService = new FurnitureService();

const furnitureController: T = {};
//SPA
furnitureController.getFurnitures = async (req:Request, res:Response) => {
    try {
        const {page, limit, order, furnitureCollection, search} = req.query;
        const inquiry: FurnitureInquiry = {
            order:String(order),
            page:Number(page),
            limit:Number(limit),
        };
        if (furnitureCollection)
            inquiry.furnitureCollection = furnitureCollection as FurnitureCollection;
        if(search)inquiry.search = String(search);
        const result = await furnitureService.getFurnitures(inquiry);

        res.status(HttpCode.OK).json(result)
        
    } catch (err) {
        console.log("Error getFurnitures", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
}
furnitureController.getFurniture = async (req: ExtendedRequest, res: Response) => {
    try {
        console.log("getFurniture arrived:");
        const { id } = req.params;

        let memberId: Types.ObjectId | null = null;        
        const result = await furnitureService.getFurniture(memberId, id); 
        console.log("id ketdi shetta:", id);
        
        res.status(HttpCode.OK).json(result);
        
    } catch (err) {
        console.log("Error getFurniture", err);
        if (err instanceof Errors) {
            res.status(err.code).json(err);
        } else {
            console.log("shetga keldi xato");
            
            res.status(Errors.standard.code).json(Errors.standard);
        }
    }

furnitureController.getRandomFurnitures = async (req: Request, res: Response) => {
        try {
            const result = await furnitureService.getRandomFurnitures();
            res.status(HttpCode.OK).json(result);
        } catch (err) {
            console.log("Error getRandomFurnitures", err);
            if (err instanceof Errors) res.status(err.code).json(err);
            else res.status(Errors.standard.code).json(Errors.standard);
        }
    };
    
};



// SSR

furnitureController.getAllFurnitures = async (req: Request, res: Response) => {
    try {
        console.log("Body:", req.body);
      const data = await furnitureService.getAllFurnitures();
      console.log("data:", data);
      res.render("furnitures", {furnitures: data});
      
    } catch (err) {
        console.log("Error getAllFurnitures", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};


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

furnitureController.getComingSoonFurnitures = async (req: Request, res: Response) => {
    try {
        const furnitures = await furnitureService.getComingSoonFurniture(4);
        res.status(HttpCode.OK).json(furnitures);
    } catch (err) {
        console.error("Error in getComingSoonFurnitures:", err);
        res.status(HttpCode.INTERNAL_SERVER_ERROR).json(new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.UPDATE_FAILED));
    }
}


export default furnitureController;