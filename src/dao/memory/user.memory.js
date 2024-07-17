export default class UsersMemory {
    constructor() {
        this.data = [];
    }

    getAll = () => {
        return this.data;
    }

    add = (user) => {
        this.data.push(user);
        return user;
    }

    getById = (id) => {
        return this.data.find(user => user.id === id);
    }

    update = (id, updatedUser) => {
        const index = this.data.findIndex(user => user.id === id);
        if (index !== -1) {
            this.data[index] = { ...this.data[index], ...updatedUser };
            return this.data[index];
        }
        return null;
    }

    delete = (id) => {
        const index = this.data.findIndex(user => user.id === id);
        if (index !== -1) {
            return this.data.splice(index, 1);
        }
        return null;
    }
}
