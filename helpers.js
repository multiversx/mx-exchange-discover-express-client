import { UserSigner } from '@multiversx/sdk-wallet';
import { Address } from '@multiversx/sdk-core';
import { readFileSync } from 'fs';

const WALLET_PATH = './signer_wallet.json';
const COMPLETTION_PREFIX = 'xExchangeGrowthV1TaskCompleted';

export const serializeAndSign = async (responseObj) => {
  const jsonPayload = serializeForSigning(responseObj);
  responseObj.signature = await signPayload(jsonPayload);

  return responseObj;
}

// Ensure keys are sorted before signing
export const serializeForSigning = (responseObj) => {
  const sortedKeys = Object.keys(responseObj).sort();
  const sortedObject = {};
  sortedKeys.forEach(key => {
    sortedObject[key] = responseObj[key];
  });

  return JSON.stringify(sortedObject)
}

export const signPayload = async (payload, encoding = 'utf8') => {
  if (payload === '') {
    return '';
  }
  
  const fileContent = readFileSync(WALLET_PATH, { encoding: 'utf8' });
  const walletObject = JSON.parse(fileContent);
  const userSigner = UserSigner.fromWallet(walletObject, process.env.WALLET_PASSWORD);
  const message = Buffer.from(payload, encoding)

  const signature =  await userSigner.sign(message);
  return signature.toString('hex');
}

export const getCompletionPayload = (projectId, address, week, isCompleted, note = '') => {
  if (!isCompleted) {
    return ''
  }

  const prefixBuffer = Buffer.from(stringToHex(COMPLETTION_PREFIX), 'hex');

  const projectBuffer = Buffer.alloc(4, undefined, 'hex');
  projectBuffer.writeUInt32BE(projectId, 0);

  const weekBuffer = Buffer.alloc(4, undefined, 'hex');
  weekBuffer.writeUInt32BE(week, 0);

  const addressBuffer = Buffer.from(Address.fromString(address).hex(), 'hex');

  const noteBuffer = Buffer.from(stringToHex(note), 'hex');

  const message = Buffer.concat([prefixBuffer, projectBuffer, weekBuffer, addressBuffer, noteBuffer]);

  return message.toString('hex');
}

const stringToHex = (str) => {
  return Buffer.from(str).toString('hex');
}