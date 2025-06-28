FROM node:14

RUN apt-get update 
RUN apt-get install -y ruby-full 
RUN npm install -g gulp sass
COPY . /var/www
WORKDIR /var/www
EXPOSE 3000

CMD yarn install && gulp config --prod && gulp compile && gulp prod