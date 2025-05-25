import { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../models/memberService";
import { memberType } from "../libs/enums/member.enum";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/error";

const memberService = new MemberService();

const storeController: T = {};

storeController.goHome = (req: Request, res: Response) => { //2-step
    try {
        res.render("home");

    } catch (err) {
        console.log("Error Home", err);
        res.redirect("/admin")

    }

};

storeController.getSignUp = (req: Request, res: Response) => {
    try {
        res.render("signUp");

    } catch (err) {
        console.log("Error SignUp", err);
        res.redirect("/admin")
    }

};

storeController.getLogin = (req: Request, res: Response) => {
    try {
        res.render("login");

    } catch (err) {
        console.log("Error Login", err);

    }

};

storeController.processSignUp = async (
    req: AdminRequest, 
    res: Response
) => {
    try {
        console.log("Body:", req.body);
        const file = req.file;
        if(!file) throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG);

        const newMember: MemberInput = req.body;
        newMember.memberImage = file?.path;
        newMember.memberType = memberType.STORE
        const result = await memberService.processSignUp(newMember);

        req.session.member = result;
        req.session.save(function(){
            res.redirect("/admin/product/all");
        });
    } catch (err) {
        console.log("Error processLogin", err);
        const message = err instanceof Errors ? err.message: Message.SOMETHING_WENT_WRONG; 
        res.send(
            `<script> alert ("${message}"); window.location.replace('/admin/SignUp') </script>`
        );

    }

};


storeController.processLogin = async (req: AdminRequest, res: Response) => {
    try {
        console.log("processLogin");
        console.log("body:", req.body);

        const input: LoginInput = req.body;
        const result = await memberService.processLogin(input);
        req.session.member = result;
        req.session.save(function () {
            res.redirect("/admin/product/all");
        });

    } catch (err) {
        console.log("Error processLogin", err);
        const message = err instanceof Errors ? err.message: Message.SOMETHING_WENT_WRONG; 
        res.send(`
            <script>
                alert("${message}");
                window.location.replace('/admin/login');
            </script>
        `);
          

    }

};

storeController.LogOut = async (
    req: AdminRequest, 
    res: Response
) => {
    try {
        console.log("logout SESSION");
        req.session.destroy(function() {
            res.redirect("/admin");
        });
        } catch (err) {
        console.log("Error LogOut", err);
        res.redirect("/admin");
  }
};

storeController.getUsers = async (req: Request, res: Response) => {
    try {
        const result = await memberService.getUsers();
        res.render("users", {users: result});

    } catch (err) {
        console.log("Error Login", err);
        res.redirect("/admin/login")

    }
};

storeController.updateChosenUser = async (req: Request, res: Response) => {
    try {
        const result = await memberService.updateChosenUser(req.body)
        res.status(HttpCode.OK).json({data: result});

    } catch (err) {
        console.log("Error Login", err);
        if (err instanceof Errors)res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard)

    }

};

storeController.checkAuthSession = async (
    req: AdminRequest, 
    res: Response
) => {
    try {
        console.log("checkAuth SESSION");
        if (req.session?.member) 
            res.send(`<script> alert,("${req.session.member.memberNick}")</script>`);
        else res.send (Message.NOT_AUTHENTICATED); 
        } catch (err) {
        console.log("Error processLogin", err);
        res.send(err);
  }
};

storeController.verifyRestaurant = (
    req:AdminRequest,
    res:Response,
    next: NextFunction
) => {
    if(req.session?.member?.memberType === memberType.STORE){
        req.member = req.session.member;
        next();
    }
     else {
        const message = Message.NOT_AUTHENTICATED;
        res.send(`<script>alert("${message}"); window.location.replace('/admin/login');</script>`);

}
};



export default storeController;