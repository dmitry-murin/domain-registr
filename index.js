const express = require('express');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('body-parser-xml')(bodyParser);

const config = require('./config');
const errors = require('./utils/errors');


const dbcontext = require('./context/db')(Sequelize, config);

const userService = require('./services/user')(dbcontext.user, errors);
const authService = require('./services/auth')(dbcontext.user, errors);
const domainService = require('./services/domain')(dbcontext.domain,dbcontext.user, errors, config);

const apiController = require('./controllers/api')(userService, authService, domainService);


const auth=require('./utils/auth')(errors);

const app = express();

app.use(express.static('public'));
app.use(cookieParser("pskpdm"));
app.use(bodyParser.json());
app.use(bodyParser.xml({
  limit: '1MB',   // Reject payload bigger than 1 MB 
  xmlParseOptions: {
    normalize: true,     // Trim whitespace inside text nodes 
    normalizeTags: true, // Transform tags to lowercase 
    explicitArray: false // Only put nodes in array if >1 
  }
}));
app.use(bodyParser.urlencoded({extended: true}));

//app.use('/api',auth);
app.use('/api', apiController);

dbcontext.sequelize.sync()
    .then(() => {
        app.listen(process.env.PORT || 5000, function(){
          console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
        });
    })
    .catch((err) => console.log(err));