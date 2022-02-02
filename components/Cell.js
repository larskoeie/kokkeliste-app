


class Cell {

    constructor(day, user) {

        var cell = this;
        this.day = day;
        this.user = user;

        this.status = -1;
        this.assigned = false;
        this.distanceToNearestAssigned = 100;
        this.conflict = false;
        this.conflictMute = false;
        this.conflictTexts = [];

        this.el = jQuery('<td/>');
        this.el.addClass('status');
        if (this.user.getFirstInGroup()) {
            this.el.addClass('first-in-group');
        }
        this.el.click(function () {
            cell.onClick();
        });
        this.setStatus(dinner.cellData[day.dateString][this.user.uid]['status']);
        day.el.append(this.el);

    }

    /**
     *
     * @return {*}
     */
    getDay() {
        return this.day;
    }

    /**
     *
     * @return {*}
     */
    getUser() {
        return this.user;
    }

    /**
     *
     * @return {*}
     */
    getStatus() {
        return this.status;
    }

    /**
     *
     * @param status
     */
    setStatus(status) {
        OutputMsg('Setting status to ' + status);
        this.status = status;
        this.el.removeClass('status-unknown status-possible status-not-possible');
        switch (this.status) {
            case -1 :
                this.el.addClass('status-unknown');
                break;

            case 0 :
                this.el.addClass('status-not-possible');
                break;

            case 1 :
                this.el.addClass('status-possible');
                break;
        }
    }

    /**
     * Is it possible - right now - to place an assignment in this cell.
     */
    getPossible() {

        if (this.getDistanceToNearestAssigned() <= 3) {
            return false;
        }

        return this.getStatus() == 1
            || this.getStatus() == -1
    }

    /**
     *
     * @param distance
     */
    setDistanceToNearestAssigned(distance) {
        this.distanceToNearestAssigned = distance;


    }

    /**
     *
     * @return {number|*}
     */
    getDistanceToNearestAssigned() {
        return this.distanceToNearestAssigned;
    }

    setConflictMute (mute) {
        this.conflictMute = mute;
    }
    getConflictMute () {
        return this.conflictMute;
    }

    /**
     *
     */
    updateConflict() {
        this.conflict = false;
        this.conflictTexts = [];

        if (this.getAssigned() && this.getDistanceToNearestAssigned() > 0 && this.getDistanceToNearestAssigned() <= 2) {
            this.conflict = true;
            this.conflictTexts.push('Too close');
        }
        if (this.getAssigned() && this.getStatus() == 0) {
            this.conflict = true;
            this.conflictTexts.push('Not possible');
        }

    }

    /**
     *
     * @return {number|*}
     */
    getAssigned() {
        return this.assigned;
    }

    /**
     *
     * @param assigned
     */
    setAssigned(assigned, animation) {
        var cell = this;
        if (animation) {
            running = false;
            var element = jQuery('<span/>').
            css({
                position: 'absolute',
                top: '0px',
                left: '0px'
            }).text('X').
            animate({
                top: (cell.el.offset().top + 5) + 'px',
                left: (cell.el.offset().left + 20) + 'px'
            }, 1000, function(){

                toCell.setAssigned(true);

                element.remove();
                cell.setConflictMute(false);
                cell.getDay().setNoUpdateTable(false);
                cell.getUser().setNoUpdateTable(false);

                this.assigned = assigned;
                this.updatePoints();
                this.updateTable();
                this.getUser().getGroup().updateDistances();
                this.getUser().getGroup().updateTable();

                running = true;

            });

            jQuery('body').append(element);
        }
    }

    /**
     *
     */
    updateTable() {
        if (this.assigned) {
            this.el.text('O');
        } else {
            if (this.distanceToNearestAssigned <= 3) {
                this.el.text('-');
            } else {

                this.el.text('');

            }
        }

        //this.el.text(this.el.text() + this.getDistanceToNearestAssigned());

        if (this.conflict && ! this.conflictMute) {
            this.el.addClass('conflict');
            this.el.attr('title', this.conflictTexts.join(', '));
        } else {
            this.el.removeClass('conflict');
        }

        this.el.attr('data-distance', this.getDistanceToNearestAssigned());

    }

    /**
     *
     */
    toggleAssigned() {
        this.setAssigned(!this.assigned);
        this.updatePoints();
    }

    /**
     *
     */
    updateOk() {

    }

    /**
     *
     */
    updatePoints() {

        this.points = this.assigned ? 2 : 0;
        this.day.updatePoints();
        this.user.updatePoints();

    }


    /**
     *
     */
    onClick() {
        OutputMsg('click ' + this.day.getDateString() + ' ' + this.user.uid);


//        this.toggleAssigned();

    }

}