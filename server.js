const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cron = require('node-cron');
const cronTask = require('./utils/cronTask');

process.on('uncaughtException', err => {
  console.log(`uncaughtException error name:  ${err.name} and error message: ${err.message}`);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.4xaod.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true
  })
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

/**run cron job in every 5 minutes bcz we need to send email every student before 1 hour of exam/assignment deadline */
//**so we must be contionusly checking about the deadline time*/
cron.schedule('*/5 * * * *', async () => {
  console.log("scheduler running");
  await cronTask();

});

process.on('unhandledRejection', err => {
  console.log(`unhandledRejection error name: ${err.name} and error message: ${err.message}`);
  server.close(() => {
    process.exit(1)
  });
});
