import { Permissions } from '../../types/permissions';
import * as editGenerics from './editGenerics';


export function setRolePermissions(id: string, permissions: Permissions) {
    editGenerics.setPermissions('roles', id, permissions);
}

export function clearRolePermissions(id: string) {
    editGenerics.clearPermissions('roles', id);
}

export function addRolePermissions(id: string, permissions: Permissions) {
    editGenerics.addPermissions('roles', id, permissions);
}

export function removeRolePermissions(id: string, permissions: Permissions) {
    editGenerics.removePermissions('roles', id, permissions);
}