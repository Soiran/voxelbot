import { GuildMember, Guild } from 'discord.js';


export async function getMember(id: string, guild: Guild) : Promise<GuildMember> {
    let member = await guild.members.fetch(id);
    return member;
}

export function isAdmin(member: GuildMember) : boolean {
    return member.hasPermission('ADMINISTRATOR');
}