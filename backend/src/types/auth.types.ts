export type User = {
    id: string;
    email: string;
    password: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
};

export type AuthResponse = {
    user: User;
    token: string;
};

export type LoginCredentials = {
    email: string;
    password: string;
};

export type RegisterCredentials = {
    email: string;
    password: string;
    name: string;
};