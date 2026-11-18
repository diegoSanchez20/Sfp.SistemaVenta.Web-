export interface MenuUpdateResponse {
    data: MenuUpdateDataResponse[];
    message: string;
}

export interface MenuUpdateDataResponse {
    id: number;
    name: string;
    status: boolean;
}


