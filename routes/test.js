const express = require('express');
const path = require('path');

const route = express.Router();

const rootDir = require('../util/path');

const record = require('../controller/record');

route.get('/tables', record.getUser);

route.post('/createTable', record.postUser);

route.get(`/tableData/:tableName`, record.deleteUser);

module.exports = route;