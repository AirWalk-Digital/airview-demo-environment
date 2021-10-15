# Basic Demo Environment for AirView

## Overview
This is a docker-compose based deployment of the core AirView components. When executed, you will have a self contained stack with the following architecture:


![](./diagram.png)

### Components
#### Nginx
Provides reverse proxy into application. Routing within nginx is handled via location prefixes. This allows different services within the application stack to be returned on a single host/port, avoiding CORS related issues. The prefix/route mappings are:

| Prefix       | Service   |
|--------------|-----------|
|/_api/api     | AirView API
|/_api/storage | Static storage mock service
|/             | Catch all route serving AirView frontend 


### AirView Frontend
The single page application as found in this repo - https://github.com/AirWalk-Digital/airview-frontend

### AirView API
The main backend api for the application as found in this repo - https://github.com/AirWalk-Digital/airview-api
Persists data into the PGSQL database service.

### Storage Mock
Mock service to allow the application to operate without markdown content as this is not supported currently.

### Oauth Mock
Mock service to allow the frontend SPA to execute it's authentication flow against a mock oauth2 provider

### PGSQL
Postgres backend relational db

### Swagger
Swagger UI provides api documentation page based on openapi spec

## Running the stack
Provided that you have docker-compose installed locally (https://docs.docker.com/compose/install/), the stack can be started with 

```docker-compose up```

Then, you should be able to browse to http://localhost:5000 and view the frontend.

To access the API, you should be able to make calls to the api from the base url of http://localhost:5000/_api/api - e.g. to list all applications - http://localhost:5000/_api/api/applications/

Documentation based on the OpenApi specification of the api is served at http://localhost:5001

Please refer to the API & frontend repositories for more information on how to interact with the application

