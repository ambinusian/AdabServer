'use strict';

const response = require('./res');
const connection = require('./conn');

exports.index = (req, res) => {
    // res.sendFile(__dirname + '/chat.html');
    res.send('AdabServer &copy 2019 Bearcats.');
};

exports.admin = (req, res) => {
    res.sendFile(__dirname + '/public/admin.html');
}

exports.adminLogin = (req, res) => {
    res.sendFile(__dirname + '/public/admin-login.html');
}