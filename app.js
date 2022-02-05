const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
const { timeTable, attendanceCodes } = require('./time_table');

require('dotenv').config();

let cronTask;

async function sendMessage(currentHour) {
  try {
    const date = new Date();
    const hour = date.getHours();
    const day = date.getDay();

    if (timeTable[day].size != 0) {
      const subjectCode = timeTable[day][hour.toString()];
      if (attendanceCodes.includes(subjectCode)) {
        const text = `${subjectCode} at ${hour}:00`;
        const response = await axios.get(`https://api.telegram.org/bot${process.env.BOT_API_KEY}/sendMessage?chat_id=${process.env.CHAT_ID}&text=${text}`);
        console.log(response.data);
      }
    }

  } catch (error) {
    console.error(error);
  }
};

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/startServer', (req, res) => {
  var cron = require('node-cron');

  res.send('Done!');

  cronTask = cron.schedule('0 * * * * *', () => {
    console.log('running every 0th second');
    let date = new Date();
    sendMessage(date.getHours().toString());
  });

  cronTask.start();
});

app.get('/stopServer', (req, res) => {
  cronTask.stop();
  res.send('Done!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
});
