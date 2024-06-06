FROM node:latest as build

ARG APP_ENV=build-prod

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run $APP_ENV

FROM nginx:latest

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /usr/src/app/dist/banka-frontend/browser/* /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]