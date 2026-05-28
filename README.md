# IoT Dashboard

Dashboard that displays historical or real time sensor data.

## Run locally

1. Setup backend --> https://github.com/arvid-e/iot-backend
2. Run `npm run dev`

## Run using Docker

**Prerequisites**:  
- Docker 
- Docker compose
- Backend: https://github.com/arvid-e/iot-backend
- Deploy repository: https://github.com/arvid-e/iot-deploy 

**Steps**:  

1. Setup folder structure:
```
app/
├── iot-frontend/
├── iot-backend/
└── iot-deploy/
```
2. `cd app/iot-deploy`
3. `docker compose up -d --build`
