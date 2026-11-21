export interface MenuGetResponse {
    data:    MenuGetItemResponse;
    message: string;
}

export interface MenuGetItemResponse {
    id:         number;
    name:       string;
    status:     boolean;
}
