FROM node:18

WORKDIR /home/scrollbooks

COPY package.json ./

RUN npm install --prefer-offline --no-audit

COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

COPY ./ ./

ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]

EXPOSE 3000
