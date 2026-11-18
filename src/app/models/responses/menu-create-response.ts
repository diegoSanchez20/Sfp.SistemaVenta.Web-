export interface MenuCreateResponse {
    data: MenuCreateDataResponse[];
    message: string;
}

export interface MenuCreateDataResponse {
    id: number;
    name: string;
    status: boolean;
}


