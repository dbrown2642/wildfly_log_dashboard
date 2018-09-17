/**
 * @file manages the backend server and its API, port currently set to 3000
 * @author: dbrown
 */

// imports for tailing log file
const mailer = require('./tools/mailer')
const tailServer = require('./tools/TailServer');
const Tail = require('tail').Tail;

// imports for running server
const Promise = require('bluebird');
const jsonfile = Promise.promisifyAll(require('jsonfile'));
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json());

// location of log file
const logFile = __dirname + '/collection/debug.log'
// confirmation for gmail token
const mailSet = mailer.init();

// server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`listening on port ${port}`);
  
  const tail = new Tail(logFile);
  tail.on("line", (message) => {
    tailServer.update(message, io);
  });

  tail.on("error", (error) => {
    console.log('ERROR: ', error);
  });
});

// web socket setup
const io = require('socket.io')(server);
io.on('connection', (socket) => {
  if (mailSet) {
    console.log(`Connected to socket ${socket.id}`);
  }
});

////////////////////////////////////
///////// API Endpoints
////////////////////////////////////

const settingsFile = __dirname + '/settings.json';

// Alerted People
app.get('/api/alertedPeople', (req, res) => {
  console.log('[GET] responding with api/alertedPeople');
  jsonfile.readFileAsync(settingsFile).then( (settings) => {
    res.send(settings.people);
  })
});

app.post('/api/alertedPeople', (req, res) => {
  console.log(`[POST] updating api/alertedPeople with ${req.body.name}`);
  jsonfile.readFileAsync(settingsFile)
  .then( (settings) => {
    settings.people.push(req.body);
    jsonfile.writeFile(settingsFile, settings, (err) => {
      if (err) console.log(err);
    });
    res.send(settings.people);
  });
});

app.delete('/api/alertedPeople/:id', (req, res) => {
  console.log(`[DELETE] removing ${req.body} from api/alertedPeople`);
  jsonfile.readFileAsync(settingsFile)
  .then( (settings) => {
    const person = settings.people.find(p => p.id === parseInt(req.params.id));
    const index = settings.people.indexOf(person);
    settings.people.splice(index, 1);
    jsonfile.writeFile(settingsFile, settings, (err) => {
      if (err) console.log(err);
    });
    res.send(settings.people);
  })
})

// Log Threshold (error)
app.get('/api/logThreshold/error', (req, res) => {
  console.log('[GET] responding with api/logThreshold/error');
  jsonfile.readFileAsync(settingsFile)
  .then( (settings) => {
    res.send({ "error": settings.logThreshold.error });
  })
});

app.post('/api/logThreshold/error', (req, res) => {
  console.log(`[POST] updating api/logThreshold/error with ${req.body.error}`);
  jsonfile.readFileAsync(settingsFile)
  .then( (settings) => {
    settings.logThreshold.error =  parseInt(req.body.error);
    jsonfile.writeFile(settingsFile, settings, (err) => {
      if (err) console.log(err);
    });
    res.send({ "error": settings.logThreshold.error });
  });
});

// Log Threshold (warn)
app.get('/api/logThreshold/warn', (req, res) => {
  console.log('[GET] responding with api/logThreshold/warn');
  jsonfile.readFileAsync(settingsFile)
  .then( (settings) => {
    res.send({ "warn": settings.logThreshold.warn });
  })
});

app.post('/api/logThreshold/warn', (req, res) => {
  console.log(`[POST] updating api/logThreshold/warn with ${req.body.warn}`);
  jsonfile.readFileAsync(settingsFile)
  .then( (settings) => {
    settings.logThreshold.warn =  parseInt(req.body.warn);
    jsonfile.writeFile(settingsFile, settings, (err) => {
      if (err) console.log(err);
    });
    res.send({ "warn": settings.logThreshold.warn });
  });
});

// Log Threshold (info)
app.get('/api/logThreshold/info', (req, res) => {
  console.log('[GET] responding with api/logThreshold/info');
  jsonfile.readFileAsync(settingsFile)
  .then( (settings) => {
    res.send({ "info": settings.logThreshold.info });
  })
});

app.post('/api/logThreshold/info', (req, res) => {
  console.log(`[POST] updating api/logThreshold/info with ${req.body.info}`);
  jsonfile.readFileAsync(settingsFile)
  .then( (settings) => {
    settings.logThreshold.info =  parseInt(req.body.info);
    jsonfile.writeFile(settingsFile, settings, (err) => {
      if (err) console.log(err);
    });
    res.send({ "info": settings.logThreshold.info });
  });
});

// Email Muted
app.get('/api/emailMuted', (req, res) => {
  console.log('[GET] responding with api/emailMuted');
  jsonfile.readFileAsync(settingsFile).then( (settings) => {
    res.send(settings.emailMuted);
  })
});

app.post('/api/emailMuted', (req, res) => {
  console.log(`[POST] updating api/emailMuted with ${req.body}`);
  jsonfile.readFileAsync(settingsFile)
  .then( (settings) => {
    settings.emailMuted = req.body.muted;
    jsonfile.writeFile(settingsFile, settings, (err) => {
      if (err) console.log(err);
    });
    res.send(settings.emailMuted);
  });
});

// send email
app.post('/sendAlert', (req, res) => {
  const type = req.body.type;
  console.log(`[POST] sending email alert for ${type}`);
  jsonfile.readFileAsync(settingsFile)
  .then( (settings) => {
    mailer.sendAlert(`This is an automated alert from ESM Log Dashboard.\n
                      <b>The amount of ESM ${type} logs has exceded ${settings.logThreshold[type]}.<b>`)
    res.send('Sent email');
  });
});
