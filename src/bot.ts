import { getGuild } from './controllers/api/guild';
import { getRoles } from './controllers/api/roles';
import { client } from './client';
import { sessionUsers } from './session';
import * as usersController from './controllers/users';
import { User } from './classes/user';
import { Logger } from './utils/cl';
import { commands } from './commands';


const debug = new Logger('Bot');


client.on('ready', () => {
    debug.log('Ready', 'info');
})

client.on('message', async msg => {
    if (msg.author.bot) return;
    if (!sessionUsers[msg.author.id]) {
        await usersController.registrateUser({
            id: msg.member.id,
            pixels: 0,
            voxels: 0,
            inventory: new Array<string>()
        });
    }
    let user: User = sessionUsers[msg.author.id];
    if (!user.stage) {
        commands.forEach(cmd => {
            if (!cmd.matches(msg.content)) return;
            if (!cmd.allowed(user)) {
                msg.channel.send('У вас нет прав на использование данной команды.');
            } else {
                cmd.use(msg);
            }
        });
    }
    for (let id in sessionUsers) {
        sessionUsers[id].update();
    }
})