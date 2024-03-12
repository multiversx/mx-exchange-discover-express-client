import express, { json } from 'express';
import { getCompletionPayload, serializeAndSign, signPayload } from './helpers.js';

const PORT = 3000;
const PREFIX = 'xexchange-growth';
const PROJECT_ID = 1;

const getCostForWeek = async (week) => {
  // Here you can add any logic you want based on the week parameter
  // Cost information can be stored in a static file or pulled from the database

  const money = 2;
  const time = 5; 

  return {
    money: money,
    time: time,
    isFinal: true,
    week: week,
    version: 2,
  }
};

const getUserTaskForWeek = async (address, week) => {
  // Here you can add any logic you want based on the address and week parameters
  // User tasks can be stored in a static file or pulled from the database
  
  const url = 'https://test.com'
  const description = 'Task description goes here'
  
  return {
    url: url,
    description: description,
    address: address,
    isFinal: true,
    week: week,
    version: 2,
  }
};

const getTaskCompletionForWeek = async (address, week) => {
  // Here you can add any logic you want based on the address and week parameters
  // Determine whether the user has completed the task or not

  const isCompleted = true;
  const completionNote = '<TASK_IDENTIFIER>'

  const completion = getCompletionPayload(PROJECT_ID, address, week, isCompleted, completionNote);
  const signature = await signPayload(completion, 'hex');
  return {
    completion: completion,
    address: address,
    completionSignature: signature,
    version: 2,
    week: week,
  }
};

(async () => {
  const { config } = await import('dotenv');
  config();

  const app = express();

  app.use(json());

  // /tasks-cost endpoint: GET request with "week" query parameter
  app.get(`/${PREFIX}/tasks-cost`, async (req, res) => {
      const week = parseInt(req.query.week);
      const response = await getCostForWeek(week);

      const signedResponse = await serializeAndSign(response);
      res.json(signedResponse);
  });

  // /task endpoint: GET request with "address" and "week" query parameters
  app.get(`/${PREFIX}/task`, async (req, res) => {
    const address = req.query.address;
    const week = parseInt(req.query.week);
    const response = await getUserTaskForWeek(address, week);

    const signedResponse = await serializeAndSign(response);
    res.json(signedResponse);
  });

  // /task-completion endpoint: GET request with "address" and "week" query parameters
  app.get(`/${PREFIX}/task-completion`, async (req, res) => {
    const address = req.query.address;
    const week = parseInt(req.query.week);
    const response = await getTaskCompletionForWeek(address, week);

    const signedResponse = await serializeAndSign(response)
    res.json(signedResponse);
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})();


