import { type User } from "../../backend/src/models/User"

export type LoginDto = Required< Pick<User, "email" | "password"> >;

export interface RegisterDto extends Required< Pick<User, "email" | "password" | "country" | "name"> >{
    confirmPassword: string;
}

export interface UserTokenPayload{
    id : string,
    email : string,
}