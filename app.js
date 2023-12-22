const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');

const app = express();
const cors = require('cors');
const rootDir = require('./util/path');

const dataRoute = require('./routes/test');

const db = require('./model/field');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cors());
app.use(express.static(path.join(__dirname, 'views')));

//app.use('/user', dataRoute);


app.use('/tables', async (req, res, next) => {
    try {
      // Fetch table names from the database
      const [tables] = await sequelize.query('SHOW TABLES');
      const tableNames = tables.map(table => ({ table_name: table[`Tables_in_${sequelize.config.database}`] }));
      res.json(tableNames);
    } catch (error) {
      console.error('Error fetching tables:', error);
      res.status(500).json({ error: 'Error fetching tables' });
    }
});
  
app.use('/createTable', async (req, res, next) => {
    const { tableName, fields } = req.body;
  
    try {
      // Add an "id" column as the primary key
      //fields.unshift({ name: 'id', type: 'INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY'});

      // Create the table with the specified fields
      const createTableQuery = `CREATE TABLE ${tableName} (${fields.map(field => `${field.name} ${field.type}`).join(', ')})`;
      
      console.log('Generated SQL Query:', createTableQuery);

      await sequelize.query(createTableQuery);
      
      console.log(`Table ${tableName} created successfully`);

      //await sequelize.create({ tableName });
      res.json({ success: true });
    } catch (error) {
      console.error('Error creating table:', error.message);
      res.status(500).json({ error: 'Error creating table' });
    }
});
  
app.use(`/tableData/:tableName`, async (req, res, next) => {
    const { tableName } = req.params;
    console.log(tableName);
    try {
      // Fetch data from the specified table
      console.log('geeting table data')
      const [tableData] = await sequelize.query(`SELECT * FROM ${tableName}`);
      console.log(tableData)
      res.json(tableData);
    } catch (error) {
      console.error('Error fetching table data:', error);
      res.status(500).json({ error: 'Error fetching table data' });
    }
});



sequelize.sync()
    .then(() => {
        console.log("database synced successfully");
        app.listen(3000, () => {
            console.log("server is up and running on port 3000");
            app.get('/', (req, res) => {
                res.sendFile(path.join(__dirname, "views", "user.html"));
            })
        });
    })
    .catch(err => console.log(err));

