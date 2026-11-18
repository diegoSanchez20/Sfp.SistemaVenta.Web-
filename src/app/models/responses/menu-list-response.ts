export interface MenuListResponse {
    data:    MenuListItemReponse[];
    meta:    MenuListItemReponse;
    message: string;
}

export interface MenuListItemReponse {
    id:         number;
    name:       string;
    status:     boolean;
    created_at: Date;
    updated_at: Date;
}

export interface MetaMenuListResponse {
    total:        number;
    per_page:     number;
    current_page: number;
    last_page:    number;
}
