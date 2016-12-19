FROM ubuntu:xenial
LABEL authors="Dennis Hadank, Merlin Brandes"

ARG DEBIAN_FRONTEND=noninteractive


# Create WORKDIR and COPY scripts folder
WORKDIR /tweet-o-matic
COPY ["config", "."]

# Installation of required packages
#RUN sudo mkdir /etc/tweet-o-matic
#RUN cd /etc/tweet-o-matic
RUN  
      apt-get update -qq --fix-missing\
      && apt-get install -y --no-install-recommends\
      nodejs\ 
      npm\
      && npm install twit\
      && sleep

VOLUME /etc/tweet-o-matic
ENTRYPOINT ["node bot.js"]