const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const cors = require('cors');
const rootDir = require('./util/path');

const dataRoute = require('./routes/test');

const sequelize = require('./util/database');

const db = require('./model/field');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cors());

app.use('/user', dataRoute);


sequelize.sync()
    .then(() => {
        console.log("database synced successfully");
        app.listen(3000, () => {
            console.log("server is up and running on port 3000");
            app.get('/', (req, res) => {
                res.sendFile(path.join(__dirname, "views", "index.html"));
            })
        });
    })
    .catch(err => console.log(err));

