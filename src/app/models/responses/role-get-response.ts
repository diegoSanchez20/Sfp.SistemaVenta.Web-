export interface RoleGetResponse {
    data:    RoleGetItemResponse;
    message: string;
}

export interface RoleGetItemResponse {
    id:         number;
    name:       string;
    status:     boolean;
}
