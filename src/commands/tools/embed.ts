import { Message, MessageEmbed } from 'discord.js';
import { Permissions } from '../../types/permissions';
import { Command, CommandContext } from '../../types/command';


export default new Command({
    prefixes: ['/', '!'],
    aliases: ['embed'],
    delimiter: ',',
    argumentsCount: 3
}, new Permissions('tools.embed'), async (msg: Message, context: CommandContext) => {
    if (context.arguments.length < 3) {
        return '`embed <color>, <title>, <text>`';
    }
    return [ new MessageEmbed()
        .setColor(context.arguments[0])
        .setTitle(context.arguments[1])
        .setDescription(context.arguments[2]) ];
})