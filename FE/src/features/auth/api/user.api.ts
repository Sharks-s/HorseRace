import { api } from "../../../api/axios";

export const upgradeToSeller = async (data: { taxId: string; address: string }) => {
    const response = await api.post("/users/upgrade-seller", data);
    return response.data;
};
