import { HttpCode } from "../libs/error";
import { AUTH_TIMER } from "../libs/config";
import { Member } from "../libs/types/member";
import jwt from "jsonwebtoken";
import { Message } from "../libs/error";
import Errors from "../libs/error";

class AuthService {
    private readonly secretToken;
    constructor() {
        this.secretToken = process.env.SECRET_TOKEN as string; // reference olyapmiz
    }

    public createToken(member: Member) {
        return new Promise((resolve, reject) => {
          const duration = `${AUTH_TIMER}h`;
      
          // ✅ Extract only plain fields (DO NOT pass Mongoose doc)
          const payload = {
            _id: member._id?.toString(),
            memberPhone: member.memberPhone,
            memberNick: member.memberNick,
          };
      
          jwt.sign(
            payload,
            this.secretToken as string,
            { expiresIn: duration },
            (err, token) => {
              if (err) {
                console.error("JWT error:", err); // ✅ Add this
                reject(new Errors(HttpCode.UNAUTHORIZED, Message.TOKEN_CREATION_FAILED));
              } else {
                resolve(token as string);
              }
            }
          );
        });
      }
      

    public async checkAuth(token: string): Promise<Member> {
        const result = (await jwt.verify(token, this.secretToken)) as Member;
        return result;
    }

}
export default AuthService;