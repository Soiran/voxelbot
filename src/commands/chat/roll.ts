import { Message } from 'discord.js';
import { Permissions } from '../../classes/permissions';
import { Command } from '../../classes/command';
import { client } from '../../client';


export default new Command(/^ролл/gi, new Permissions('chat.roll'), (msg: Message) => {
    let rolled = Math.round(Math.random() * 100);
    msg.channel.send(rolled);
})