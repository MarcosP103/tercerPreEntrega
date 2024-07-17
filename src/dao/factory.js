import config from '../config/db.js';

let Users;
switch (process.env.PERSISTENCE) {
    case "MONGO":
        const { default: UserModel } = await import('./models/user.model.js');
        Users = UserModel;
        break;
    case "MEMORY":
        const { default: UsersMemory } = await import("./memory/user.memory.js");
        Users = new UsersMemory();
        break;
    default:
        throw new Error("Invalid persistence option");
}

export { Users };
