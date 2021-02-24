import * as lodash from "lodash";
import { Permissions } from '../../types/permissions';
import { permissionsDatabase } from "../../connections/permissions";
import { sessionUsers } from "../../session";

// generic method
export function setPermissions(type: string, id: string, permissions: Permissions) {
    permissionsDatabase.set(`${type}.${id}`, permissions.list);
}

// generic method
export function clearPermissions(type: string, id: string) {
    permissionsDatabase.delete(`${type}.${id}`);
}

// generic method
export function addPermissions(type: string, id: string, permissions: Permissions) {
    if (!permissionsDatabase.exists(`${type}.${id}`)) {
        permissionsDatabase.set(`${type}.${id}`, permissions.list);
    } else {
        permissionsDatabase.update(`${type}.${id}`, pl => {
            console.log(lodash.union(pl, permissions.list));
            return lodash.union(pl, permissions.list);
        });
    }
}

// generic method
export function removePermissions(type: string, id: string, permissions: Permissions) {
    if (!permissionsDatabase.exists(`${type}.${id}`)) {
        permissionsDatabase.set(`${type}.${id}`, []);
    }
    let updated = permissionsDatabase.update(`${type}.${id}`, pl => pl.filter(e => !permissions.list.includes(e)));
    if (updated.length === 0) clearPermissions(type, id);
}