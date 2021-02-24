import { clearUserPermissions, clearRolePermissions, permissionsExist } from '../../controllers/permissions';
import { Message } from 'discord.js';
import { Permissions } from '../../types/permissions';
import { Command, CommandContext } from '../../types/command';


export default new Command({
    prefixes: ['/', '!'],
    aliases: ['clearperms']
}, new Permissions('permissions.add'), async (msg: Message, context: CommandContext) => {
    if (context.arguments.length < 1) {
        return [ '`clearperms <mention>`' ];
    }
    if (!context.arguments[0].match(/^<@(!|&)?(\d+)>$/gi)) {
        return [ 'Первое значение должно быть @упоминанием пользователя или роли.' ];
    }
    let rolesMentions = msg.mentions.roles.keyArray();
    let usersMentions = msg.mentions.users.keyArray();
    if (rolesMentions.length === 1 && !usersMentions.length) {
        await clearUserPermissions(rolesMentions[0]);
    } else if (usersMentions.length === 1 && !rolesMentions.length) {
        await clearRolePermissions(usersMentions[0]);
    } else {
        return [ 'Должно быть только одно @упоминание пользователя или роли.' ];
    }
    return [ 'Успешно изменено.' ];
})