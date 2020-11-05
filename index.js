const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('errorhandler');



//routes
const user = require('./routes/users')
const team = require('./routes/team')
const friend = require('./routes/friend')
const chat = require('./routes/chat')
//admin routes
const userEdit = require('./routes/userEdit')
const teamEdit = require('./routes/teamEdit')
const lobby = require('./routes/lobby')
//Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';
//Initiate our app
const app = express();
//Configure our app
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(session({ secret: 'mTripToshiDesu', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));
if(!isProduction) {
  app.use(errorHandler());
}
//routes
app.use(user)
app.use(friend)
app.use(team)
app.use(chat)
//admin routes
app.use(userEdit)
app.use(teamEdit)
app.use(lobby)
//Error handlers & middlewares
if(!isProduction) {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});
app.listen(8000, () => console.log('Server running on http://localhost:8000/'));