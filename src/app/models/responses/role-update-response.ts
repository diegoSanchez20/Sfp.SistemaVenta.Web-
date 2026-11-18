export interface RoleUpdateResponse {
    data: RoleUpdateDataResponse[];
    message: string;
}

export interface RoleUpdateDataResponse {
    id: number;
    name: string;
    status: boolean;
}


