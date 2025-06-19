# waapcfg

## Installing
### Install Angular and referenced librabries
npm install -g @angular/cli  
npm install -g uuid  
npm install @peculiar/x509  

### Create the Workspace
ng new cfg5

### Fetch this epo
git clone git@github.com:Sean-L11/waapcfg.git

## API variables

api.service.ts properties:  
server: use localhost to avoid CORS (below)  
port: self explanitiry  
protocol: should be https  

app.component.ts user input (pre-populated?):  
service: the account api subdomain e.g. v5demo for https://v5demo.app.reblaze.io  
apikey: valid api key for the above account  

## CORS
Run API requests through local proxy on path /api to avoid CORS issues
API domain (account) will be passed in XAccount header

sample nginx:
```
server {
    listen 8443;
    server_name 45.154.205.148;
    resolver 8.8.8.8 valid=30s;

    location / {
        proxy_pass http://localhost:4200;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {

        set $apiservice .app.reblaze.io;
        set $upstream $http_xaccount$apiservice; // more (any) validation needed
        proxy_pass https://$upstream$request_uri;
        proxy_http_version 1.1;
        proxy_set_header Host $http_xaccount;
    }
}
```
## User / API
default v5 state includes no users - users are required for API key.  Since API key must be a prerequisite for this, Users will need to be created prior to this configuration wizard.


