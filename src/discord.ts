/**
 * Точка доступа к API.
 */
import { Client } from 'discord.js';
import { config } from './config';


export const client = new Client();
client.login(config.token);