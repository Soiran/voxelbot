import { User } from '../classes/user';
import { UserData } from '../interfaces/userData';
import { usersDatabase } from '../connections/users';
import { sessionUsers } from '../session';


export function getUserData(id: string) : UserData {
    return usersDatabase.get(id);
}

export async function registrateUser(data: UserData) {
    let user = new User(data.id);
    await user.update();
    usersDatabase.set(data.id, data);
    sessionUsers[data.id] = user;
}

export function deleteUser(id: string) {
    usersDatabase.delete(id);
    delete sessionUsers[id];
}