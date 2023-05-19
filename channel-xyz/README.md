# channel-xyz

Using node v17.9.1

## Environment

```bash
# .env example variables

# api (server) endpoint
VUE_APP_API_URL="http://localhost:8081"
# infura id
VUE_APP_INFURA_ID=""
# app branch for deploy
VUE_APP_BRANCH="dev"
# channel token store url
VUE_APP_TOKEN_STORE_URL="https://www.gem.xyz/collection/channel-s0/"
# minimum image dimension
VUE_APP_MIN_IMAGE_DIMS=500
# max image dimension
VUE_APP_MAX_IMAGE_DIMS=3000
# app page limit
VUE_APP_PAGE_LIMIT=10
# AES security key (must match server AES key)
VUE_APP_AES_KEY=""
# image status message
VUE_APP_STATUS_MESSAGE="Image must be minimum 500 to maximum 3000 pixels square"
# object storage url
VUE_APP_BUCKET="https://example.objectstorage.com"
```

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Compiles and minifies for production, and serves via python
```
yarn serve-prod
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
# channel-xyz
