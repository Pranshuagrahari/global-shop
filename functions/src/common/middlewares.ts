import { CallableRequest, HttpsError } from "firebase-functions/v2/https";
import { UserRole } from "../shared/types";

/**
 * Asserts that the request is authenticated.
 * Returns the uid if authenticated.
 */
export const assertAuth = (request: CallableRequest): string => {
    if (!request.auth) {
        throw new HttpsError(
            "unauthenticated",
            "The function must be called while authenticated."
        );
    }
    return request.auth.uid;
};

/**
 * Asserts that the authenticated user has a specific role.
 * Role is checked from Custom Claims.
 */
export const assertRole = (request: CallableRequest, allowedRoles: UserRole[]) => {
    const uid = assertAuth(request);
    const role = request.auth?.token.role as UserRole;

    if (!allowedRoles.includes(role)) {
        throw new HttpsError(
            "permission-denied",
            `User must have one of the following roles: ${allowedRoles.join(", ")}.`
        );
    }

    return { uid, role };
};

/**
 * Helper to get user ID safely
 */
export const getUid = (request: CallableRequest): string => {
    return assertAuth(request);
};
