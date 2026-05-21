FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./

ARG VITE_MQTT_BROKER_URL
ENV VITE_MQTT_BROKER_URL=$VITE_MQTT_BROKER_URL

RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]