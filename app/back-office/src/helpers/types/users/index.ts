export interface UserManagementContextProps {
    children: React.ReactNode;
}

export interface UserType {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
    createdAt: string;
    updatedAt: string;
    username: string;
}

export type UserContextType = Omit<UserType, 'createdAt' | 'updatedAt' | 'firstName' | 'lastName'>

export type DecodedTokenType = Omit<UserContextType, 'id'> & {
    userId: string
    iat: number
    exp: number
}

export type AuthRegisterType = Omit<UserContextType, 'id' | 'roles'> & {
    password: string
}