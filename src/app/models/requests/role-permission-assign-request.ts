export interface RolePermissionAssignRequest{
    permissions:RolePermissionAssignItemRequest[]
}


export interface RolePermissionAssignItemRequest {
    permission_id: number;
    status: boolean;
}