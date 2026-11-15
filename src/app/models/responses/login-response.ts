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
    name: string;
    slug: string;
}
