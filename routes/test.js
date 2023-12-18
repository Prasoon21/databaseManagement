const express = require('express');
const path = require('path');

const route = express.Router();

const rootDir = require('../util/path');

const record = require('../controller/record');

route.get('/', record.getUser);

route.post('/', record.postUser);

route.delete('/:id', record.deleteUser);

module.exports = route;