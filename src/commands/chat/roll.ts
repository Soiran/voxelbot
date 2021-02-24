import { Message } from 'discord.js';
import { Permissions } from '../../types/permissions';
import { Command, CommandContext } from '../../types/command';


export default new Command({
    prefixes: ['!', ''],
    aliases: ['ролл', 'roll']
}, new Permissions('chat.roll'), async (msg: Message, context: CommandContext) => {
    let rolled = Math.round(Math.random() * 100);
    return [ rolled ];
})