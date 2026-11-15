export interface LoginResponse {
    data:    DataLoginResponse;
    message: string;
}

export interface DataLoginResponse {
    access_token: string;
    token_type:   string;
    expires_in:   number;
    user:         User;
}

export interface User {
    id:         number;
    user:       string;
    permission: Permission[];
}

export interface Permission {
    id:   number;
    grupo:number;
    name: string;
    slug: string;
    menu_id: number | null;
    menu_name: string | null;
}
