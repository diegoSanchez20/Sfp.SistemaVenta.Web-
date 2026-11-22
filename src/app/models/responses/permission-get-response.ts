export interface PermissionGetResponse {
    data:    PermissionGetItemResponse;
    message: string;
}

export interface PermissionGetItemResponse {
    id:     number;
    name:   string;
    slug:   string;
    menu_id:   string;
    grupo:   string;
    status: boolean;
}
