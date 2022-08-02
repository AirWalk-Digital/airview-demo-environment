This will provide a dockerised api wired up to the airview-cms-api package for local development based on Express.js

# Example Usage

``` sh
docker build -t airview-cms-api .


docker run --rm -it \
-v /local/path/to/private-key.pem:/private-key.pem \
-e GITHUB_REPO_NAME=my-repo \
-e GITHUB_ORG_NAME=my-org \
-e GITHUB_INSTALLATION_ID=1234567 \
-e GITHUB_APP_ID=8910 \
-e GITHUB_PRIVATE_KEY_FILE=/private-key.pem \
-e PORT=3001 \
-p 3001:3001 \
airview-cms-api
```
