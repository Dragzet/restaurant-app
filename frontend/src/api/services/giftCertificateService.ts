import {AxiosResponse} from "axios";
import api from "../api";
import {GiftCertificateRequest} from "../models/request/giftCertificateRequest";
import {GiftCertificateResponse} from "../models/response/giftCertificateResponse";

export default class GiftCertificateService {
    static async create(request: GiftCertificateRequest): Promise<AxiosResponse<GiftCertificateResponse>> {
        return api.post<GiftCertificateResponse>('/api/v1/giftCertificates', request)
    }

    static async getMine(): Promise<AxiosResponse<GiftCertificateResponse[]>> {
        return api.get<GiftCertificateResponse[]>('/api/v1/giftCertificates/mine')
    }

    static async getByCode(code: string): Promise<AxiosResponse<GiftCertificateResponse>> {
        return api.get<GiftCertificateResponse>(`/api/v1/giftCertificates?code=${code}`)
    }

}