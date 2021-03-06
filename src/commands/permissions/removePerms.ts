import { removeUserPermissions, removeRolePermissions, permissionsExist } from '../../controllers/permissions';
import { Message } from 'discord.js';
import { Permissions } from '../../types/permissions';
import { Command, CommandContext } from '../../types/command';


export default new Command({
    prefixes: ['/', '!'],
    aliases: ['removeperms'],
    argumentsCount: Infinity
}, new Permissions('permissions.remove'), async (msg: Message, context: CommandContext) => {
    if (context.arguments.length < 2) {
        return [ '`removeperms <mention> perm1, perm2...`' ];
    }
    if (!context.arguments[0].match(/^<@(!|&)?(\d+)>$/gi)) {
        return [ 'Первое значение должно быть @упоминанием пользователя или роли.' ];
    }
    let perms = new Permissions(...context.arguments.slice(1));
    if (!permissionsExist(perms)) {
        return [ '<#802834862050246666>' ];
    }
    let rolesMentions = msg.mentions.roles.keyArray();
    let usersMentions = msg.mentions.users.keyArray();
    if (rolesMentions.length === 1 && !usersMentions.length) {
        await removeUserPermissions(rolesMentions[0], perms);
    } else if (usersMentions.length === 1 && !rolesMentions.length) {
        await removeRolePermissions(usersMentions[0], perms);
    } else {
        return 'Должно быть только одно @упоминание пользователя или роли.';
    }
    return 'Успешно изменено.';
})