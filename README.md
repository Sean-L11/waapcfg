# waapcfg

# CORS
Run API requests through local proxy on path /api to avoid CORS issues
API domain (account) will be passed in XAccount header

sample nginx:

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

        set $upstream $http_xaccount; // more (any) validation needed
        proxy_pass https://$upstream$request_uri;
        proxy_http_version 1.1;
        proxy_set_header Host $http_xaccount;
    }
}

# User / API
default v5 state includes no users - users are required for API key.  Since API key must be a prerequisite for this, Users will need to be created prior to this configuration wizard.


