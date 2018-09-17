/**
 * @file contains global data/methods used and updated throughout
 * the Vue application
 * @author: dbrown
 */

import axios from 'axios';

const ServerStore = {
  data: {
    serverLocation: 'http://localhost:3000',
    alertedPeople: [],
    muteEmail: null,
    logThreshold: {
      info: null,
      warn: null,
      error: null
    }
  },
  methods: {

    // REST calls to Alerted People API

    /**
     * @returns promise for array of alerted people
     */
    getAlerted () {
      return axios.get(`${ServerStore.data.serverLocation}/api/alertedPeople`)
    },
    /**
     * Adds new person to array of alerted people 
     * @returns promise to the array
     * @param {object} person
     */
    addAlerted (person) {
      return axios.post(`${ServerStore.data.serverLocation}/api/alertedPeople`, person)
    },
    /**
     * Removes person from array of alerted people 
     * @returns promise to the array
     * @param {object} person
     */
    removeAlerted (person) {
      return axios.delete(`${ServerStore.data.serverLocation}/api/alertedPeople/${person.id}`);
    },

    // REST calls to Threshold API

    /**
     * @returns promise to error Threshold
     */
    getError () {
      return axios.get(`${ServerStore.data.serverLocation}/api/logThreshold/error`);
    },

    /**
     * Updates error log threshold
     * @returns a promise to the value
     * @param {number} value
     */
    setError (value) {
      return axios.post(`${ServerStore.data.serverLocation}/api/logThreshold/error`, {"error": value});
    },

    /**
     * @returns promise to warn Threshold
     */
    getWarn () {
      return axios.get(`${ServerStore.data.serverLocation}/api/logThreshold/warn`);
    },

    /**
     * Updates warn log threshold
     * @returns a promise to the value
     * @param {number} value
     */
    setWarn (value) {
      return axios.post(`${ServerStore.data.serverLocation}/api/logThreshold/warn`, {"warn": value});
    },

    /**
     * @returns promise to info Threshold
     */
    getInfo () {
      return axios.get(`${ServerStore.data.serverLocation}/api/logThreshold/info`);
    },

    /**
     * Updates info log threshold
     * @returns a promise to the value
     * @param {number} value
     */
    setInfo (value) {
      return axios.post(`${ServerStore.data.serverLocation}/api/logThreshold/info`, {'info': value});
    },

    // REST Calls for email Alerts

    /**
     * @returns promise to the 'emailMuted' property
     */
    getMuted () {
      return axios.get(`${ServerStore.data.serverLocation}/api/emailMuted`);
    },

    /**
     * Updates the status of 'emailMuted'
     * @returns promise to the 'emailMuted' property
     * @param {boolean} value 
     */
    setMuted (value) {
      return axios.post(`${ServerStore.data.serverLocation}/api/emailMuted`, value);
    },

    /**
     * RPC Call to send email alert for logs over threshold
     * 
     * @param {string} type (one of 'info', 'warn', or 'error')
     */
    sendAlert (type) {
      return axios.post(`${ServerStore.data.serverLocation}/sendAlert`, { 'type': type });
    }

  }
}

export default ServerStore;