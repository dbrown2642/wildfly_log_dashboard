const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const Promise = require('bluebird');
const jsonfile = Promise.promisifyAll(require('jsonfile'));
const settingsFile = `${__dirname}/../settings.json`;

// Email used for Gmail alerts
const distributorEmail = '';

const SCOPES = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send'
];

const TOKEN_PATH = `${__dirname}/credentials/token.json`;

const credentialslocation = `${__dirname}/credentials/credentials.json`;

/**
 * Initializes the mailer and ensures it is prepared for sending emails
 */
function init() {
  let credentials;
  fs.readFile(credentialslocation, (err, content) => {
    if (err) return console.log(`Error loading client secret file: ${err}`);
    // Authorize a client with the loaded credentials, then call the
    // Gmail API.
    credentials = JSON.parse(content)

    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) {
        const authUrl = oAuth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: SCOPES,
        });
        console.log(`Authorize this app by visiting this url: ${authUrl}`);
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
          rl.close();
          oAuth2Client.getToken(code, (err, token) => {
            if (err) return err;
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
              if (err) return console.error(err);
              console.log(`Token stored to ${TOKEN_PATH}`);
              return true;
            });
          });
        });
      }
      console.log('Email alerts configured.')
      return true;
   });
  });
}

/**
 * Sends alert using the sendMessage method and OAuth authentication
 * @param {string} message 
 */
function sendAlert(message) {
  fs.readFile(credentialslocation, (err, content) => {
    if (err) return console.log(`Error loading client secret file: ${err}`);
    // Authorize a client with the loaded credentials, then call the
    // Gmail API.
    authorize(JSON.parse(content), sendMessage, message);
  });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 * @param {string} message The message to be sent in the email
 */
function authorize(credentials, callback, message) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, message);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log(`Authorize this app by visiting this url: ${authUrl}`);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return callback(err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log(`Token stored to ${TOKEN_PATH}`);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * @returns encoded message for gmail to send
 * 
 * @param {array} to 
 * @param {string} from 
 * @param {string} subject 
 * @param {string} message 
 */
function makeBody(to, from, subject, message) {
  let recipients = '';
  for (let email of to) {
    recipients += `${email}, `
  }
  const messageParts = [
    `From: ${from}`,
    `To: ${recipients}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${subject}`,
    '',
    message
  ];
  const fullMessage = messageParts.join('\n');

  const encodedMessage = Buffer.from(fullMessage)
  .toString('base64')
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=+$/, '');

  return encodedMessage;
}

/**
 * Sends encoded message to people in settings.json
 * @param {google.auth.OAuth2} auth 
 * @param {string} message 
 */
function sendMessage(auth, message) {
  let recipients = []
  jsonfile.readFileAsync(settingsFile)
  .then( (settings) => {
    recipients = settings.people.map( person => person.email )

    const gmail = google.gmail('v1');
    const raw = makeBody(recipients,
                         distributorEmail, 
                         'Wildfly Log Dashboard Alert', 
                         message);
    gmail.users.messages.send({
      auth: auth,
      userId: 'me',
      resource: {
          raw: raw
      }
    }, (err, response) => {
      if (err) console.log(err);
      else console.log('Message Sent!');
    });
  });
}

module.exports = {
  sendAlert,
  init
}
