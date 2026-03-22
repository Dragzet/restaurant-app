import {MenuItem} from "../models/dto/menuItem";
import {AxiosResponse} from "axios";
import api from "../api";

export default class MenuService {
    static async create(metadata: MenuItem, file: File): Promise<AxiosResponse<MenuItem>> {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("metadata", JSON.stringify(metadata));

        return api.post('/api/v1/menuItems', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    static async getAll(categoryId: number): Promise<AxiosResponse<MenuItem[]>> {
        return api.get(`/api/v1/menuItems?categoryId=${categoryId}`);
    }

    static async get(id: number): Promise<AxiosResponse<MenuItem>> {
        return api.get(`/api/v1/menuItems/${id}`);
    }

    static async delete(id: number): Promise<AxiosResponse<void>> {
        return api.delete(`/api/v1/menuItems/${id}`);
    }
}