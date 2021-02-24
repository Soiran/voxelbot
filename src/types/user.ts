import { client } from '../client';
import { Permissions } from './permissions';
import { Stage } from './stage';
import { config } from '../config';
import { UserData } from './userData'; 
import * as usersController from '../controllers/users';
import { getGuild } from '../controllers/api/guild';
import { getMember, isAdmin } from '../controllers/api/members';
import { getGenericPermissions } from '../controllers/permissions';



export class User {
    id: string;
    data: UserData;
    stage: Stage;
    permissions: Permissions;

    constructor(id: string) { 
        this.id = id;
    }

    havePermissions(permissions: Permissions) {
        return this.permissions.includes(permissions);
    }

    // init
    async update() : Promise<User> {
        let guild = await getGuild(config.guildId);
        let member = await getMember(this.id, guild);
        this.data = usersController.getUserData(this.id);
        this.permissions = await getGenericPermissions(guild, this.id);
        if (isAdmin(member)) {
            this.permissions.merge(new Permissions('*'));
        }
        return this;
    }
}