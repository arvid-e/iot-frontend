# IoT Dashboard

Dashboard that displays historical or real time sensor data.

## Run dashboard locally

- Run `npm run dev`

## Run full application using Docker

**Prerequisites**:  
- Docker 
- Docker compose
- Backend: https://github.com/arvid-e/iot-backend
- Frontend: https://github.com/arvid-e/iot-frontend
- Deploy: https://github.com/arvid-e/iot-deploy 

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
