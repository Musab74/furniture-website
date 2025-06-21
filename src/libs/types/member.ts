import {ObjectId, Types} from "mongoose"
import { memberStatus, memberType } from "../enums/member.enum";
import { Request } from "express";
import { Session } from "express-session";



export interface MemberInput {
    memberType: memberType;
    memberStatus: memberStatus
    memberNick: string;
    memberPassword: string;
    memberPhone: string;
    memberAddress?: string;
    memberDesc?: string;
    memberImage?: string;
    memberPoints: number;
    createAt: Date;
    updateAT: string;
}

export interface MemberUpdateInput {
    _id: Types.ObjectId | string;
    memberStatus?: memberStatus;
    memberNick?: string;
    memberPhone?: string;
    memberAddress?: string;
    memberDesc?: string;
    memberImage?: string;
    memberPoints?: number;
    createAt: Date;
    updateAT: string;
}


export interface Member {
        _id: Types.ObjectId | string;
        memberType?: memberType;
        memberStatus?: memberStatus
        memberNick: string;
        memberPassword: string;
        memberPhone: string;
        memberAddress?: string;
        memberDesc?: string;
        memberImage?: string;
    
}

export interface LoginInput{
    memberNick: string;
    memberPassword: string;
}

export interface ExtendedRequest extends Request {
    member: Member;
    file: Express.Multer.File;
    files:Express.Multer.File[];
}

export interface AdminRequest extends Request {
    member: Member;
    session: Session & {member: Member };
    file: Express.Multer.File;
    files:Express.Multer.File[];
}