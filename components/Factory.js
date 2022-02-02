

class Factory {

    usersFromArray (array) {
        var factory = this;
        var users = [];
        $.each(array, function (t, e) {
            users.push(factory.userFromData(e));
        });
        console.info(users);
        return users;
    }
    userFromData (data) {
        var user = new User(data.id);

        return user;
    }


    daysFromArray (array) {

        var factory = this;
        var days = [];
        $.each(array, function (t, e) {
            days.push(factory.dayFromData(e));
        });
        console.info(days);
        return days;

    }


    dayFromData (data) {

        var day = new Day(data.date);
        return day;
    }



}
