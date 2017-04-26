FROM node:alpine

ENV DEBUG           *
ENV NODE_CONFIG_DIR /home/proxy/config
ENV PORT            8080

EXPOSE 8080

COPY . /home/proxy

ENTRYPOINT node /home/proxy
