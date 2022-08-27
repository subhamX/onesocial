FROM node:alpine

WORKDIR /backend

RUN apk update

# yarn is already present; Yipeee;
# RUN npm install -g yarn

# Note that during build time nothing is mounted to the container.
COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn

EXPOSE 4000
