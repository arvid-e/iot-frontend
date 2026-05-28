FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./

ARG VITE_MQTT_BROKER_URL
ENV VITE_MQTT_BROKER_URL=$VITE_MQTT_BROKER_URL

ARG VITE_MQTT_USERNAME
ENV VITE_MQTT_USERNAME=$VITE_MQTT_USERNAME

ARG VITE_MQTT_PASSWORD
ENV VITE_MQTT_PASSWORD=$VITE_MQTT_PASSWORD

RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]