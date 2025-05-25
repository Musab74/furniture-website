import { Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../models/memberService";
import { LoginInput, Member, MemberInput } from "../libs/types/member";
import Errors from "../libs/error";

const memberService = new MemberService();

const memberController: T = {};

memberController.SignUp = async (req: Request, res: Response) => {
    try {
        console.log("Body:", req.body);

        const input: MemberInput = req.body,


            result: Member = await memberService.SignUp(input);
            //TODO: Tokens

        res.json({ member: result });

    } catch (err) {
        console.log("Error signup", err);
        if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
        res.json({err});


    }

};

memberController.Login = async (req: Request, res: Response) => {
    try {
        console.log("processLogin");
        console.log("body:", req.body);

        const input: LoginInput = req.body,
            result = await memberService.Login(input);

        res.json({ member: result });

    } catch (err) {
        console.log("Error Login", err);
        res.json({err});


    }

};


export default memberController;