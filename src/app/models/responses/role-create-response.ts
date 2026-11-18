export interface RoleCreateResponse {
    data: RoleCreateDataResponse[];
    message: string;
}

export interface RoleCreateDataResponse {
    id: number;
    name: string;
    status: boolean;
}


