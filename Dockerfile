FROM node:8

ENV HOME /opt/sinopia/verso
ENV REPO https://github.com/lcnetdev/verso.git

RUN apt-get update && \ 
    git clone $REPO $HOME

WORKDIR $HOME

RUN npm i npm@latest -g && \
    cd $HOME && \
    npm install -g

CMD ["npm", "start"]
