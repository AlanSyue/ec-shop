import { HttpStatus } from "@nestjs/common";

export class EmailExistError extends Error {
    public static STATUS_CODE = HttpStatus.BAD_REQUEST
    public static ERROR_CODE = 'AUTH_00001'
    public static ERROR_MESSAGE = 'Email Already Exists'
    
    constructor(message = EmailExistError.ERROR_MESSAGE) {
        super(message)
    }
}
