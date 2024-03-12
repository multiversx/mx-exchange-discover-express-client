A demo Express app for projects participating in xExchange Discover program.

## Quick start

1. Run `npm install` to install the app.
2. Run `npm run create-env-file` to generate a `.env` configuration file. 
3. Update `WALLET_PATH`, `WALLET_PASSWORD` and `PROJECT_ID` inside the newly created `.env` file.
4. Run `npm start` to start the app on port 3000 (this can be changed in `server.js`).

## Configuration

After running `npm run create-env-file`, you will need to updade the values inside.

The default wallet path is `./signer_wallet.json`. Provide the file or ensure the file exists at the provided path before running the app.

## Disclaimer

This app does not perform input validation and sanitization. Therefore it is not suited for production environments.

