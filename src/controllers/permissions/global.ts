import * as lodash from "lodash";
import { Permissions } from '../../types/permissions';
import { Guild } from 'discord.js';
import { config } from '../../config';
import { permissionsDatabase } from "../../connections/permissions";
import { getRoles } from "../api/roles";


export function getUserPermissions(memberId: string) : Permissions {
    if (permissionsDatabase.exists(`users.${memberId}`)) {
        return new Permissions(...permissionsDatabase.get(`users.${memberId}`));
    } else {
        return new Permissions();
    }
}

export function getRolePermissions(roleId: string) : Permissions {
    if (permissionsDatabase.exists(`roles.${roleId}`)) {
        return new Permissions(...permissionsDatabase.get(`roles.${roleId}`));
    } else {
        return new Permissions();
    }
}

export async function getGenericPermissions(guild: Guild, memberId: string) : Promise<Permissions> {
    let roles = await getRoles(guild, memberId);
    let rolesIds = roles.keyArray().filter(k => permissionsDatabase.exists(`roles.${k}`));
    let defaultPermissions = new Permissions(...config.defaultPermissions);
    let userPermissions = getUserPermissions(memberId);
    let rolesPermissions = new Permissions(...lodash.union(...rolesIds.map(roleId => getRolePermissions(roleId).list)));
    let genericPermissions = new Permissions();

    genericPermissions.merge(defaultPermissions);
    genericPermissions.merge(userPermissions);
    genericPermissions.merge(rolesPermissions);

    return genericPermissions;
}