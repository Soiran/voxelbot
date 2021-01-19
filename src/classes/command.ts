import { Permissions } from './permissions';
import { Message } from 'discord.js';
import { User } from './user';


export class Command {
    regexp: RegExp;
    permissions: Permissions;
    commandFunction: (msg: Message, match) => void;

    constructor(regexp: RegExp, permissions: Permissions, commandFunction: (msg: Message) => void) {
        this.regexp = regexp;
        this.permissions = permissions;
        this.commandFunction = commandFunction;
    }

    matches(text: string) : boolean {
        let match = this.regexp.exec(text);
        this.regexp.exec(''); // dump
        return !!match;
    }

    allowed(user: User) : boolean {
        return user.permissions.includes(this.permissions);
    }

    use(msg: Message) {
        let match = this.regexp.exec(msg.content);
        this.regexp.exec(''); // dump
        this.commandFunction(msg, match);
    }
}
