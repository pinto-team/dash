/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponse } from '../models/ApiResponse';
import type { Pet } from '../models/Pet';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PetService {
    /**
     * Update an existing pet.
     * Update an existing pet by Id.
     * @returns Pet Successful operation
     * @returns any Unexpected error
     * @throws ApiError
     */
    public static updatePet({
        requestBody,
    }: {
        /**
         * Update an existent pet in the store
         */
        requestBody: Pet,
    }): CancelablePromise<Pet | any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/pet',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid ID supplied`,
                404: `Pet not found`,
                422: `Validation exception`,
            },
        });
    }
    /**
     * Add a new pet to the store.
     * Add a new pet to the store.
     * @returns Pet Successful operation
     * @returns any Unexpected error
     * @throws ApiError
     */
    public static addPet({
        requestBody,
    }: {
        /**
         * Create a new pet in the store
         */
        requestBody: Pet,
    }): CancelablePromise<Pet | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/pet',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid input`,
                422: `Validation exception`,
            },
        });
    }
    /**
     * Finds Pets by status.
     * Multiple status values can be provided with comma separated strings.
     * @returns Pet successful operation
     * @returns any Unexpected error
     * @throws ApiError
     */
    public static findPetsByStatus({
        status = 'available',
    }: {
        /**
         * Status values that need to be considered for filter
         */
        status?: 'available' | 'pending' | 'sold',
    }): CancelablePromise<Array<Pet> | any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pet/findByStatus',
            query: {
                'status': status,
            },
            errors: {
                400: `Invalid status value`,
            },
        });
    }
    /**
     * Finds Pets by tags.
     * Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
     * @returns Pet successful operation
     * @returns any Unexpected error
     * @throws ApiError
     */
    public static findPetsByTags({
        tags,
    }: {
        /**
         * Tags to filter by
         */
        tags: Array<string>,
    }): CancelablePromise<Array<Pet> | any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pet/findByTags',
            query: {
                'tags': tags,
            },
            errors: {
                400: `Invalid tag value`,
            },
        });
    }
    /**
     * Find pet by ID.
     * Returns a single pet.
     * @returns Pet successful operation
     * @returns any Unexpected error
     * @throws ApiError
     */
    public static getPetById({
        petId,
    }: {
        /**
         * ID of pet to return
         */
        petId: number,
    }): CancelablePromise<Pet | any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pet/{petId}',
            path: {
                'petId': petId,
            },
            errors: {
                400: `Invalid ID supplied`,
                404: `Pet not found`,
            },
        });
    }
    /**
     * Updates a pet in the store with form data.
     * Updates a pet resource based on the form data.
     * @returns Pet successful operation
     * @returns any Unexpected error
     * @throws ApiError
     */
    public static updatePetWithForm({
        petId,
        name,
        status,
    }: {
        /**
         * ID of pet that needs to be updated
         */
        petId: number,
        /**
         * Name of pet that needs to be updated
         */
        name?: string,
        /**
         * Status of pet that needs to be updated
         */
        status?: string,
    }): CancelablePromise<Pet | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/pet/{petId}',
            path: {
                'petId': petId,
            },
            query: {
                'name': name,
                'status': status,
            },
            errors: {
                400: `Invalid input`,
            },
        });
    }
    /**
     * Deletes a pet.
     * Delete a pet.
     * @returns any Pet deleted
     * @throws ApiError
     */
    public static deletePet({
        petId,
        apiKey,
    }: {
        /**
         * Pet id to delete
         */
        petId: number,
        apiKey?: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/pet/{petId}',
            path: {
                'petId': petId,
            },
            headers: {
                'api_key': apiKey,
            },
            errors: {
                400: `Invalid pet value`,
            },
        });
    }
    /**
     * Uploads an image.
     * Upload image of the pet.
     * @returns ApiResponse successful operation
     * @returns any Unexpected error
     * @throws ApiError
     */
    public static uploadFile({
        petId,
        additionalMetadata,
        requestBody,
    }: {
        /**
         * ID of pet to update
         */
        petId: number,
        /**
         * Additional Metadata
         */
        additionalMetadata?: string,
        requestBody?: Blob,
    }): CancelablePromise<ApiResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/pet/{petId}/uploadImage',
            path: {
                'petId': petId,
            },
            query: {
                'additionalMetadata': additionalMetadata,
            },
            body: requestBody,
            mediaType: 'application/octet-stream',
            errors: {
                400: `No file uploaded`,
                404: `Pet not found`,
            },
        });
    }
}
