export interface MenuUpdateStatusResponse {
    data: MenuUpdateStatusDataResponse[];
    message: string;
}

export interface MenuUpdateStatusDataResponse {
    id: number;
    name: string;
    status: boolean;
}


