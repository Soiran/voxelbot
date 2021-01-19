import { Collection, Role, Guild } from 'discord.js';
import { getGuild } from './guild';
import { client } from '../../client';


export async function getRoles(guild: Guild, memberId: string) : Promise<Collection<string, Role>> {
    let member = await guild.members.fetch(memberId);
    return member.roles.cache;
}