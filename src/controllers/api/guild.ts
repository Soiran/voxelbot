import { Guild } from 'discord.js';
import { client } from '../../client';


export async function getGuild(id: string) : Promise<Guild> {
    return client.guilds.fetch(id);
}