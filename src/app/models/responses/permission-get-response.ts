export interface PermissionGetResponse {
    data:    PermissionGetItemResponse;
    message: string;
}

export interface PermissionGetItemResponse {
    id:     number;
    name:   string;
    slug:   string;
    menu_id:   number | null;
    grupo:   string;
    status: boolean;
}
