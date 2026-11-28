export interface RolePermissionAssignListListResponse {
    data:    RolePermissionAssignListItemReponse[];
    message: string;
}

export interface RolePermissionAssignListItemReponse {
    id:         number;
    name:       string;
    slug:       string;
    grupo:      number;
    menu_id:    number;
    menu_name:  string;
    assigned:   boolean
}

