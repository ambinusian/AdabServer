'use strict';

const response = require('./res');
const connection = require('./conn');
const md5 = require('md5');
const randomstring = require('randomstring');
const fs = require('fs');

exports.index = (req, res) => {
    res.sendFile(__dirname + '/chat.html');
};

exports.login = (req, res) => {
    let sql = "SELECT `username`, `privilege` FROM `master_user` WHERE `username` = ? AND `password` = ?";
    let username = req.body.username;
    let password = md5(req.body.password);

    connection.query(sql, [username, password], (err, result) => {
        if (err) throw err;
        if (result.length === 1) {
            let sql1 = "UPDATE `master_user` SET `tokenid` = ? WHERE `username` = ?";
            let token_id = randomstring.generate(20);
            connection.query(sql1, [token_id, username], (error, results) => {
                if (error) throw error;
                let data = {
                    "username": result[0].username,
                    "privilege": result[0].privilege,
                    "token_id": token_id
                };
                response.ok(data, res);
            })
        } else if (result.length === 0) {
            response.unauthorized({"error_message": "wrong credentials", "error_code": 1}, res);
        }
    });
};

exports.class = (req, res) => {
    let sql = "SELECT username FROM master_user WHERE tokenid = ?";
    let tokenId = req.body.token_id;

    connection.query(sql, [tokenId], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            response.unauthorized({"error_message": "unauthorized", "error_code": 2}, res);
        } else {
            let username = result[0].username;
            let sql1 = "";
            if (username.length === 5 && username.charAt(0) === 'D') {
                sql1 = "SELECT `courses_transaction`.`transaction_Id`, `master_course`.`course_code`, `master_course`.`course_name`, `master_course`.`language`, `courses_transaction`.`class_code`, `courses_transaction`.`class_type`, `courses_transaction`.`class_icon`, `courses_transaction`.`session`, `courses_transaction`.`topic`, DATE_FORMAT(`courses_transaction`.`transaction_date`, '%Y-%m-%d') as transaction_date, `courses_transaction`.`transaction_time`, `courses_transaction`.`is_live`, `courses_transaction`.`is_done` FROM ((`master_course` INNER JOIN `courses_transaction` ON `master_course`.`course_code` = `courses_transaction`.`course_code`) INNER JOIN `lecture_transaction` ON `courses_transaction`.`transaction_Id` = `lecture_transaction`.`transaction_id` AND `lecture_transaction`.`lecturer_code` = ?)";
            } else if (username.length === 10) {
                sql1 = "SELECT `courses_transaction`.`transaction_Id`, `master_course`.`course_code`, `master_course`.`course_name`, `master_course`.`language`, `courses_transaction`.`class_code`, `courses_transaction`.`class_type`, `courses_transaction`.`class_icon`, `courses_transaction`.`session`, `courses_transaction`.`topic`, DATE_FORMAT(`courses_transaction`.`transaction_date`, '%Y-%m-%d') as transaction_date, `courses_transaction`.`transaction_time`, `courses_transaction`.`is_live`, `courses_transaction`.`is_done` FROM ((`master_course` INNER JOIN `courses_transaction` ON `master_course`.`course_code` = `courses_transaction`.`course_code`) INNER JOIN `lecture_transaction` ON `courses_transaction`.`transaction_Id` = `lecture_transaction`.`transaction_id` AND `lecture_transaction`.`student_code` = ?)";
            } else {
                response.unauthorized({"error_message": "unauthorized", "error_code": 2}, res);
            }
            if (sql1.length > 0) {
                connection.query(sql1, [username], (error, results) => {
                    if (error) throw error;
                    if (result.length > 0) {
                        response.ok(results, res);
                    } else {
                        response.error({"error_message": "No schedule", "error_code": 4}, res);
                    }
                });
            }
        }
    });
};

exports.profile = (req, res) => {
    let sql = "SELECT `name`, `privilege`, `username`, `department` FROM `master_user` WHERE `tokenid` = ?";
    let tokenId = req.body.token_id;

    connection.query(sql, [tokenId], (err, result) => {
        if (err) throw err;
        if (result.length === 1) {
            response.ok(result[0], res);
        } else if (result.length === 0) {
            response.unauthorized({"error_message": "Unauthorized", "error_code": 2}, res);
        }
    });
};

exports.classDetails = (req, res) => {
    let sql = "SELECT `username` FROM master_user WHERE tokenid = ?";
    let tokenId = req.body.token_id;
    let transactionId = req.body.transaction_id;

    connection.query(sql, [tokenId], (err, result) => {
        if (err) throw err;
        if (result.length === 1) {
            let sql1 = "SELECT `courses_transaction`.`topic`, `courses_transaction`.`session`, `courses_transaction`.`is_live`, `courses_transaction`.`is_done`, `master_course`.`course_name` FROM (`courses_transaction` INNER JOIN `master_course` ON `courses_transaction`.`course_code` = `master_course`.`course_code`) WHERE `courses_transaction`.`transaction_Id` = ?";
            connection.query(sql1, [transactionId], (error, results) => {
                if (error) throw error;
                response.ok(results[0], res);
            });
        } else {
            response.unauthorized({"error_message": "Unauthorized", "error_code": 2}, res);
        }
    });
};

