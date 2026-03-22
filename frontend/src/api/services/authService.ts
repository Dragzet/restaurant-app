import {LoginRequest} from "../models/request/loginRequest";
import {LoginResponse} from "../models/response/loginResponse";
import { AxiosResponse } from "axios";
import api from "../api";
import {SignupRequest} from "../models/request/signupRequest";
import {SignupResponse} from "../models/response/signupResponse";
import {RefreshRequest} from "../models/request/refreshRequest";
import {RefreshResponse} from "../models/response/refreshResponse";

export default class AuthService {
    static async login(request: LoginRequest): Promise<AxiosResponse<LoginResponse>> {
        return api.post<LoginResponse>('/api/v1/auth/login', request)
    }

    static async signup(request: SignupRequest): Promise<AxiosResponse<SignupResponse>> {
        return api.post<SignupResponse>('/api/v1/auth/signup', request)
    }

    static async refresh(request: RefreshRequest): Promise<AxiosResponse<RefreshResponse>> {
        return api.post<RefreshResponse>('/api/v1/auth/refresh', request)
    }

    static async sendPasswordResetEmail(email: string): Promise<AxiosResponse<void>> {
        return api.post('/api/v1/auth/password/forgot', { email });
    }

    static async resetPassword(token: string, newPassword: string): Promise<AxiosResponse<void>> {
        return api.post('/api/v1/auth/password/reset', { token, newPassword });
    }

}