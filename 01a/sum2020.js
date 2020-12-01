"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
fs_1.readFile('01a/input.txt', 'utf8', function (err, data) {
    if (err) {
        console.error(err);
        return;
    }
    console.log(data);
});
