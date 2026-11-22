export interface PermissionListResponse {
    data:    PermissionListItemReponse[];
    meta:    MetaPermissionListResponse;
    message: string;
}

export interface PermissionListItemReponse {
    id:         number;
    name:       string;
    slug:       string;
    menu_id:    number;
    grupo:      number;
    status:     boolean;
    created_at: Date;
    updated_at: Date;
}

export interface MetaPermissionListResponse {
    total:        number;
    per_page:     number;
    current_page: number;
    last_page:    number;
}
