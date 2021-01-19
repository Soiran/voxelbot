/**
 * Модель данных пользователя.
 */
export interface UserData {
    id: string,
    pixels: number,
    voxels: number,
    inventory: Array<string>
};