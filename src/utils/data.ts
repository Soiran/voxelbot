import * as fs from 'fs';

/**
 * The data class is used for easy reading and editing of JSON files.
 */
export class Data {
    path: string;
    suit: Object;
    models: Object;

    constructor(path, suit) {
        let tmp = path.split('.');
        if (tmp[tmp.length - 1] != 'json') {
            throw '(constructor) Can only read .json format file.';
        }
        this.path = path;
        this.suit = suit;
        this.models = {};
        let pathCtx = this.path.split('/').slice(1);
        let shiftingPath = './';
        if (pathCtx.length > 1) {
            pathCtx.slice(0, 1).forEach(f => {
                shiftingPath += (f + '/')
                if (!fs.existsSync(shiftingPath)) {
                    fs.mkdirSync(shiftingPath);
                }
            })
        }
        if(!fs.existsSync(this.path)) {
            this.data = this.suit ? suit : {};
        } else {
            if (!this.data) {
                this.data = this.suit ? suit : {};
            }
        }
    }

    /**
     * Gets value by path from the discrete object.
     */
    static pathTarget(data: Object, path?: any) : Object {
        path = path ? path + '' : false;
        var target = data;
        if (path) {
            path = path.split(/\./g);
            path.forEach(f => {
                if (typeof target == 'object' && !(target instanceof Array)) {
                    if (target[f] == undefined) {
                        if (target instanceof Object) {
                            target[f] = true;
                        }
                    }
                    target = target[f];
                } else {
                    throw `Path "${path}" have not-object fields before target.`;
                }
            })
        }
        return target;
    }

    /**
     * Checks for key existing.
     */
    exists(path?: any) : boolean {
        path = path + '';
        var target = this.data;
        var exists = true;
        path = path.split('.')
        path.forEach(f => {
            if (typeof target == 'object' && !(target instanceof Array) && target[f] != undefined) {
                target = target[f];
            } else {
                exists = false;
            }
        })
        return exists;
    }
    
    get data() {
		return JSON.parse(fs.readFileSync(this.path).toString())
	}

	set data(value) {
		fs.writeFileSync(this.path, JSON.stringify(value).toString())
    }

    /**
     * Gets value from path.
     */
    get(path?) : any {
        return Data.pathTarget(this.data, path);
    }

    /**
     * Gets keys from path.
     */
    keys(path?) : Array<string> {
        let obj = Data.pathTarget(this.data, path);
        if (obj instanceof Object && !(obj instanceof Array)) {
            return Object.keys(Data.pathTarget(this.data, path));
        } else {
            throw `Cannot get object keys in the path "${path}". (not an object)`;
        }
    }

    /**
     * Gets values from path.
     */
    values(path?) : Array<any> {
        let obj = Data.pathTarget(this.data, path);
        if (obj instanceof Object && !(obj instanceof Array)) {
            return Object.values(Data.pathTarget(this.data, path));
        } else {
            throw `Cannot get object values in the path "${path}". (not an object)`;
        }
    }

    /**
     * Gets entries from path.
     */
    entries(path?) : Array<Object> {
        let obj = Data.pathTarget(this.data, path);
        if (obj instanceof Object && !(obj instanceof Array)) {
            return Object.entries(Data.pathTarget(this.data, path));
        } else {
            throw `Cannot get object entries in the path "${path}". (not an object)`;
        }
    }

    /**
     * Sets value to key by path.
     */
    set(path, value) {
        path = path + '';
        let containerPath = path.split('.').slice(0, -1).join('.');
        let field = path.split('.').pop();
        let data = this.data;
        let container = Data.pathTarget(data, containerPath);
        if (container instanceof Object && !(container instanceof Array)) {
            container[field] = value;
            this.data = data;
        } else {
            throw `(set) Cannot create a new field in the path "${path}". (not an object)`;
        }
    }

