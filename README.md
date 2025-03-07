# WildGuide-react
![App Version](https://img.shields.io/github/package-json/v/HenryDeLange/WildGuide-react)
![GitHub License](https://img.shields.io/github/license/HenryDeLange/WildGuide-react)

This repository is for the WildGuide frontend (React, TypeScript). Also see the related [WildGuide backend](https://github.com/HenryDeLange/WildGuide-spring).

[🦉 Live Website](https://wildguide.mywild.co.za)

## Development

![Top Language](https://img.shields.io/github/languages/top/HenryDeLange/WildGuide-react)
![Vite Build](https://img.shields.io/github/actions/workflow/status/HenryDeLange/WildGuide-react/react-source-build.yml?label=vite%20build)
![Web Deploy](https://img.shields.io/github/actions/workflow/status/HenryDeLange/WildGuide-react/azure-static-web-apps-jolly-beach-0d7ffc003.yml?label=static%20web%20deploy)

### Setup

#### Environment Variables

See the [.env.local](./.env.local) file.

### Build

This project is written in `Typescript` using React and Vite to build.

`npm run build`

### PWA
- https://www.pwabuilder.com/
- https://vite-pwa-org.netlify.app/

## Production

### Setup

See the [.env.production](./.env.production) file.

### Deploy

Manually run the `Azure Static Web Apps CI/CD` GitHub Action in order to build the code and deploy the web app to Azure.
