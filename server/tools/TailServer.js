/**
 * @file manages updates to the debug file
 * @author: dbrown
 */

const fs = require('fs');
const _ = require('lodash');

// data validation setup using Joi
const Joi = require('joi');

/**
 *  - emits a 'new line' event that will update the Live Feed on front end
 *     application
 *  - emits a 'new log' event only if the line passes data validation, meaning
 *     the log data will be sent to the front end application to be added to 
 *     the Log Chart
 * @param {string} message
 * @param {websocket} io
 */
function update(message, io) {
  io.emit('new line', message);

  data = message.split(' ')
  const logMessage = {
      datetime: data[0] + ' ' + _.split(data[1], ',', 1).toString(),
      logType: data[2],
      message: _.drop(data, 3).join(' '),
      weight: 1
  };
  
  const { error } = validateLog(logMessage);
  if (error) {
    console.log(`Not added to data. ${error}`);
  }
  else {
    io.emit('new log', logMessage);
  }
}

/**
 * @param {object} log 
 * @returns a Joi object that has validated the given input
 */
function validateLog(log) {
  const schema = {
    datetime: Joi.string().regex(/[0-9]{4}[-][0-9]{2}[-][0-9]{2}\s(\d){2}:(\d){2}:(\d){2}/),
    logType: Joi.string().valid(['INFO', 'WARN', 'ERROR']).required(),
    message: Joi.string().required(),
    weight: Joi.number().integer().required()
  };

  return Joi.validate(log, schema);
}

module.exports.update = update;