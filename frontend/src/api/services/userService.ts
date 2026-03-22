import {AxiosResponse} from "axios";
import api from "../api";
import {User} from "../models/dto/user";

export default class UserService {
    static async getMe(): Promise<AxiosResponse<User>> {
        return api.get(`/api/v1/users/me`);
    }

    static async updateMe(payload: Partial<User>): Promise<AxiosResponse<User>> {
        return api.patch(`/api/v1/users/me`, payload);
    }

    static async getUserById(id: number): Promise<AxiosResponse<User>> {
        return api.get(`/api/v1/users/${id}`);
    }

}