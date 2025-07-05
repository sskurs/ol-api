FROM node:10

# Use Debian archive mirrors for Stretch and remove stretch-updates
RUN sed -i 's/deb.debian.org/archive.debian.org/g' /etc/apt/sources.list && \
    sed -i 's/security.debian.org/archive.debian.org/g' /etc/apt/sources.list && \
    sed -i '/stretch-updates/d' /etc/apt/sources.list && \
    echo 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/99no-check-valid-until

RUN apt-get update 
RUN apt-get install -y ruby-full build-essential python
RUN npm install -g gulp sass
COPY . /var/www
WORKDIR /var/www
EXPOSE 3000

# Use npm with --ignore-optional to skip problematic native modules
CMD npm install --ignore-optional && gulp config --prod && gulp compile && gulp prod