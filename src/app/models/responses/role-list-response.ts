export interface RoleListResponse {
    data:    RoleListItemReponse[];
    meta:    MetaRoleListResponse;
    message: string;
}

export interface RoleListItemReponse {
    id:         number;
    name:       string;
    status:     boolean;
    created_at: Date;
    updated_at: Date;
}

export interface MetaRoleListResponse {
    total:        number;
    per_page:     number;
    current_page: number;
    last_page:    number;
}
