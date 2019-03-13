const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://abhi0515:abhinav05@votecluster-ew4za.mongodb.net/dslrpoll?retryWrites=true')
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));


const poll = require('./routes/poll');

// Set public folder
app.use(express.static(path.join(__dirname,'public')));

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// Enable CORS
app.use(cors());


app.use('/poll', poll);
const port = 3000;

//Start server 
app.listen(port, () => console.log(`Server started on port ${port}`));