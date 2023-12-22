document.addEventListener('DOMContentLoaded', async function() {
    await fetchTables();
});

let activeTable = null;

async function fetchTables() {
    try{
        const response = await axios.get('http://localhost:3000/tables');
        const tables = response.data;
        //const br = document.createElement('br');

        const tablesContainer = document.getElementById('tablesContainer');
        tablesContainer.innerHTML = '';
        
        tables.forEach(table => {
            
            const tableLink = document.createElement('a');
            tableLink.href = '#';
            tableLink.textContent = table.table_name;
            tableLink.style.display = 'block';
            tableLink.onclick = async () => {
                await displayEditableTableData(table.table_name);
                //setActiveTable(table.table_name); 
            }
            tablesContainer.appendChild(tableLink);
            
            
        });
        
    } catch(error) {
        console.error('Error fetching table:', error);
        }
}

async function openCreateTableModal() {
    const modal = document.getElementById('createTableModal');
    modal.style.display = 'contents';
}

function closeCreateTableModal() {
    const modal = document.getElementById('createTableModal');
    modal.style.display = 'none';
}

function addTableField() {
    const fieldsContainer = document.getElementById('fieldsContainer');

    const fieldInput = document.createElement('input');
    fieldInput.type = 'text';
    fieldInput.placeholder = 'Field Name';
    fieldsContainer.appendChild(fieldInput);

    const fieldTypeInput = document.createElement('input');
    fieldTypeInput.type = 'text';
    fieldTypeInput.placeholder = 'Field Type';
    fieldsContainer.appendChild(fieldTypeInput);
}

async function createTable() {
    console.log('Create Table button clicked');
    const tableName = document.getElementById('tableName').value;
    const fieldsContainer = document.getElementById('fieldsContainer');
    const fieldInputs = fieldsContainer.getElementsByTagName('input');

    const fields = [{ name: 'id', type: 'INTEGER AUTO_INCREMENT PRIMARY KEY' }];
    for (let i = 0; i < fieldInputs.length; i += 2) {
        const fieldName = fieldInputs[i].value.trim();
        const fieldType = fieldInputs[i + 1].value.trim();
        if (fieldName && fieldType) {
        fields.push({ name: fieldName, type: fieldType });
        }
    }

    if (tableName && fields.length > 0) {
        try {
        // Use Axios for the HTTP request
        const response = await axios.post('http://localhost:3000/createTable', { tableName, fields });
        const result = response.data;

        if (result.success) {
            closeCreateTableModal();
            fetchTables();
        } else {
            alert('Error creating table');
            }
        } catch (error) {
            console.error('Error creating table:', error);
            alert('Error creating table');
            }
    } else {
        alert('Table Name and at least one field are required');
    }
}

async function displayTableData(tableName) {
    try {
        console.log('Fetching data for table:', tableName);
        // Use Axios for the HTTP request
        const response = await axios.get(`http://localhost:3000/tableData/${tableName}`);
        const tableData = response.data;

        const tableDataContainer = document.getElementById('tableDataContainer');
        tableDataContainer.innerHTML = '';

        // Display table data in the container
        // You can customize this part based on how you want to present the data
        tableData.forEach(row => {
            const rowElement = document.createElement('div');
            rowElement.textContent = JSON.stringify(row);
            tableDataContainer.appendChild(rowElement);
        });


    } catch (error) {
        console.error('Error fetching table data:', error);
    }
}

async function displayEditableTableData(tableName){
    try{
        console.log('Fetching data for  table:', tableName);

        const response = await axios.get(`http://localhost:3000/tableData/${tableName}`);
        const tableData = response.data;

        const tableContainer = document.getElementById('tableContainer');
        tableContainer.innerHTML = '';

        const tableElement = document.createElement('table');
        tableElement.classList.add('table');

        const headerRow = document.createElement('tr');
        Object.keys(tableData[0]).forEach(columnName => {
            const headerCell = document.createElement('th');
            headerCell.textContent = columnName;
            headerRow.appendChild(headerCell);
        });
        tableElement.appendChild(headerRow);

        // Create table rows
        tableData.forEach(row => {
            const dataRow = document.createElement('tr');
            Object.values(row).forEach(value => {
                const dataCell = document.createElement('td');
                dataCell.textContent = value;
                dataRow.appendChild(dataCell);
        });

        // Add buttons for editing and deleting each row
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => editTableRow(tableName, row);
        dataRow.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteTableRow(tableName, row);
        dataRow.appendChild(deleteButton);

        tableElement.appendChild(dataRow);
        });

        tableContainer.appendChild(tableElement);

        //Add row button

        const addRowButton = document.createElement('button');
        addRowButton.textContent = 'Add Row';
        addRowButton.onclick = () => addTableRow(tableName);
        addRowButton.style.margin = '10px 0 0 20px';
        tableContainer.appendChild(addRowButton);
        } catch (error) {
        console.error('Error fetching table data:', error);
        }
    }

function setActiveTable(tableName) {
    activeTable = tableName;
}

// Function to edit a table row
function editTableRow(tableName, rowData) {
// Implement your logic for editing a table row
console.log('Editing row:', rowData);
}

// Function to delete a table row
async function deleteTableRow(tableName, rowData) {
    try {
        console.log('Deleting row:', rowData);
        // Use Axios for the HTTP request to delete the row
        await axios.delete(`http://localhost:3000/tableData/${tableName}/${rowData.id}`);
        // Refresh the table after deletion
        displayEditableTableData(tableName);
    } catch (error) {
        console.error('Error deleting table row:', error);
        }

}


async function openAddRowModal() {
    const addRowmodal = document.getElementById('addRowModal');
    addRowmodal.style.display = 'contents';

    const tableNameForAddRowInput = document.getElementById('tableNameForAddRow');
    tableNameForAddRowInput.value = tableName;
}

function closeAddRowModal() {
    const addRowModal = document.getElementById('addRowModal');
    addRowModal.style.display = 'none';
}

async function addTableRow() {
    const tableName = document.getElementById('tableNameForAddRow').value;
    const rowData = {};

    try {
        const response = await axios.post(`http://localhost:3000/tableData/${tableName}`, rowData);
        const result = response.data;

        if(result.success) {
            closeAddRowModal();
            displayEditableTableData(tableName);
        } else{
            alert('Error adding row');
        }
    } catch (error) {
        console.error('Error adding row:', error);
        alert('Error adding row');
    }
}