import { Collection, Role, Guild } from 'discord.js';
import { getMember } from './members';


export async function getRoles(guild: Guild, memberId: string) : Promise<Collection<string, Role>> {
    let member = await getMember(memberId, guild);
    return member.roles.cache;
}