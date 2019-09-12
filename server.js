var express = require('express'),
    https = require('https'),
    fs = require('fs'),
    app = express(),
    port = process.env.PORT || 3000,
    portHttps = 3443,
    bodyParser = require('body-parser'),
    controller = require('./controller'),
    connection = require('./conn');

const http = require('http').createServer(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./routes');
routes(app);

http.listen(port);
https.createServer(app).listen(portHttps);

console.log('Copyright (c) 2019 Stanley Ang.\nHello, AdabServer! HTTP server started on port: ' + port + ' and HTTPS on port: ' + portHttps);

// socket.io
const io = require('socket.io')(http);

io.on('connection', (socket) => {
    let connectedRoomId, courseCode, classType, session, topic, transactionDate, filePath, dir;
    console.log('a user connected');

    socket.on('join room', (roomId) => {
        socket.join(roomId);
        connectedRoomId = roomId;
        console.log('a user connected to room #' + roomId);

        let sql1 = "SELECT `course_code`, `class_type`, `session`, `topic`, DATE_FORMAT(`transaction_date`, '%Y-%m-%d') as transaction_date FROM `courses_transaction` WHERE `transaction_Id` = ?";
        connection.query(sql1, [roomId], (e, r) => {
            if (e) throw e;
            courseCode = r[0].course_code;
            classType = r[0].class_type;
            session = r[0].session;
            topic = r[0].topic;
            transactionDate = r[0].transaction_date;
            filePath = './' + courseCode + '/' + courseCode + '_' + classType + session + '_' + topic + "_" + transactionDate + "_" + roomId;
            dir = './' + courseCode;

            if (fs.existsSync(filePath)) {
                fs.readFile(filePath, function(err, data) {
                    io.to(roomId).emit('file', data.toString());
                });
            }
        });

        // update is_live to true
        let sql = "UPDATE `courses_transaction` SET `is_live` = 1 WHERE `transaction_Id` = ?";
        connection.query(sql, [roomId], (err, res) => {
            if (err) throw err;
        });
    });

    socket.on('message', (msg) => {
        io.to(connectedRoomId).emit('message', msg);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        fs.appendFile(filePath, msg, function(e1) {
            if (e1) throw e1;
        });
    });

    socket.on('discussion', (msg) => {
        io.to(connectedRoomId).emit('discussion', msg);
    });

    socket.on('disconnect from room', () => {
        socket.leave(connectedRoomId, () => {
            connectedRoomId = null;
        });
    });

    socket.on('disconnect', () => {
        console.log('a user disconnected');

        // update is_live to false
        let sql = "UPDATE `courses_transaction` SET `is_live` = 0 WHERE `transaction_Id` = ?";
        connection.query(sql, [connectedRoomId], (err, res) => {
            if (err) throw err;
        });
    });
});