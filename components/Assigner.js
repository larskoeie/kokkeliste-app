

class Assigner {

    constructor(dinner) {
        var assigner = this;
        this.days = dinner.days;
        this.cells = dinner.cells;
        jQuery.each(this.cells, function (i, cell) {
            cell.el.click(function () {
                assigner.onClick(cell);
            });
        });
    }

    go() {
        this.setRunning(true);
        while (! done) {
            if (running) {
                this.iteration();
            }
        }
        this.setRunning(false);
    }

    setRunning (r) {
        running = r;
        if (running) {
            jQuery('#running-indicator').text('running');
        } else {
            jQuery('#running-indicator').text('');
        }
    }

    setDone (d) {
        done = d;
        if (done) {
            jQuery('#done-indicator').text('done');
        } else {
            jQuery('#done-indicator').text('');
        }
    }
    /**
     *
     * @param cell
     */
    onClick(cell) {
        OutputMsg('assigner click ' + cell.getDay().getDateString());
        this.swapAssignmentsOnDays(cell.getDay(), cell.getDay().getPrevious());
    }

    /**
     *
     */
    iteration() {
        console.log('iteration');
        var assigner = this;
        var changed = false;


        this.fillHoles(1);

        this.fillHoles(-1);
        // no holes found - move to step 2
        if (0 && !changed) {
            var randomDay = assigner.getRandomAssignedDay();
            jQuery.each(randomDay.getAssignedCells(), function (i, randomCell) {

                var randomUser = randomCell.getUser();
                randomCell.setAssigned(false);
                day.getCellByUser(randomUser).setAssigned(true);
            });


        }

    }

    fillPossibleHoles () {
        this.setRunning(true);
        this.fillHoles(1);
    }
    fillUnknownHoles () {
        this.fillHoles(-1);
    }

    /**
     *
     * "Fill holes" means assign until there are no more to assign.
     */
    fillHoles(status) {
        var assigner = this;
        var changed = false;

        // step 1 - find holes
        for (var d=0; d<this.days.length; d++) {
            if (this.days[d].getPoints() < this.days[d].getNominalPoints()) {
                var cells = this.days[d].getCellsWithStatus(status);
                for (var u=0; u<cells.length; u++) {
                    var cell = cells[u];

                    if (!changed) {

                        var user = cell.getUser();

                        if (user.getPoints() < user.getNominalPoints()) {

                            if (!cell.getAssigned()) {
                                cell.setAssigned(true, true);
                                changed = true;

                            }
                        }
                    }
                }


            }
        }
        if (! changed) {
            this.setDone(true);
        }
    }

    /**
     *
     */
    findRowsAndSwapThem () {

        for (var d=0; d<this.days.length; d++) {

        }
    }

    /**
     *
     * @param user
     * @param fromDay
     * @param toDay
     */
    moveOneUserFromDayToDay(user, fromDay, toDay) {
        var fromCell = getCell(user, fromDay);

        fromCell.setConflictMute(true);
        fromDay.setNoUpdateTable(true);
        toDay.setNoUpdateTable(true);
        user.setNoUpdateTable(true);
        if (fromCell.getAssigned()) {
            var toCell = getCell(user, toDay);

            toCell.setConflictMute(true);
            console.info(fromCell.el.offset(), 'offset');
            fromCell.setAssigned(false);

            var element = jQuery('<span/>').
            css({
                position: 'absolute',
                top: (fromCell.el.offset().top + 5) + 'px',

                left: (fromCell.el.offset().left + 20) + 'px'
            }).text('X').
            animate({
                top: (toCell.el.offset().top + 5) + 'px',
                left: (toCell.el.offset().left + 20) + 'px'
            }, 1000, function(){

                toCell.setAssigned(true);

                element.remove();
                fromCell.setConflictMute(false);
                toCell.setConflictMute(false);
                fromDay.setNoUpdateTable(false);
                toDay.setNoUpdateTable(false);
                user.setNoUpdateTable(false);

            });

            jQuery('body').append(element);

            OutputMsg('moving user ' + user.getUid() + ' from ' + fromDay.getDateString() + ' to ' + toDay.getDateString());
        }

    }

    /**
     *
     * @param day1
     * @param day2
     */
    swapAssignmentsOnDays (day1, day2) {

        this.moveUsersFromDayToDay(day1, day2);
        this.moveUsersFromDayToDay(day2, day1);
    }

    /**
     *
     * @param fromDay
     * @param toDay
     */
    moveUsersFromDayToDay(fromDay, toDay) {
        for (var t=0; t<fromDay.getCells().length; t++) {
            var fromCell = fromDay.getCells()[t];
            if (fromCell.getAssigned()) {
                var user = fromCell.getUser();
                this.moveOneUserFromDayToDay(user, fromDay, toDay);
                OutputMsg('moving user ' + user.getUid() + ' from ' + fromDay.getDateString() + ' to ' + toDay.getDateString());
            }
        }
    }

    /**
     *
     * @return {*}
     */
    getRandomAssignedDay() {
        var randomDay;
        var assignedDays = getAssignedDays();
        if (assignedDays.length === 0) {
            return false;
        }
        randomDay = assignedDays[Math.floor(assignedDays.length * Math.random(45))];
        return randomDay;

    }


}