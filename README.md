<a href="https://imgbb.com/"><img src="https://image.ibb.co/k2ikd9/Logo_Makr_5l_W9_Nf.png" border="0" width="60" align="left" style="padding-right: 5px"></a>
# Log Dashboard

A live dashboard to visualize Wildfly log files. Project not created by or officially affliated with [Widlfly](http://www.wildfly.org/).

## Features
- Live chart of logs per minute specified by type (`INFO`, `WARN`, and `ERROR`) that can be formatted to views of the past 30 minutes, hour, 2 hours, and 4 hours
- Live feed of log file contents
- Email alerts to warn of log types going over configurable thresholds

## Setup
In order to run this project, you must have [Node](https://nodejs.org/en/) installed on your computer. The code will not run until the setup steps have been completed.
1. clone the repository
2. `cd` into the **client** and **server** directories and run `npm install` in both of them to install all node dependencies
3. in *app.js*, set the `logFile` variable to the location of your Wildfly Debug Log file
4. Setup a Google account to work with the Gmail API:
    1. Set the `distributorEmail` variable in *mailer.js* (in the **server/tools** directory) to the email you wish to send automated emails from
    2. Completing step 1 at this [link](https://developers.google.com/gmail/api/quickstart/js) will give you a *credentials.json* file that should be placed in the **server/tools/credentials** directory
    3. Upon first running the backend of the application (explained below), you will be prompted to go to a link and receive a token. Follow these steps and the program will automatically store it for future sessions (in the **server/tools/credentials** directory).

## Running the Application
- For local usage, execute the backend by running `node app.js` in the **server** directory and execute the frontend by running `npm run serve` in the frontend
  - The frontend is currently set to run on **localhost:8080** and the backend to run on **localhost:3000**. Feel free to change this if you like.
- To build, I recommend utilizing the [Vue-Cli](https://cli.vuejs.org/guide/). One way is to run `npm run build` to create a **dist** folder.
- Set up email alerts and log thresholds through the Settings dropdown in the top right corner of the application

## Important Notes
This application was built without accessing any databases. All data maintained across sessions is stored inside *settings.json* in the **server** directory (aside from Google account credentials stored within the **credentials** directory).

Logs are not stored on the application across sessions. The goal of this application is for visualization, not storage (as the log file itself serves as storage). Therefore upon loading up the app the user is met with a blank chart and feed, which then begin to fill as the log file populates with new information.

## How it was Built

### Frontend
- [Vue.js](https://vuejs.org/) framework for the UI
- [BootstrapVue](https://bootstrap-vue.js.org/) for the CSS
- [ChartJS](https://www.chartjs.org/) for the live chart
- [Axios](https://www.npmjs.com/package/axios) to make REST and RPC calls to the backend
- [Socket.io](https://socket.io/) to receive server-driven events

### Backend
- [Node](https://nodejs.org/en/) Javascript runtime
- [Express](https://expressjs.com/) for the web server
- [Node Tail](https://github.com/lucagrulla/node-tail) for line-by-line updates from the log file
- [Google API Node Client](https://github.com/google/google-api-nodejs-client) for automated emails
- [Socket.io](https://socket.io/) to send server-driven events

## Author
Dustin Brown (developed at a previous time and transferred to Github)

## Screenshots
Dashboard with sample data (30 min view):
[![log_dashboard_screenshot1.png](https://i.postimg.cc/Qxyr2qt7/log_dashboard_screenshot1.png)

Dashboard with sample data (hour view):
[![log_dashboard_screenshot2.png](https://i.postimg.cc/9Fz6YqpQ/log_dashboard_screenshot2.png)

Email alert modal (accessed through "Settings" button on top right):
[![log_dashboard_screenshot3.png](https://i.postimg.cc/nLKghKH0/log_dashboard_screenshot3.png)

Log threshold modal (accessed through "Settings" button on top right):
[![log_dashboard_screenshot4.png](https://i.postimg.cc/rssPjv5P/log_dashboard_screenshot4.png)