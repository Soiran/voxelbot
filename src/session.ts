import { User } from './classes/user';
import { usersDatabase } from './connections/users';


export const sessionUsers: Object = {};
usersDatabase.entries().forEach(u => {
    let user = new User(u[0]);
    user.update();
    sessionUsers[u[0]] = user;
});