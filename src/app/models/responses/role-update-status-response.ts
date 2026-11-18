export interface RoleUpdateStatusResponse {
    data: RoleUpdateStatusDataResponse[];
    message: string;
}

export interface RoleUpdateStatusDataResponse {
    id: number;
    name: string;
    status: boolean;
}


