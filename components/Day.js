
/**
 *
 * @param dateString
 * @returns {{getDateString: getDateString, setPoints: setPoints, getPoints: getPoints, setNominalPoints: setNominalPoints, getNominalPoints: getNominalPoints}}
 * @constructor
 */
class Day {

    constructor(dateString, index) {
        this.dateString = dateString;
        this.index = index;
        this.points = 0;
        this.nominalPoints = 2;
        this.noUpdateTable = false;

        this.el = jQuery('<tr/>');
        this.header = jQuery('<th/>');

        this.el.append(this.header);
    //    dinner.el.append(this.el);

        this.cells = [];

        var day = this;
        /*
        jQuery.each(dinner.users, function (i, user) {
            var cell = new Cell(day, user);

            dinner.cells.push(cell);
            day.addCell(cell);
            user.addCell(cell);

        });

        this.updateTable();
        
         */
    }

    getDateString() {
        return this.dateString;
    }

    getIndex() {
        return this.index;
    }


    addCell(cell) {
        this.cells.push(cell);
    }

    setPoints(points) {
        this.points = points;
    }

    getPrevious() {
        if (this.index == 0) {
            return false;
        }
        return dinner.days[this.index - 1];
    }

    getNext() {
        if (this.index + 1 == dinner.days.length) {
            return false;
        }
        return dinner.days[this.index + 1];
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

    updateOk() {
        this.ok = this.points == this.nominalPoints;
        OutputMsg(this.ok);
    }

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
        var day = this;
        this.header.html(this.getDateString() + '<br/>' + this.getPoints() + ':' + this.getNominalPoints() + ':' + (this.ok ? 1 : 0));
        jQuery.each(day.getCells(), function (i, cell) {
            if (day.ok) {
                cell.el.addClass('date-ok');
            } else {
                cell.el.removeClass('date-ok');
            }
        });
    }

    /**
     *
     * @return {number|*}
     */
    getPoints() {
        return this.points;
    }


    setNominalPoints(points) {
        this.nominalPoints = points;
    }


    getNominalPoints() {
        return this.nominalPoints;


    }

    getOk() {
        return this.ok;
    }

    getCells() {
        return this.cells;
    }

    getCellByUser(user) {
        var out = null;
        jQuery.each(this.getCells(), function (i, cell) {
            if (cell.getUser().getUid() == user.getUid()) {
                out = cell;
            }
        });
        if (out) {
            return out;
        }
        return false;
    }

    /**
     *
     * @return {Array}
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

    getCellsWithStatus (status) {
        var cells = shuffle(this.cells);
        var possibleCells = [];
        for (var t=0; t<cells.length; t++){
            var cell = cells[t];
            if (cell.getStatus() === status) {
                possibleCells.push(cell);
            }
        }
        return possibleCells;
    }

    /**
     *
     * @return {Array}
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

    getAssignedUsers() {
        var cells = this.getAssignedCells();
        var users = [];
        for (var t=0; t<cells.length; t++) {
            users.push(cells[t].getUser());
        }
        return users;
    }
}