# MENOHAKU

For development, you will need [Node](http://nodejs.org/),[Git](https://git-scm.com/) installed for your enviroment, and [Expo](https://docs.expo.io/versions/latest/)  to your mobile device.
Optionally you will also need [mongo](https://www.mongodb.com/cloud/atlas/lp/general?utm_content=081118_LP_Control_1&jmp=search&utm_source=google&utm_campaign=EMEA-Finland-Ent-to-Atlas-Brand-Alpha&utm_keyword=mongo&utm_device=c&utm_network=g&utm_medium=cpc&utm_creative=257451936696&utm_matchtype=e&_bt=257451936696&_bk=mongo&_bm=e&_bn=g&gclid=EAIaIQobChMI2MLvzIj03AIVWomyCh3p7wzaEAAYASAAEgKk6vD_BwE) if you are planning also to run server.js, for data collecting.

## Install Mobile Application
To start developing first time, run on your:

    $ git clone https://github.com/Menohaku/Menohaku.git
    $ cd Menohaku/mobile-app
    $ npm install
    $ npm start

And scan qr-code with mobile-device's expo-application. In order this to work mobile-device and your computer has to be in same network.

Additinal instructions to for developing with [Expo](https://github.com/Menohaku/Menohaku/tree/master/mobile-app)


## Install server

    $ git clone https://github.com/Menohaku/Menohaku.git
    $ cd Menohaku/server
    Setup mongo database. Change dbUrl in Menohaku/server/server.js.
    $ npm install
    $ node server.js

## Configuration 

To get data-collection working you  have to configure Menohaku mobile application to send data to your server. 
Server address is defined in file mobile-app/components/Chat/Chat. 
