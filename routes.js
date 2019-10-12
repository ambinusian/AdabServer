'use strict';

module.exports = function(app) {
    var controller = require('./controller');
    var view = require('./view');

    app.route('/')
        .get(view.index);

    app.route('/user/login')
        .post(controller.login);

    app.route('/user/classes')
        .post(controller.class);

    app.route('/user/profile')
        .post(controller.profile);

    app.route('/user/class/details')
        .post(controller.classDetails);

    app.route('/user/picture')
        .post(controller.userProfilePic);

    app.route('/lecturer/startSession')
        .post(controller.startSession);

    app.route('/lecturer/endSession')
        .post(controller.endSession);

    app.route('/apiToken')
        .post(controller.apiToken);

    app.route('/user/fetchRemoteFile')
        .post(controller.getFile);

    app.route('/admin')
        .get(view.admin);

    app.route('/admin/login')
        .get(view.adminLogin);
};