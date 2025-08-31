/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserService {
    /**
     * Create user.
     * This can only be done by the logged in user.
     * @returns User successful operation
     * @returns any Unexpected error
     * @throws ApiError
     */
    public static createUser({
        requestBody,
    }: {
        /**
         * Created user object
         */
        requestBody?: User,
    }): CancelablePromise<User | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Creates list of users with given input array.
     * Creates list of users with given input array.
     * @returns User Successful operation
     * @returns any Unexpected error
     * @throws ApiError
     */
    public static createUsersWithListInput({
        requestBody,
    }: {
        requestBody?: Array<User>,
    }): CancelablePromise<User | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/createWithList',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Logs user into the system.
     * Log into the system.
     * @returns string successful operation
     * @returns any Unexpected error
     * @throws ApiError
     */
    public static loginUser({
        username,
        password,
    }: {
        /**
         * The user name for login
         */
        username?: string,
        /**
         * The password for login in clear text
         */
        password?: string,
    }): CancelablePromise<string | any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/login',
            query: {
                'username': username,
                'password': password,
            },
            errors: {
                400: `Invalid username/password supplied`,
            },
        });
    }
    /**
     * Logs out current logged in user session.
     * Log user out of the system.
     * @returns any successful operation
     * @throws ApiError
     */
    public static logoutUser(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/logout',
        });
    }
    /**
     * Get user by user name.
     * Get user detail based on username.
     * @returns User successful operation
     * @returns any Unexpected error
     * @throws ApiError
     */
    public static getUserByName({
        username,
    }: {
        /**
         * The name that needs to be fetched. Use user1 for testing
         */
        username: string,
    }): CancelablePromise<User | any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/{username}',
            path: {
                'username': username,
            },
            errors: {
                400: `Invalid username supplied`,
                404: `User not found`,
            },
        });
    }
    /**
     * Update user resource.
     * This can only be done by the logged in user.
     * @returns any successful operation
     * @throws ApiError
     */
    public static updateUser({
        username,
        requestBody,
    }: {
        /**
         * name that need to be deleted
         */
        username: string,
        /**
         * Update an existent user in the store
         */
        requestBody?: User,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/user/{username}',
            path: {
                'username': username,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `bad request`,
                404: `user not found`,
            },
        });
    }
    /**
     * Delete user resource.
     * This can only be done by the logged in user.
     * @returns any User deleted
     * @throws ApiError
     */
    public static deleteUser({
        username,
    }: {
        /**
         * The name that needs to be deleted
         */
        username: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/user/{username}',
            path: {
                'username': username,
            },
            errors: {
                400: `Invalid username supplied`,
                404: `User not found`,
            },
        });
    }
}
