var mongoose = require('mongoose');
var User = mongoose.model('User');
var fs = require('fs');

exports.current_user = function (req, res, next) {
    next();
};

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

const users = [
    // You know password for the user.
    {name: 'user', password: 'pwd'},
    // You don't know password for the admin.
    {name: 'admin', password: Math.random().toString(32), canDelete: true},
];

let messages = [];
let lastId = 1;

function findUser(auth) {
    return users.find((u) =>
        u.name === auth.name &&
        u.password === auth.password);
}

///////////////////////////////////////////////////////////////////////////////

function sanitize(string) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return string.replace(reg, (match) => (map[match]));
}

exports.index = function (req, res, next) {
    console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    var flag;

    fs.readFile('./flag', function (err, data) {
        if (err) {
            throw err;
        }
        flag = data;
    });

 
    User.find({username: sanitize(username), password: sanitize(password)}, function (err, users) {
        if (users.length > 0) {
            return res.render('index', {
                title: 'Admin Access Granted',
                granted: true,
                flag: flag,
            });
        } else {
            return res.render('index', {
                title: 'have you tried pa55w0rd? ',
                granted: false,
            });
        }
    });
};


