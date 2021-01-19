import { client } from '../client';
import { Permissions } from './permissions';
import { Stage } from './stage';
import { config } from '../config';
import { UserData } from '../interfaces/userData'; 
import * as usersController from '../controllers/users';
import { getGuild } from '../controllers/api/guild';
import { getPermissions } from '../controllers/permissions';



export class User {
    id: string;
    data: UserData;
    stage: Stage;
    permissions: Permissions;

    constructor(id: string) { 
        this.id = id;
    }

    // init
    async update() : Promise<User> {
        let guild = await getGuild(config.guildId);
        this.data = usersController.getUserData(this.id);
        this.permissions = await getPermissions(guild, this.id);
        return this;
    }
}