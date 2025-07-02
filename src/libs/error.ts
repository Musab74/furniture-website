export enum HttpCode{
    OK = 200,
    CREATED = 201,
    NOT_MODIFIED = 304,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
    }
    
    export enum Message {
      SOMETHING_WENT_WRONG = "Something went wrong!",
      NO_DATA_FOUND = "No data found.",
      CREATE_FAILED = "Failed to create the item.",
      UPDATE_FAILED = "Failed to update the item.",
      
      ITEM_ALREADY_EXISTS = "This furniture item already exists!",
      ITEM_NOT_FOUND = "Furniture item not found.",
      OUT_OF_STOCK = "This item is currently out of stock.",
      
      USED_PHONE = "This phone number or nickname are already registered.",
      USER_NOT_FOUND = "User not found.",
      BLOCKED_USER = "You have been blocked. Please contact the admin.",
      WRONG_PASSWORD = "Incorrect password. Please try again.",
      NOT_AUTHENTICATED = "You are not authenticated. Please log in first.",
      TOKEN_CREATION_FAILED = "TOKEN_CREATION_FAILED",
      NO_MEMBER_NICK = "NO_MEMBER_NICK",
      FAILED = "FAILED",
  }
  
    class Errors extends Error {
      public code: HttpCode;
      public message: Message;
    
    static standard = {
      code:HttpCode.INTERNAL_SERVER_ERROR,
      message: Message.SOMETHING_WENT_WRONG,
    };
    
      constructor(statusCode: HttpCode, statusMessage: Message) {
        super();
        this.code= statusCode;
        this.message = statusMessage;
      }
    }
    
    export default Errors;