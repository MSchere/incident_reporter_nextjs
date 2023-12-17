export type SessionData = {
    email: string;
    exp: number;
    iat: number;
    jti: string;
    sub: string;
};
    
export type Message = {
    message: string;
}

export enum IncidentStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    RESOLVED = "RESOLVED",
    CLOSED = "CLOSED"
}
export type Incident = {
    id: string;
    title: string;
    description: string;
    status: IncidentStatus;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN"
}