exports.userProfilePic = (req, res) => {
    let sql = "SELECT `user_pic` FROM `master_user` WHERE `tokenid` = ?";
    let tokenId = req.body.token_id;

    connection.query(sql, [tokenId], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            response.unauthorized({"error_message": "Unauthorized", "error_code": 2}, res);
        } else {
            response.jpeg(result[0].user_pic, res);
        }
    })
};

exports.startSession = (req, res) => {
    let sql = "SELECT `username` FROM `master_user` WHERE `tokenid` = ?";
    let tokenId = req.body.token_id;
    let transactionId = req.body.transaction_id;

    connection.query(sql, [tokenId], (err, result) => {
        if (err) throw err;
        if (result.length === 1) {
            if (result[0].username.charAt(0) === 'D') {
                let sql1 = "UPDATE `courses_transaction` SET `is_live` = 1 WHERE `transaction_Id` = ?";
                connection.query(sql1, [transactionId], (error, results) => {
                    if (error) throw error;
                    response.ok({'message': 'ok'}, res);
                });
            } else {
                response.unauthorized({"error_message": "Unauthorized", "error_code": 2}, res);
            }
        } else {
            response.unauthorized({"error_message": "Unauthorized", "error_code": 2}, res);
        }
    });
};

exports.endSession = (req, res) => {
    let sql = "SELECT `username` FROM `master_user` WHERE `tokenid` = ?";
    let tokenId = req.body.token_id;
    let transactionId = req.body.transaction_id;
    let fileString = req.body.file_string;

    connection.query(sql, [tokenId], (err, result) => {
        if (err) throw err;
        if (result.length === 1) {
            if (result[0].username.charAt(0) === 'D') {
                let sql3 = "SELECT * FROM (`master_user` INNER JOIN `lecture_transaction` ON (`master_user`.`username` = `lecture_transaction`.`lecturer_code` AND `lecture_transaction`.`transaction_id` = ?)) WHERE `master_user`.`username` = ?";
                let lecturerCode = result[0].username;
                connection.query(sql3, [transactionId, lecturerCode], (ee, rr) => {
                    if (ee) throw ee;
                    if (rr.length === 1) {
                        let sql1 = "UPDATE `courses_transaction` SET `is_live` = 0, `is_done` = 1 WHERE `transaction_Id` = ?";
                        connection.query(sql1, [transactionId], (error, results) => {
                            if (error) throw error;
                            let sql2 = "SELECT `course_code`, `class_type`, `session`, `topic`, DATE_FORMAT(`transaction_date`, '%Y-%m-%d') as transaction_date FROM `courses_transaction` WHERE `transaction_Id` = ?";
                            connection.query(sql2, [transactionId], (e, r) => {
                                if (e) throw e;
                                const courseCode = r[0].course_code;
                                const classType = r[0].class_type;
                                const session = r[0].session;
                                const topic = r[0].topic;
                                const transactionDate = r[0].transaction_date;
                                const filePath = './' + courseCode + '/' + courseCode + '_' + classType + session + '_' + topic + "_" + transactionDate + "_" + transactionId;

                                const dir = './' + courseCode;
                                if (!fs.existsSync(dir)) {
                                    fs.mkdirSync(dir);
                                }

                                fs.writeFile(filePath, fileString, function(e1) {
                                    if (e1) throw e1;
                                    response.ok({'message': 'ok'}, res);
                                });
                            });
                        });
                    } else {
                        response.unauthorized({"error_message": "Unauthorized", "error_code": 3}, res);
                    }
                });
            } else {
                response.unauthorized({"error_message": "Unauthorized", "error_code": 2}, res);
            }
        } else {
            response.unauthorized({"error_message": "Unauthorized", "error_code": 1}, res);
        }
    });
};

exports.apiToken = (req, res) => {
    let sql = "SELECT `username` FROM `master_user` WHERE `tokenid` = ?";
    let tokenId = req.body.token_id;
    let transactionId = req.body.transaction_id;

    connection.query(sql, [tokenId], (err, result) => {
        if (err) throw err;
        if (result.length === 1) {
            if (result[0].username.length === 5 && result[0].username.charAt(0) === 'D') {
                let sql1 = "SELECT * FROM (`master_user` INNER JOIN `lecture_transaction` ON (`master_user`.`username` = `lecture_transaction`.`lecturer_code` AND `lecture_transaction`.`transaction_id` = ?)) WHERE `master_user`.`username` = ?";
                let lecturerCode = result[0].username;
                connection.query(sql1, [transactionId, lecturerCode], (error, results) => {
                    if (error) throw error;
                    if (results.length === 1) {
                        const data = require('./token.json');
                        response.ok(data, res);
                    } else {
                        response.unauthorized({"error_message": "Unauthorized", "error_code": 3}, res);
                    }
                });
            } else {
                response.unauthorized({"error_message": "Unauthorized", "error_code": 2}, res);
            }
        } else {
            response.unauthorized({"error_message": "Unauthorized", "error_code": 1}, res);
        }
    });
};