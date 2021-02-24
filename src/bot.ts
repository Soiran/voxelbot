import { getGuild } from './controllers/api/guild';
import { getRoles } from './controllers/api/roles';
import { client } from './client';
import { sessionUsers } from './session';
import * as usersController from './controllers/users';
import { User } from './types/user';
import { Logger } from './utils/cl';
import { commands } from './commands';


const debug = new Logger('Bot');


client.on('ready', () => {
    debug.log('Ready', 'info');
})

client.on('message', async msg => {
    if (msg.author.bot) return;
    console.log(msg);
    if (msg.channel.type === 'dm') {
        return msg.channel.send('Команды бота работают только на сервере.');
    }
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
        for (let cmd of commands) {
            if (!cmd.matches(msg.content)) continue;
            if (!cmd.allowed(user)) {
                msg.channel.send('У вас нет прав на использование данной команды.');
            } else {
                await cmd.use(msg, user);
            }
        }
    }
    for (let id in sessionUsers) {
        sessionUsers[id].update();
    }
})