    /**
     * Removes value from array by path.
     */
    remove(path, value) {
        this.update(path, v => v.filter(e => e != value));
    }

    /**
     * Deletes key by path.
     */
    delete(path?) {
        path = path + '';
        let containerPath = path.split('.').slice(0, -1).join('.');
        let field = path.split('.').pop();
        let data = this.data;
        let container = Data.pathTarget(data, containerPath);
        if (container instanceof Object && !(container instanceof Array)) {
            delete container[field];
            this.data = data;
        } else {
            throw `(set) Cannot remove field in the path "${path}". (not an object)`;
        }
    }

    /**
     * Renames key by path.
     */
    rename(path, newName) {
        path = path + '';
        let containerPath = path.split('.').slice(0, -1).join('.');
        let field = path.split('.').pop();
        let data = this.data;
        let container = Data.pathTarget(data, containerPath);
        if (container instanceof Object) {
            let tmp = container[field];
            delete container[field];
            container[newName] = tmp;
            this.data = data;
        } else {
            throw `(set) Cannot rename field in the path "${path}". (not an object)`;
        }
    }

    /**
     * Push value to array from path.
     */
    push(path, value) {
        path = path + '';
        let data = this.data;
        let container = Data.pathTarget(data, path);
        if (container instanceof Array) {
            container.push(value);
            this.data = data;
        } else {
            throw `(set) Cannot push a new element in the path "${path}". (not an array)`;
        }
    }

    /**
     * Updates key value by path.
     */
	update(path, update) {
        path = path + '';
        path = path.split('.');
        var data = this.data;
        var root = data;
        var field = path.pop();
        path.forEach(f => {
            if ((typeof root == 'object' && !(root instanceof Array)) &&
                (typeof root[f] == 'object' && !(root[f] instanceof Array))) {
                root = root[f];
            } else {
                throw `(edit) Path "${path}" have not-object fields before target.`;
            }
        })
        root[field] = update(root[field]);
        this.data = data;
        return root[field];
	}

    /**
     * Wipes all data to suit.
     */
	wipe() {
		this.data = this.suit;
    }
    
    /**
     * Creates new data model.
     */
    addModel(modelName, scheme: Object) {
        this.models[modelName] = {
            scheme: scheme
        }
    }

    /**
     * Spawns data model.
     */
    spawn(modelName, data, path) {
        path = path + '';
        if (!(modelName in this.models)) {
            throw `(spawn) Model "${modelName}" is not exists in ${this.path}.`;
        }
        let model = this.models[modelName];
        for (let f in model.scheme) {
            if (model.scheme[f] instanceof Function) {
                if (!(f in data)) {
                    throw `(spawn) Missing field ${f} in query.`;
                } else {
                    if (model.scheme[f](data[f]) == (false || undefined || NaN)) {
                        throw `(spawn) Invalid type of field ${f} in query.`;
                    }
                }
            } else {
                if (!(f in data)) {
                    data[f] = model.scheme[f];
                }
            }
        }
        let dataAccessor = this.data;
        // query: key
        if (path.split(/\./g).length === 1) {
            dataAccessor[path] = data;
            return;
        }
        let container: Array<any> | Object = Data.pathTarget(dataAccessor, path.split(/\./g).slice(0, -1));
        let targetKey: string = path.split(/\./g).slice(-1);
        // query: array.0
        if (container instanceof Array) {
            if (+targetKey) {
                container[+targetKey] = data;
            } else {
                throw '(spawn) Cannot spawn new instance of model ${modelName} in this path. (not-numeric array key)';
            }
        } else if (container instanceof Object) {
            let obstacle = container[targetKey];
            if (obstacle instanceof Array) {
                obstacle.push(data);
            } else {
                container[targetKey] = data;
            }
        } else {
            throw `(spawn) Cannot spawn new instance of model ${modelName} in this path. (not a container)`;
        }
        this.data = dataAccessor;
    }
}