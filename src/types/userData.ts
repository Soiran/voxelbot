/**
 * Модель данных пользователя.
 */
export type UserData = {
    id: string,
    pixels: number,
    voxels: number,
    inventory: Array<string>
};