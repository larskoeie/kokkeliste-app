class Table {


    constructor (element, r) {

        this.el = element;
        this.round = r;

        jQuery(document).ready(function () {
            jQuery('.interactive td.status').click(function () {
                var td = jQuery(this);
                var div = td.find('div');
                div.text('.');

                var assigned = td.hasClass('assigned-1');
                var newAssigned = !assigned;
                jQuery.ajax({
                    url: '/admin/dinner_assignment_ajax/' + td.data('uid') + '/' + td.data('date') + '/' + (newAssigned ? '1' : '0'),
                    success: function (data) {
                        if (data.assigned || false) {
                            td.removeClass('assigned-0').addClass('assigned-1');
                            div.text('X');
                        } else {
                            td.removeClass('assigned-1').addClass('assigned-0');
                            div.text('');
                        }
                        updateOkClasses();
                    }
                });

            });

            updateOkClasses();

        });

        function updateOkClasses() {
            jQuery('th.user').each(function () {
                var uid = jQuery(this).data('uid');
                var userPoints = 0;
                jQuery('.user-' + uid + '.assigned-1').each(function () {
                    userPoints += parseInt(config.users[uid].pointsprdate);
                });
//		console.log('userpoints:' + userPoints + ', nominal:' + config.users[id].pointstotal);
                if (userPoints == config.users[uid].pointstotal) {
                    jQuery('.user-' + uid).addClass('user-ok');
                } else {
                    jQuery('.user-' + uid).removeClass('user-ok');
                }
            });

            jQuery('th.date').each(function () {
                var date = jQuery(this).data('date');
                var datePoints = 0;
                jQuery('.date-' + date + '.assigned-1').each(function () {
                    var uid = jQuery(this).data('uid');
                    datePoints += parseInt(config.users[uid].pointsprdate);
                });
//		console.log('datepoints:' + datePoints + ', nominal:' + config.dates[date].pointstotal);
                if (datePoints == config.dates[date].pointstotal) {
                    jQuery('.date-' + date).addClass('date-ok');
                } else {
                    jQuery('.date-' + date).removeClass('date-ok');
                }
            });
        }

        var running = false, done = false;


    }

    /**
     *
     * @return {*}
     */
    getElement  () {
        return this.el;
    };

    getRound () {
        return this.round;
    }

    render () {
        var table = this;
        this.el.empty();
        var headerRow = $('<tr/>').append('<th/>');
        $.each(table.round.getUsers(), function(i, user){
            headerRow.append(
                $('<th/>').text(user.getUid())
            )
        });

        this.el.append(
            headerRow
        );
        $.each(this.round.getDays(), function(i, day){
            var row = $('<tr/>').append(
                $('<th/>').text(day.getDateString())
            );

            $.each(table.round.getUsers(), function(i, user){
                row.append(
                    $('<td/>').text('x')
                )
            });

            table.el.append(
                row
            );
        })
    }
    shuffle(array) {
        let counter = array.length;

        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            let index = Math.floor(Math.random() * counter);

            // Decrease counter by 1
            counter--;

            // And swap the last element with it
            let temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }

        return array;
    }

    /**
     *
     * @param dayData
     * @param userData
     * @param cellData
     * @constructor
     */
    Init (data) {

        var dayData = data.dates;
        var userData = data.users;
        var cellData = data.cells;

        dinner.cellData = cellData;

        dinner.users = [];
        dinner.userGroups = [];
        var count = 0, _groupId = -1;
        jQuery.each(userData, function (i, el) {
            user = new User(i, count);
            var groupId = Math.floor(count / 2);
            var userGroup = getUserGroup(groupId);
            user.setFirstInGroup(groupId !== _groupId);
            if (!userGroup) {
                userGroup = new UserGroup(groupId);
                dinner.userGroups.push(userGroup);
            }
            userGroup.addUser(user);
            user.setGroup(userGroup);
            user.setNominalPoints(el.pointstotal);
            dinner.users.push(user);

            count++;
            _groupId = groupId;
        });
        dinner.days = [];
        dinner.cells = [];
        count = 0;
        jQuery.each(dayData, function (i, el) {
            day = new Day(i, count++);
            day.setNominalPoints(el.pointstotal);
            dinner.days.push(day);

        });

        console.log(dinner.days);
        console.log(dinner.users);
        console.log(dinner.cells);
        console.log(dinner.userGroups);

    };


    OutputMsg (msg) {
        jQuery('#messages').prepend(
            jQuery('<div/>').text(msg)
        );

    };

    loadAll () {

        jQuery.ajax({
            url: '/'
        });
    };
    storeAll () {
        var nodes = [];
        var days = getDays();
        for (var t = 0; t < days.length; t++) {
            day = days[t];
            var u = [];
            var users = day.getAssignedUsers();
            for (var j = 0; j < users.length; j++) {
                u.push({
                    uid: users[j].getUid()
                });
            }
            nodes.push({
                dateString: day.getDateString(),
                users: u
            });

        }
        var body = {
            nodes: nodes
        };
        jQuery.ajax({
            url: '/admin/dinner_assignment_ajax_full',
            method: 'POST',
            contentType: 'json',
            dataType: 'json',
            data: JSON.stringify(body, '', 4)
        });

    };


}