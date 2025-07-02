import { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/common";
import { AdminRequest, ExtendedRequest, LoginInput, Member, MemberInput, MemberUpdateInput } from "../libs/types/member";
import { AUTH_TIMER } from "../libs/config";
import AuthService from "../models/auth.service";
import Errors from "../libs/error";
import { HttpCode } from "../libs/error";
import { Message } from "../libs/error";
import MemberService from "../models/memberService";

const memberService = new MemberService();
const authService = new AuthService();

const memberController: T = {};

memberController.getStore = async (req:Request, res:Response) => {
    try {
        const result = await memberService.getStore();
        
        res.status(HttpCode.OK).json(result);

    } catch (err) {
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
}

memberController.SignUp = async (req: Request, res: Response) => {
    try {
        console.log("Body:", req.body);

        const input: MemberInput = req.body,


        result: Member = await memberService.SignUp(input);
        const token = authService.createToken(result);

        res.cookie("accessToken", token, {
            maxAge: AUTH_TIMER * 3600 * 1000,
            httpOnly: false,
        })



        res.status(HttpCode.CREATED).json({ member: result, accessToken: token, });


    } catch (err) {
        console.log("Error signup", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);


    }

};

memberController.Login = async (req: Request, res: Response) => {
    try {
        console.log("Login");

        const input: LoginInput = req.body,
            result = await memberService.Login(input),
            token = await authService.createToken(result);


        res.cookie("accessToken", token, {
            maxAge: AUTH_TIMER * 3600 * 1000,
            httpOnly: false,
        })



        res.status(HttpCode.OK).json({ member: result, accessToken: token, });

    } catch (err) {
        console.log("Error Login", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);

    }

};

memberController.logout = (
    req:ExtendedRequest,
    res: Response
) => { try {
     console.log("Logout:");
     res.cookie("accessToken", null, {maxAge: 0, httpOnly: true})
     res.status(HttpCode.OK).json({ message: "Logged out" });

     
} catch (err){
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);

}
}


memberController.getMemberDetails = async (
    req:ExtendedRequest,
    res: Response
) => { try {
     console.log("getMemberDetails:");
     const result = await memberService.getMemberDetails(req.member)

     res.status(HttpCode.OK).json(result);
} catch (err){
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);

}
};


memberController.updateMember = async (req:ExtendedRequest, res:Response) => {
    try {
        console.log("updateMember arrived");
        const input: MemberUpdateInput = req.body;
        if (req.file) input.memberImage = req.file.path;
        const result = await memberService.updateMember(req.member, input);
        res.status(HttpCode.OK).json(result);
        

    } catch (err) {
        console.log("updateMember:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);  
        
    }
};

memberController.verifyAuth = async (
    req: ExtendedRequest, 
    res: Response, 
    next: NextFunction) => {  //async method
    try {
        const token = req.cookies["accessToken"];
        if (token) req.member = await authService.checkAuth(token); //payloadni token orqali qabul qilib olyapti

        if (!req.member) throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
        next();
    } catch (err) {
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
}

memberController.retrieveAuth = async (req: { cookies: { [x: string]: any; }; member: Member; }, res: any, next: () => void) => {
    try {
      const token = req.cookies["accessToken"];
      console.log("Token in cookie:", token);
      if (token) {
        req.member = await authService.checkAuth(token);
        console.log("Authenticated member:", req.member);
      }
      next();
    } catch (err) {
      console.log("Error in retrieveAuth:", err);
      next();
    }
  };
  
  



export default memberController;