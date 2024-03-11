import express, { json } from 'express';
import { getCostForWeek, getTaskCompletionForWeek, getUserTaskForWeek } from './generateResponses.js';
// import { getCostForWeek, getUserTaskForWeek, getTaskCompletionForWeek } from 'discover';

const app = express();
const PORT = 3000;
const PREFIX = 'xexchange-growth';

app.use(json());

// Endpoint 1: GET request with "week" query parameter
app.get(`/${PREFIX}/tasks-cost`, async (req, res) => {
    const week = req.query.week;
    const response = await getCostForWeek(week)

    res.json(response);
});

// Endpoint 2: GET request with "address" and "week" query parameters
app.get(`/${PREFIX}/task`, async (req, res) => {
  const { address, week } = req.query; 
  const response = await getUserTaskForWeek(address, week)

  res.json(response);
});

// Endpoint 3: GET request with "address" and "week" query parameters
app.get(`/${PREFIX}/task-completion`, async (req, res) => {
  const { address, week } = req.query; 
  const response = await getTaskCompletionForWeek(address, week);

  res.json(response);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
