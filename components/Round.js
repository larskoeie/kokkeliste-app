class Round {


    setDays(d) {
        this.days = d;
    }

    /**
     *
     * @return {Array}
     */
    getDays() {
        return this.days;
    };

    /**
     *
     * @return {Array}
     */
    getUserGroups() {
        return dinner.userGroups;
    };

    setUsers(u) {
        this.users = u;
    }

    /**
     *
     * @return {Array}
     */
    getUsers() {
        return this.users;
    };


    /*
    * @return {Array}
    */
    getCells() {
        return this.cells;
    };

    /**
     *
     * @return {Array}
     */
    getAssignedDays() {
        var days = [];
        jQuery.each(getDays(), function (i, day) {
            if (day.getPoints() > 0) {
                days.push(day);
            }
        });
        return days;
    };

    /**
     *
     * @return {Array}
     */
    getAssignedCells() {
        var assignedCells = [];
        jQuery.each(getCells(), function (i, cell) {
            if (cell.getPoints() > 0) {
                assignedCells.push(cell);
            }
        });
        return assignedCells;
    };

    getUnassignedCells() {
        var unassignedCells = [];
        jQuery.each(getCells(), function (i, cell) {
            if (cell.getPoints() == 0) {
                unassignedCells.push(cell);
            }
        });
        return unassignedCells;
    };

    getUserGroup(gid) {
        for (var t = 0; t < dinner.userGroups.length; t++) {
            if (dinner.userGroups[t].getGid() == gid) {
                return dinner.userGroups[t];
            }
        }
        return false;
    };

    getCell(user, day) {
        for (var t = 0; t < getCells().length; t++) {
            var cell = getCells()[t];
            if (cell.getDay().getDateString() == day.getDateString()
                &&
                cell.getUser().getUid() == user.getUid()) {
                return cell;
            }
        }
        return false;
    };

}