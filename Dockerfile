FROM node:11
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . /usr/src/app


RUN npm install -g ts-node typescript nodemon

ARG ENVIRONMENT
# RUN if ["${ENVIRONMENT}" == "dev"] ; then tsc --watch ; else tsc ; fi
# RUN tsc
EXPOSE 4200

# ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
# RUN chmod +x /wait

CMD nodemon