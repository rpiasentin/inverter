# Inverter Voltage Manager

This Electron application monitors an EG 18 KPV inverter and adjusts the absorb and float voltages based on custom settings.

## Features
- Real-time voltage display
- Log of actions and API calls
- User-configurable absorb voltage, float voltage and absorb time
- Automatically switches the inverter from absorb to float after the configured time
- Uses HTTP basic authentication for inverter API calls
- Remembers inverter login credentials entered in the UI

## Configuration
Copy `.env.example` to `.env` and edit the values to match your inverter credentials and default settings:

```bash
cp .env.example .env
# edit .env with your values
```

Environment variables:
- `INVERTER_HOST` – base URL of the inverter (e.g. `http://192.168.1.1`)
- `INVERTER_USER` – username for the web interface
- `INVERTER_PASS` – password used for HTTP basic authentication
- `DEFAULT_ABSORB` – default absorb voltage if user does not set it
- `DEFAULT_FLOAT` – default float voltage
- `DEFAULT_HOURS` – default absorption time in hours

You can also enter the inverter username and password in the application window.
They will be saved locally so the values appear automatically the next time you
start the app.

## Running
Install dependencies with `npm install` and start the app using:

```bash
npm start
# (the `--no-sandbox` flag is included in the script to support running as root)
```

## Packaging
To create self‑contained installers:

```bash
npm run package-mac   # for macOS
npm run package-win   # for Windows
```

The resulting installers can be distributed without additional dependencies.

## Testing

Run unit tests with:

```bash
npm test
```

## GitHub Pages Version
The `gh-pages` folder contains a simplified web version that can be deployed to GitHub Pages. It requires the inverter to be reachable from the user’s browser (CORS enabled). Place your HTML/JS files in that folder and push to the `gh-pages` branch to publish.
