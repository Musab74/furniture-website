import { Message } from "../libs/error";
import { View, ViewInput } from "../libs/types/view";
import ViewModel from "../Schema_models/view.model";
import Errors from "../libs/error";
import { HttpCode } from "../libs/error";

class ViewService {
    private readonly viewModel;

    constructor() {
        this.viewModel = ViewModel
    }

    public async checkViewExistence(input: ViewInput):Promise<View> {
        return await this.viewModel.findOne(
             {memberId:input.memberId, viewRefId: input.viewRefId})
         .exec() as View;
     }
    
    
    public async insertMemberView(input:ViewInput):Promise<View> {
        try {
            return await this.viewModel.create(input) as View;
        } catch (err) {
            console.log("error appeared in insert view model section", err);
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED)
            
        }
    }

}
export default ViewService;