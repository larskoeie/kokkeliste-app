/*
*
*/
class UserGroup {

    /**
     *
     * @param gid
     */
    constructor(gid) {
        this.gid = gid;
        this.users = [];
    }

    getGid() {
        return this.gid;
    }

    /**
     *
     * @param user
     */
    addUser(user) {
        this.users.push(user);
    }

    /**
     *
     */
    getUsers() {
        return this.users;
    }

    /**
     *
     */
    updateDistances() {
        for (var i = 0; i < this.getUsers().length; i++) {
            this.getUsers()[i].updateDistances();
        }
    }

    /**
     *
     */
    updateTable() {
        for (var i = 0; i < this.getUsers().length; i++) {
            this.getUsers()[i].updateTable();
        }
    }

}