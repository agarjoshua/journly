This is a simple React Native Application with a django backend whipped up in a couple of hours.
It features a react Native app that is ran by the command:
on the journly directory

yarn add
yarn start expo 

and a django app run by the command:
(creating a virtual environment and launching into it)

pip install -r requirements.txt
python manage.py runserver 192.168.1.7:8000

Note:
1.{192.168.1.7} - should be edited to your local IP address since expo works through the local network
2. The file in the react native file config.js should be edited to reflect the IP of your device for calls to works