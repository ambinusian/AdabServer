'use strict';

exports.ok = function(values, res) {
  var data = {
      'status': 200,
      'response': values
  };
  res.json(data);
  res.end();
};

exports.notFound = function(res) {
    var data = {
        'status': 404,
        'error': "Resource not found"
    };
    res.status(404).json(data);
    res.end();
};

exports.error = function(reason, res) {
    var data = {
        'status': 400,
        'reason': reason
    };
    res.status(400).json(data);
    res.end();
};

exports.unauthorized = function(reason, res) {
    var data = {
        'status': 403,
        'reason': reason
    };
    res.status(403).json(data);
    res.end();
};

exports.jpeg = function(data, res) {
    res.set('Content-Type', 'image/jpeg').send(data);
    res.end();
};