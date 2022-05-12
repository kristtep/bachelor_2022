This project is a video streaming tool for ambulances to send videos of a patient to the hospital in order for specialists at the hospital to help paramedics assess critical medical situations.

To test this application you can either enter the link below or test it locally.

Deployment link:
https://fascinating-daffodil-d878f4.netlify.app/

To test it locally, enter the previs folder and run npm i.
After all the dependencies are installed, you can start the application by running npm start.
The server is deployed on Heroku and there is no need to run this locally.

This will open the browser and you can see the landing page.
Depending on your role, select either WATCH to simulate the hospital or START to simulate the ambulance.

For WATCH:
When entering the hospital's side of the interface you will be asked premission to allow access to the microphone and to share the screen.
It is important to share the tab you have the application open in, in order for the ambulance side to see what you are doing, to avoid any confusion about which video is being discussed. After this the interface will display a loading screen, when waiting for the ambulance to make a call.
When the ambulance is making a call, a pulsating button will appear and a ringtone will play. Pressing this button will accept the call and connect the two sides, and show the videos from the ambulance side. Your shared screen will then be sent to the ambulance in order for them to see what you are doing. To end the call you simply press the AVSLUTT button in the top right corner.

For START:
When entering the ambulance's side of the interface you will also be asked premission to allow access to the microphone and cameras connected to your computer. The application is meant for up to three cameras, and works best if the user has at least two web cameras connected to simulate the cameras in the ambulance. In addition, the two buttons on top ULTRALYD and TERMISK are simulated options to add either ultrasound or thermal camera. When pressed, these buttons will ask premission to share your screen in order to simulate either ultrasound or thermal camera. Currently, you can only add one shared screen, and this needs to be selected before making a call, or else the shared screen video will not be sent to the hospital side. After you have added all the desired cameras and the shared screen, you can make a call by seleciton any of the options inside the dropdown menu in the RING button. When pressing one of the options, a statusbox will replace the RING button with a VENTER PÅ status, meaning pending, until the hospital side accepts the call. Then, the sides will connect and the shared screen from the hospital will be displayed, where you can see the interactions they make. To end the call you press the AVSLUTT button in the top right corner.
