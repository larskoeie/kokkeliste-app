

class User {

    constructor(id, index) {
        this.id = id;
        this.index = index;

        this.group = Math.floor(index / 2);

        this.points = 0;
        this.nominalPoints = 0;
        this.pointsPrDay = 0;
        this.noUpdateTable = false;

        this.header = jQuery('<th/>');
//        dinner.el.find('tr').append(this.header);

        this.cells = [];
        this.updateTable();
    }

    is(user) {
        return (this.getUid() == user.getUid());
    }

    setGroup(userGroup) {
        this.userGroup = userGroup;
    }

    getGroup() {
        return this.userGroup;
    }

    setFirstInGroup(firstInGroup) {
        this.firstInGroup = firstInGroup;
    }

    getFirstInGroup() {
        return this.firstInGroup;
    }

    setLastInGroup(lastInGroup) {
        this.lastInGroup = lastInGroup;
    }

    getLastInGroup() {
        return this.lastInGroup;
    }

    addCell(cell) {
        this.cells.push(cell);
    }

    getUid() {
        return this.id;
    }

    getIndex() {
        return this.index;
    }

    getOk() {
        return this.ok;
    }

    updatePoints() {
        var points = 0;
        jQuery.each(this.getAssignedCells(), function (i, cell) {
            points += 2;
        });
        this.points = points;
        this.updateOk();
        this.updateTable();

    }

    /**
     *
     */
    updateDistances() {

        var assigned = [];
        var usersInGroup = this.getGroup().getUsers();
        console.info(usersInGroup, 'usersInGroup');
        var days = getDays();

        for (var a = 0; a < usersInGroup.length; a++) {
            var u1 = usersInGroup[a];
            for (var b = 0; b < days.length; b++) {
                var d1 = days[b];
                var min = 100;
                for (var c = 0; c < usersInGroup.length; c++) {

                    var u2 = usersInGroup[c];
                    for (var d = 0; d < days.length; d++) {
                        var d2 = days[d];


                        if (u2.getCellByDay(d2).getAssigned() && (b !== d)) {
                            //           console.info(a + ' ' + b + ' ' + c + ' ' + d + ' ' + usersInGroup[c].getCells()[d].getAssigned());
                            min = Math.min(min, Math.abs(b - d));
                        }
                    }
                }
                u1.getCellByDay(d1).setDistanceToNearestAssigned(min);
            }
        }
        this.updateConflict();
    }

    /**
     *
     */
    updateConflict() {
        for (var t = 0; t < this.getCells().length; t++) {
            this.getCells()[t].updateConflict();
        }
    }

    /**
     *
     */
    updateOk() {
        this.ok = this.points == this.nominalPoints;
    }

    /**
     *
     * @param noUpdateTable
     */
    setNoUpdateTable (noUpdateTable) {
        this.noUpdateTable = noUpdateTable;
        if (! this.noUpdateTable) {
            this.updateTable();
        }
    }

    /**
     *
     */
    updateTable() {
        if (this.noUpdateTable) {
            return;
        }
        var user = this;
        this.header.html(this.id + '/' + (this.getGroup() ? this.getGroup().getGid() : '') + '<br/>' + this.points);

        jQuery.each(user.getCells(), function (i, cell) {

            cell.updateTable();

            if (user.ok) {
                cell.el.addClass('user-ok');
            } else {
                cell.el.removeClass('user-ok');
            }

        });

    }

    /**
     *
     * @param points
     */
    setPoints(points) {
        this.points = points;
    }


    getPoints() {
        return this.points;
    }


    setNominalPoints(points) {
        this.nominalPoints = points;
    }


    getNominalPoints() {
        return this.nominalPoints;
    }

    setPointsPrDay(points) {
        this.pointsPrDay = points;
    }

    getPointsPrDay() {
        return this.pointsPrDay;
    }

    /**
     * @return array
     */
    getCells() {
        return this.cells;
    }

    getCellByDay(day) {
        for (var i=0; i<this.getCells().length; i++) {
            if (this.getCells()[i].getDay().getDateString() == day.getDateString()) {
                return this.getCells()[i];
            }
        }
        return false;
    }

    /**
     * @return array
     */
    getPossibleCells() {
        var cells = shuffle(this.cells);
        var possibleCells = [];
        for (var t=0; t<cells.length; t++){
            var cell = cells[t];
            if (cell.getPossible()) {
                possibleCells.push(cell);
            }
        }
        return possibleCells;
    }

    /**
     * @return array
     */
    getAssignedCells() {
        var cells = [];
        jQuery.each(this.cells, function (i, cell) {
            if (cell.getAssigned()) {
                cells.push(cell);
            }
        });
        return cells;
    }



}
