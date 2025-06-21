import { LoginInput, Member, MemberInput, MemberUpdateInput } from "../libs/types/member";
import { memberStatus, memberType } from "../libs/enums/member.enum";
import * as bcrypt from "bcryptjs"
import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors from "../libs/error";
import { HttpCode } from "../libs/error";
import { Message } from "../libs/error";
import memberModel from "../Schema_models/member.model";

class MemberService {
    private readonly memberModel;
    constructor() {
        this.memberModel = memberModel
    }

    /* SPA*/

    public async getStore(): Promise<Member> {
        const result = await this.memberModel.findOne({ memberType: memberType.STORE }).lean().exec();

        if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
        return result as Member ;
    };

    public async SignUp(input: MemberInput): Promise<Member> {
        const salt = await bcrypt.genSalt();
        input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

        try {
            const result = await this.memberModel.create(input);

            // const tempResult = new this.memberModel(input);
            // const result = await tempResult.save();

            result.memberPassword = "";
            return result as Member;

        } catch (err) {
            console.error("Error, model:signup", err);

            throw new Errors(HttpCode.BAD_REQUEST, Message.USED_PHONE);
        }

    }

    public async Login(input: LoginInput): Promise<Member> {
        // TODO: Consider member status later

        const member = await this.memberModel
            .findOne(
                {
                    memberNick: input.memberNick,
                    memberStatus: { $ne: memberStatus.DELETE },
                },
                {  memberNick: 1, memberPassword: 1, memberStatus: 1 } //projection
            )
            .lean().exec();
        if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);
        else if (member.memberStatus === memberStatus.BLOCK) {
            throw new Errors(HttpCode.FORBIDDEN, Message.BLOCKED_USER);
        }

        // const isMatch = input.memberPassword === member.memberPassword;
        const isMatch = await bcrypt.compare(
            input.memberPassword,
            member.memberPassword)


        if (!isMatch) {
            throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
        }

        return await this.memberModel.findById(member._id).lean().exec() as Member;


    }

    public async getMemberDetails(member: Member): Promise<Member> {
        const memberId = shapeIntoMongooseObjectId(member._id);
        const result = await this.memberModel.findOne({ _id: memberId, memberStatus: memberStatus.ACTIVE }).exec();

        if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
        return result as Member;
    }

    public async getTopUsers(): Promise<Member[]> {
        const result = await this.memberModel.find
            ({
                memberStatus: memberStatus.ACTIVE,
                memberPoints: { $gte: 1 }
            })
            .sort({ memberPoints: -1 })
            .limit(4).exec();
        if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        return result as Member[];

    }

    public async updateMember(member: Member,
        input: MemberUpdateInput,
         ): Promise<Member> {
        const memberId = shapeIntoMongooseObjectId(member._id);
        const result = await this.memberModel.findOneAndUpdate(
            { _id: memberId, } //filter
            , input, //update
            { new: true }) //options
            .exec();
        if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
        return result as Member;
    }

    public async addUserPoint(member:Member, point:Number):Promise<Member>{
       const memberId = shapeIntoMongooseObjectId(member._id);
       return await this.memberModel.findOneAndUpdate(
        {_id:memberId, memberType:memberType.USER, memberStatus: memberStatus.ACTIVE},
        {$inc: {memberPoints: point}},
        {new: true}
       ).exec() as Member;
    }

    /* SSR*/


    public async processSignUp(input: MemberInput): Promise<Member> {
        const exist = await this.memberModel.findOne({ memberType: memberType.STORE })
            .exec();
        if (exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);


        console.log("before:", input.memberPassword);

        const salt = await bcrypt.genSalt();
        input.memberPassword = await bcrypt.hash(input.memberPassword, salt);
        console.log("after:", input.memberPassword);


        try {
            const result = await this.memberModel.create(input);

            // const tempResult = new this.memberModel(input);
            // const result = await tempResult.save();

            result.memberPassword = "";
            return result as Member;

        } catch (err) {
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }

    }
    public async processLogin(input: LoginInput): Promise<Member> {
        const member = await this.memberModel
            .findOne(
                { memberNick: input.memberNick },
                { memberNick: 1, memberPassword: 1 }
            )
            .exec();
        if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);

        // const isMatch = input.memberPassword === member.memberPassword;
        const isMatch = await bcrypt.compare(
            input.memberPassword,
            member.memberPassword)


        if (!isMatch) {
            throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
        }

        return await this.memberModel.findById(member._id).exec() as Member;


    }

    public async getUsers(): Promise<Member[]> {
        const result = await this.memberModel
            .find({ membetType: memberType.USER })
            .exec();
        if (!result) throw new Errors(HttpCode.BAD_REQUEST, Message.NO_DATA_FOUND);
        return result as Member[];
    }

    public async updateChosenUser(input: MemberUpdateInput): Promise<Member> {
        input._id = shapeIntoMongooseObjectId(input._id);
        const result = await this.memberModel
            .findByIdAndUpdate({ _id: input._id }, input, { new: true })
            .exec();
        if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
        return result as Member;
    }
}
export default MemberService;