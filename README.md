
# Ticker Analysis Application for Atlas App Services

This repository includes the complete export of the Atlas App Services Application, Financial Ticker Analysis. Please follow the guideline below to make it ready for use. 

- Time to complete: 30 minutes after Atlas Cluster has been provisioned

## Pre-Requisites

 - Have a MongoDB Cloud Account -> cloud.mongodb.com
 - Provision a minimum M10 Database Cluster (?)
 - Create the following collections (keep the database and collection names the same otherwise you'll need to change config)
	 - Collection name: `exchange.cryptoTickerCoinbase`
		 ```javascript
		 use exchange
		db.createCollection("cryptoTickerCoinbase",
		    {
		        "timeseries" : {
		            "timeField" : "time",
		            "metaField" : "symbol",
		            "granularity" : "seconds"
		        },
		        "expireAfterSeconds": 259200 
		    }
		)

		db.cryptoTickerCoinbase.createIndex({ symbol: 1, time:1 })
		 ```

	 - Collection name: `exchange.cryptoTickerBinance`
		 ```javascript
		 use exchange
		db.createCollection("cryptoTickerBinance",
		    {
		        "timeseries" : {
		            "timeField" : "time",
		            "metaField" : "symbol",
		            "granularity" : "seconds"
		        },
		        "expireAfterSeconds": 259200 
		    }
		)

		db.cryptoTickerBinance.createIndex({ symbol: 1, time:1 })
		 ```


- Download `realm-cli` utility: https://www.mongodb.com/docs/realm/cli/ 

## Steps to Install Application

 1. Create an App in Atlas App Services
	- Provide a name for your application
	- Choose the Atlas cluster that you want to connect from this application
		- Automatically necessary [Linked Data Source](https://www.mongodb.com/docs/realm/mongodb/link-a-data-source/#:~:text=To%20connect%20to%20a%20data,an%20import/export%20configuration%20directory.) will be created.
	- Choose Global Deployment Option

You can find an example in the below.

2. Enable hosting in your Realm Application
	- Check this out: https://www.mongodb.com/docs/realm/hosting/enable-hosting/ 

3. Enable Anonymous Authentication in your Realm Application
	- Check this out: https://www.mongodb.com/docs/realm/authentication/anonymous/ 

4. Authenticate to the Application via `realm-cli`
	- Check this out: https://www.mongodb.com/docs/realm/reference/cli-auth-with-api-token/ 

5. Verify that you've logged in successfully:
	- ```bash
		$ realm-cli whoami
		Currently logged in user: qrjaulcs (********-****-****-****-ad082b5d4380)
		```


6. Export your Application into the local directory
	- Get the application id from the user interface
	- And pass it to the utility as shown in the below
	- You will be required to choose the project
	- ```bash
		$ realm-cli pull --remote tickerapplication-blhjj
		$ cd TickerApplication/
		```



 7. Clone this git repository. And change the current directory to this folder.
	- ```bash
		cd ..
		git clone ...
		cd mongodb-ticker-analysis-atlas-app
		```
 8. Copy the following folders from the cloned repository to the your realm application export in your local drive.
	- ```bash
		$ cp -r functions ../TickerApplication/
		$ cp -r values ../TickerApplication/
		$ cp -r triggers ../TickerApplication/
		$ cp -r hosting/files ../TickerApplication/hosting/

9. Add the following attributes into your local copy of realm application ```hosting/config.json``` file:
	- ```
		"default_response_code": 200,
		"default_error_path": "/index.html",
		```
	- Ultimately  ```hosting/config.json``` file in your application should look like the following:

		```
		{
		    "enabled": true,
		    "app_default_domain": "tickerapplication-blhjj.mongodbstitch.com",
		    "default_response_code": 200,
		    "default_error_path": "/index.html",
		}
		```

10. Change the REALM_APP_ID variable value in the ```config.js``` file with your realm application id. ```config.js``` file is in the hosting/files/static folder of your application:

	- ```
		REALM_APP_ID = "tickerapplication-blhjj"
		window['getConfig'] = {
		    "REALM_APP_ID": `${REALM_APP_ID}`
		}
		```

11. Make sure you have the following folder structure after you've completed all the operations above.


12. Push the local changes into the remote
	- ```$ realm-cli push --include-hosting ```
	- Confirm the changes if it's asked
