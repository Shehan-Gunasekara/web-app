FROM node:22-alpine3.20

RUN mkdir -p /owner-app
COPY package*.json ./owner-app
WORKDIR /owner-app
RUN npm install
COPY . /owner-app
# RUN pwd
# RUN ls -la
# RUN ls -la ../
# RUN ls /owner-app
EXPOSE 3002
# CMD npm run dev
ENTRYPOINT [ "./entrypoint.sh" ]