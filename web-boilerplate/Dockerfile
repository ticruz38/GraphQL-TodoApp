FROM node:8-jessie
ENV NODE_ENV production

WORKDIR /app
COPY ./package.json /app

ENV https_proxy http://net:libreservice@proxy:8080
ENV http_proxy http://net:libreservice@proxy:8080

RUN yarn

COPY . /app

# COPY . .
RUN npm run build:web:prod
RUN npm run build:client:prod

ENV http_proxy ""
ENV https_proxy ""

EXPOSE 80
CMD npm run start:web:prod