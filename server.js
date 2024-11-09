const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 9991;
const DATA_FILE = path.join(__dirname, 'rooms.json');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// Function to read data from JSON file
function readData() {
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data || '[]');
}

// Function to write data to JSON file
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Route to show the HTML form
app.get('/', (req, res) => {
  res.render('index');
});

// API to get all room data
app.get('/rooms', (req, res) => {
  const rooms = readData();
  res.json(rooms);
});

// Route to add a new room
app.post('/add-room', (req, res) => {
  const rooms = readData();
  const newRoom = {
    number: req.body.number,
    area: req.body.area,
    price: req.body.price,
    description: req.body.description
  };
  rooms.push(newRoom);
  writeData(rooms);
  res.redirect('/');
});

// Route to delete a room by its number
app.post('/delete-room/:number', (req, res) => {
  const roomNumber = req.params.number;
  let rooms = readData();
  rooms = rooms.filter(room => room.number !== roomNumber);
  writeData(rooms);
  res.redirect('/');
});

// Server listening
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
