FROM keymetrics/pm2:latest-jessie

ENV HOME /opt/sinopia
ENV VERSO https://github.com/lcnetdev/verso.git
ENV RECTO https://github.com/lcnetdev/recto.git
ENV AUTH false
ENV DB_STORAGE: file
ENV DB_FILE ./bfpilot.json
ENV DEV_USER_PW password

RUN apt-get update

RUN    git clone $VERSO $HOME/verso

RUN    git clone --recursive $RECTO $HOME/recto

WORKDIR $HOME/verso

RUN npm i npm@latest -g && \
    npm i pm2@latest -g && \
    npm i grunt@latest -g

RUN cd $HOME/verso && \
    npm install && \
    cd $HOME/recto && \
    npm install && \
    cd $HOME/recto/bfe && \
    npm install && \
    grunt && \
    cd $HOME/recto/profile-edit/source && \
    npm install && \
    grunt

EXPOSE 3000

EXPOSE 3001

COPY ecosystem.config.js .

CMD ["pm2-docker", "start", "ecosystem.config.js"]
