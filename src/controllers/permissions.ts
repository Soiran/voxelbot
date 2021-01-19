import { Guild } from 'discord.js';
import { getRoles } from './api/roles';
import { Permissions } from '../classes/permissions';
import { permissionsDatabase } from '../connections/permissions';
import { sessionUsers } from '../session';
import { config } from '../config';


export async function getPermissions(guild: Guild, memberId: string) : Promise<Permissions> {
    let roles = await getRoles(guild, memberId);
    let rolesIds = roles.keyArray().filter(k => permissionsDatabase.exists(`roles.${k}`));
    let defaultPermissions : Permissions = new Permissions(config.defaultPermissions);
    let personalPermissions : Permissions = new Permissions(permissionsDatabase.get(`users.${memberId}`));
    let rolesPermissions : Array<Permissions> = rolesIds.map(k => new Permissions(permissionsDatabase.get(`roles.${k}`)));
    let genericPermissions = new Permissions([]);

    genericPermissions.merge(defaultPermissions);
    genericPermissions.merge(personalPermissions);
    rolesPermissions.forEach(p => genericPermissions.merge(p));

    return genericPermissions;
}