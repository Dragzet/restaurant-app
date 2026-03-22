import {Category} from "../models/dto/category";
import {AxiosResponse} from "axios";
import api from "../api";

export default class CategoryService {
    static async create(request: Category): Promise<AxiosResponse<Category>> {
        return api.post<Category>('/api/v1/categories', request)
    }

    static async get(id: Number): Promise<AxiosResponse<Category>> {
        return api.get<Category>(`/api/v1/categories/${id}`)
    }

    static async getAll(includeMenuItems: boolean): Promise<AxiosResponse<Category[]>> {
        return api.get<Category[]>(`api/v1/categories?includeMenuItems=${includeMenuItems}`)
    }

    static async delete(id: number): Promise<AxiosResponse<void>> {
        return api.delete<void>(`/api/v1/categories/${id}`);
    }


}