import { permissionsDatabase } from '../connections/permissions';
export class Permissions {
    list: Array<string>;

    constructor(permissionsList: Array<string> | string | any) {
        if (permissionsList instanceof Array) {
            this.list = permissionsList;
        } else if (typeof permissionsList === 'string') {
            this.list = [ permissionsList ];
        } else {
            this.list = [];
        }
    }

    includes(permissions: Permissions) : boolean {
        return permissions.list.every(p => this.list.includes(p));
    }

    merge(permissions: Permissions) {
        permissions.list.forEach(p => {
            if (!this.list.includes(p)) { 
                this.list.push(p);
            }
        })
    }
}