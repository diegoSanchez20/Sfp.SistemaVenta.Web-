export interface PermissionGetResponse {
    data:    PermissionGetItemResponse[];
    message: string;
}

export interface PermissionGetItemResponse {
    id:     number;
    name:   string;
    status: boolean;
}
