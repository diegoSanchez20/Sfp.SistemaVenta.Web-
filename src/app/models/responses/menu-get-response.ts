export interface MenuGetResponse {
    data:    MenuGetItemResponse[];
    meta:    MetaMenuGetResponse;
    message: string;
}

export interface MenuGetItemResponse {
    id:         number;
    name:       string;
    status:     boolean;
    created_at: Date;
    updated_at: Date;
}

export interface MetaMenuGetResponse {
    total:        number;
    per_page:     number;
    current_page: number;
    last_page:    number;
}
