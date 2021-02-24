import * as lodash from "lodash";
import { client } from '../client';
import { Permissions } from './permissions';
import { GuildChannel, Message, MessageEmbed, TextChannel } from 'discord.js';
import { permissionsExist } from '../controllers/permissions/codex';
import { setTag, tagExist, getTagInfo } from '../controllers/tags';
import { User } from './user';


export type CommandForm = {
    prefixes: Array<string>,
    aliases: Array<string>,
    delimiter?: string,
    argumentsCount?: number
};

export type CommandContext = {
    text: string,
    arguments: Array<string>,
    flags: Array<string>
};


/**
 * Splitting string limited times.
 * @param string 
 * @param delimiter 
 * @param count 
 */
const splitOver = function(string: string, delimiter: string, count: number) : Array<any> {
    let splitted = string.split(delimiter);
    return splitted.slice(0, count).concat(splitted.slice(count).join(delimiter)).filter(e => e);
};


export class Command {
    context: CommandForm;
    permissions: Permissions;
    commandFunction: (msg: Message, context?: CommandContext) => Promise<any>;

    constructor(context: CommandForm, permissions: Permissions, commandFunction: (msg: Message, context?: CommandContext) => Promise<any>) {
        this.context = context;
        this.permissions = permissions;
        this.commandFunction = commandFunction;
    }

    matches(text: string) : CommandContext {
        let temp = text;
        let rgx = new RegExp(`^(${this.context.prefixes.join('|')})(${this.context.aliases.join('|')})`, 'gi');
        let shifted = temp.replace(rgx, '');
        if (shifted !== temp) {
            shifted = shifted.trim();
            if (shifted) {
                let delimiter = this.context.delimiter || ' ';
                let argumentsCount = this.context.argumentsCount - 1 || 0;
                let flags = [].concat(shifted.match(/(?<!\w)--[^\s]+/g)).filter(e => e).map(f => f.replace(/^--/g, ''));
                let args = splitOver(shifted.split(/\s\s+/g).join(' ').replace(/(?<!\w)--[^\s]+/g, ''), delimiter, argumentsCount).map(a => a.trim()).filter(e => e);
                return {
                    text: text,
                    arguments: args,
                    flags: flags
                };
            } else {
                return {
                    text: text,
                    arguments: [],
                    flags: []
                }
            }
        }
    }

    allowed(user: User) : boolean {
        return user.havePermissions(this.permissions);
    }

    async use(msg: Message, user: User) {
        let match = this.matches(msg.content);
        console.log(match);
        let data = await this.commandFunction(msg, match);
        let sendAnswer = true;
        let saveTagName = '';
        let editTagName = '';
        let notAllowedFlags = new Array<string>();
        let errorMessages = new Array<string>();
        let channel = msg.channel;
        if (!data[1]) {
            data[1] = {};
        }
        //// flags parsing
        for (let flag of match.flags) {
            let sepIndex = flag.indexOf('-') > -1 ? flag.indexOf('-') : flag.length;
            let flagName = flag.slice(0, sepIndex);
            let flagData = flag.slice(sepIndex + 1, flag.length);
            let flagPermission = new Permissions(`flags.${flagName}`);
            if (!user.havePermissions(flagPermission) && permissionsExist(flagPermission)) {
                notAllowedFlags.push(flagName);
                continue;
            }
            console.log(sepIndex, flagName, flagData);
            if (notAllowedFlags.length > 0) continue;
            if (flagName === 'delete') {
                msg.delete();
            } else if (flagName === 'hide') {
                sendAnswer = false;
            } else if (flagName === 'dm') {
                sendAnswer = false;
                msg.author.send(data[0], data[1] || {});
            } else if (flagName === 'pin') {
                if (data[0] instanceof MessageEmbed) {
                    data[0].setImage(Array.from(msg.attachments.values())[0].url);
                } else {
                    data[1].files = lodash.union(data[1].files || [], Array.from(msg.attachments.values()).map(a => a.url));
                }
            } else if (flagName.startsWith('channel')) {
                let channelId = flagData;
                if (+channelId) {
                    let switchedChannel: any = Array.from(msg.guild.channels.cache.filter(c => c.id === channelId && c.type != 'voice').values())[0];
                    if (switchedChannel) {
                        channel = switchedChannel;
                    }
                }
            } else if (flagName.startsWith('tag')) {
                if (!flagData.match(/^([a-zA-Z]|[а-яА-Я]|\d|-|_)+$/g)) {
                    errorMessages.push('`tag`: Можно использовать только буквы, цифры и символы: "-", "_".');
                } else {
                    saveTagName = flagData;
                }
            } else if (flagName.startsWith('edit')) {
                editTagName = flagData;
                if (!tagExist(editTagName)) {
                    errorMessages.push('`edit`: Данного тега не существует.');
                } else {
                    sendAnswer = false;
                }
            }
        }
        if (notAllowedFlags.length > 0) {
            msg.channel.send(`Вы не можете использовать данные флаги: \`${notAllowedFlags.join('`, `')}\``);
            return;
        }
        if (errorMessages.length > 0) {
            msg.channel.send(errorMessages.join('\n'));
            return;
        }
        let message: Message;
        if (editTagName && tagExist(editTagName)) {
            let tagInfo = getTagInfo(editTagName);
            let editChannel: any = Array.from(msg.guild.channels.cache.filter(c => c.id === tagInfo.channel_id && c.type != 'voice').values())[0];
            let editMessage: Message = await editChannel.messages.fetch(tagInfo.message_id);
            if (Object.keys(data[1]).length === 0) {
                message = await editMessage.edit(data[0]);
            } else {
                message = await editMessage.edit(data[0], data[1]);
            }
        }
        if (sendAnswer) {
            if (Object.keys(data[1]).length === 0) {
                message = await channel.send(data[0]);
            } else {
                message = await channel.send(data[0], data[1]);
            }
        }
        if (saveTagName && message) setTag(saveTagName, message.channel.id, message.id);
    }
}