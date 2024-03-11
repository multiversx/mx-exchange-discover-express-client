import { UserSigner } from '@multiversx/sdk-wallet';
import { Address } from '@multiversx/sdk-core';
import { readFileSync } from 'fs';

const COMPLETTION_PREFIX = 'xExchangeGrowthV1TaskCompleted';

const PROJECT_ID = 1;
const PEM_PATH = './signer.pem';

export const getCostForWeek = async (week) => {
  // Here you can add any logic you want based on the week parameter
  // Cost information can be stored in a static file or pulled from the database

  const taskCost = {
    money: 2,
    time: 5,
    isFinal: true,
    week: parseInt(week),
    version: 2,
  }

  const jsonPayload = serializeForSigning(taskCost);
  const signature = await signPayload(jsonPayload);

  taskCost.signature = signature.toString('hex');
  return taskCost;
};

export const getUserTaskForWeek = async (address, week) => {
  // Here you can add any logic you want based on the address and week parameters

  const task = {
    url: 'https://test.com',
    description: '<DESCRIPTION>',
    address: address,
    isFinal: true,
    week: parseInt(week),
    version: 2,
  }
  
  const jsonPayload = serializeForSigning(task);
  const signature = await signPayload(jsonPayload);

  task.signature = signature.toString('hex');
  return task;
};

export const getTaskCompletionForWeek = async (address, week) => {
  let completion = '';
  let completionSignature = '';

  const taskDetails = getTaskDetails(address, week)
  
  if (taskDetails.isCompleted) {
    // We pass the task identifier as a note for the completion payload
    completion = getCompletionPayload(address, week, taskDetails.identifier);
    const completionSigBuffer = await signPayload(completion, 'hex');

    completionSignature = completionSigBuffer.toString('hex');
  }

  const completionResponse = {
    completion: completion,
    address: address,
    completionSignature: completionSignature,
    version: 2,
    week: parseInt(week),
  }

  const jsonPayload = serializeForSigning(completionResponse)
  const signature = await signPayload(jsonPayload);

  completionResponse.signature = signature.toString('hex');
  return completionResponse;
};

// Ensure keys are sorted before signing
const serializeForSigning = (responseObj) => {
  const sortedKeys = Object.keys(responseObj).sort();
  const sortedObject = {};
  sortedKeys.forEach(key => {
    sortedObject[key] = responseObj[key];
  });

  return JSON.stringify(sortedObject)
}

const signPayload = async (payload, encoding = 'utf8') => {
  const pemText = readFileSync(PEM_PATH, { encoding: 'utf8' });
  const userSigner = UserSigner.fromPem(pemText);
  const message = Buffer.from(payload, encoding)

  return await userSigner.sign(message);
}

const getCompletionPayload = (address, week, note = '') => {
  const prefixBuffer = Buffer.from(stringToHex(COMPLETTION_PREFIX), 'hex');

    const projectBuffer = Buffer.alloc(4, undefined, 'hex');
    projectBuffer.writeUInt32BE(PROJECT_ID, 0);

    const weekBuffer = Buffer.alloc(4, undefined, 'hex');
    weekBuffer.writeUInt32BE(parseInt(week), 0);

    const addressBuffer = Buffer.from(Address.fromString(address).hex(), 'hex');

    const noteBuffer = Buffer.from(stringToHex(note), 'hex');

    const message = Buffer.concat([prefixBuffer, projectBuffer, weekBuffer, addressBuffer, noteBuffer]);

    return message.toString('hex');
}

const getTaskDetails = (address, week) => {
  
  // Get user task details from DB or static file
  // Perform check for completion here
  
  return {
    identifier: '3f5Gc8',
    address: address,
    week: week,
    isCompleted: true
  }
}

const stringToHex = (str) => {
  return Buffer.from(str).toString('hex');
}