# mongodb-ticker-analysis-realm-app
Realm Application of Ticker Analysis


Steps:

- Pre-Requisites
- Create an M30 Tier Atlas Cluster in your preferred region
 
- Create a new App in Atlas App Services
- Pull the App into your local directory.
  - realm-cli pull .. 
- Clone this repository into your local machine
- Copy the following folders into the local directory where you pulled your Atlas Application into
  - cp functions /..../
  - cp ....
- Change the following files content:
  - config.js -- realm app id
- Push the local changes into the Atlas App Services Servers
  - realm-cli push
- Verify the application
