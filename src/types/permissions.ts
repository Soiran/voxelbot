export class Permissions {
    list: Array<string>;

    constructor(...permissionsList: Array<string>) {
        this.list = permissionsList;
    }

    includes(permissions: Permissions) : boolean {
        if (this.list.includes('*')) return true;
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