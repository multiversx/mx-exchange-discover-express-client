A demo Express app for projects participating in xExchange Discover program.

## Disclaimer

This app is for illustration purposes only and is not suited for production environments as it lacks validation and sanitization of the endpoint parameters.

## Quick start

1. Run `npm install` to install the app.
2. Create a `.env` configuration file by copying the `.env.example` file. 
3. Update `WALLET_PATH`, `WALLET_PASSWORD` and `PROJECT_ID` inside the newly created `.env` file.
4. Run `npm start` to start the app on port 3000 (this can be changed in `server.js`).

## Configuration

The default `WALLET_PATH` is `./signer_wallet.json`. Provide the file or ensure the file exists at the provided path before running the app.


