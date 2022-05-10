
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

3. Authenticate to the Application via `realm-cli`
	- Check this out: https://www.mongodb.com/docs/realm/reference/cli-auth-with-api-token/
	![CLI Login](pics/RealmCliLogin.jpg)
 	
4. Verify that you've logged in successfully:
	```bash
		$ realm-cli whoami
		Currently logged in user: qrjaulcs (********-****-****-****-ad082b5d4380)
	```

5. Export your Application into the local directory
	- Get the application id from the user interface
	- And pass it to the utility as shown in the below
	- You will be required to choose the project
	```bash
		$ realm-cli pull --remote tickerapplication-blhjj --include-hosting
		$ cd TickerApplication/
	```
	![CLI Login](pics/RealmCliPull.png)

	

6. Clone this git repository. And change the current directory to this folder.
	```bash
		cd
		git clone https://github.com/afsungur/mongodb-ticker-analysis-atlas-app.git
		cd mongodb-ticker-analysis-atlas-app
	```
7. Copy the following folders from the cloned repository to the your realm application that you pulled into your local drive.
	- Assumed that current directory is the cloned repository and ```../TickerApplication/``` is the folder where you pulled your realm application into.

	```bash
		$ cp -r functions ../TickerApplication/
		$ cp -r values ../TickerApplication/
		$ cp -r triggers ../TickerApplication/
		$ cp -r hosting/files ../TickerApplication/hosting/
		$ cp -r data_sources/mongodb-atlas/exchange ../TickerApplication/data_sources/mongodb-atlas/
		$ cp -r auth ../TickerApplication/
	```

8. Add the following attributes into ```hosting/config.json``` file that is in your pulled realm application. 

	```
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

9. Change the REALM_APP_ID variable value in the ```config.js``` file with your realm application id. ```config.js``` file is in the ```hosting/files/``` folder of your application:

	```
		REALM_APP_ID = "tickerapplication-blhjj"
		window['getConfig'] = {
		    "REALM_APP_ID": `${REALM_APP_ID}`
		}
	```

10. Make sure you have the following folder structure after you've completed all the operations above.


11. Push the local changes into the remote
	- ```$ realm-cli push --include-hosting ```
	- Confirm the changes if it's asked


12. Static hosting will not be ready immediately. In the meantime, you can check the collections that needs to be filled with the records by Scheduled Trigger. Check the number of records for the following collections:
	
```javascript
	use exchange
	db.cryptoTickerBinance.countDocuments()
	db.cryptoTickerCoinbase.countDocuments()

```

13. After 10-15 minutes, visit the hosting.
	- You should see the Latest Information section data to be filled out in a few seconds. Basically, it runs some queries on the database to fetch some statistics.
	- You should see the Currency combobox to be filled out currencies.
	- Example screenshot:
		- ![App Demo](pics/App01.png)
	- Try to run some reports:
		- Fill out the form as shown in the below and hit the "Show Charts" button.
			- ![App Demo](pics/App02.png)
		- You'll see Candlestick and RSI Charts as in the below:
			- ![App Demo](pics/App03.png)
		- You'll see the Generated Aggregation Query as in the below:
			- ![App Demo](pics/App04.png)