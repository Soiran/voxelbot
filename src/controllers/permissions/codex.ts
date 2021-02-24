import { Permissions } from '../../types/permissions';
import { config } from '../../config';


export function getPermissionsCodex() : Permissions {
    let codex = config.permissionsCodex;
    let permissions = new Permissions();
    Object.entries(codex).forEach(group => {
        let permissionsGroup = new Permissions(...group[1].map(perm => `${group[0]}.${perm}`));
        permissions.merge(permissionsGroup);
    })
    return permissions;
}

export function permissionsExist(permissions: Permissions) {
    let codex = getPermissionsCodex();
    return codex.includes(permissions);
}