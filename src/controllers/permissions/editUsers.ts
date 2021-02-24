import { Permissions } from '../../types/permissions';
import * as editGenerics from './editGenerics';


export function setUserPermissions(id: string, permissions: Permissions) {
    editGenerics.setPermissions('users', id, permissions);
}

export function clearUserPermissions(id: string) {
    editGenerics.clearPermissions('users', id);
}

export function addUserPermissions(id: string, permissions: Permissions) {
    editGenerics.addPermissions('users', id, permissions);
}

export function removeUserPermissions(id: string, permissions: Permissions) {
    editGenerics.removePermissions('users', id, permissions);
}