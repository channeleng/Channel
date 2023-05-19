# Channel Server

Using node v17.9.1

## Project setup
```
yarn install
```

### Local Development
```
yarn serve
```


## Environment



```bash
# .env example variables

# frontend address
CLIENT_SERVER="http://localhost:8080"
# back end (server) port
PORT=8081
# object storage endpoint
BUCKET_ENDPOINT="example.bucketdomain.com"
# generated authentication key
AES_KEY=""

# DATABASE
# postgres connection string
PG_CONNECTION_STR="postgresql://"
# object storage bucket name
BUCKET=""
# object storage secret
SPACES_SECRET=""
# object storage access key
SPACES_ACCESS_KEY=""

# ETH
# ethereum network
ETHEREUM_NETWORK="mainnet"
# infura api key
INFURA_API_KEY=""
# channel contract address
CONTRACT_ADDRESS=""
```


# API Docs

## Server Info

`GET /`

Server manifest

### Return

    {
      ... serverinfo
    }

## Episodes

`GET /episodes/`

### Query Params

  - limit: Number - Limit the amount of entries per query
  - offset: Number - Query offset, for pagination
  - order: \[DESC,ASC\] - Row ordering
  - creatorAddress: 0xAddress - Episodes created by this address
  - cid: CID String - Episode with this CID
  - id: Episode Id UUID - Episode with this UUID

### Return

    {
      count: Number,
      rows: [episode, ...]
    }


## Create Episode

`POST {"name":"episode1", ...} /episodes/create/`

### Return

    {
      ... episode
    }


## Delete Episode

`DELETE /episodes/delete/`

### Return

    {
      ... delete status
    }


## Profiles

`GET /profiles/`

### Query Params

  - limit=Number - Limit the amount of entries per query
  - order=\[DESC,ASC\] - Row ordering

### Return

    {
      count: Number,
      rows: [profile, ...]
    }

## Get / Create Profile

`GET /profiles/:0xADDRESS[...]`

### Return

    {
      ... profile
    }


## Delete profile

`DELETE /profiles/?id=<db_uuid>`


## Verify Profile Permissionss

`GET /profiles/:address/verify`

### Return

    {
      ... profileStatus
    }


## PreSign Profiles

`POST /profiles/:address/preSign`

Generate nonce for use in Signature Message

### Return

    {
      ... signStatus
    }


## Contract

### Get balance for specific address

`GET /profiles/:address/balance`

### Return

    {
      "balance": <TokenCount>
    }


## Links

### Get link for address. Will not return link if not subscribed.

`GET /link/:address`

  - order=\[DESC,ASC\] - Row ordering

### Return

    {
        "link": {
            "cid": "<cid>",
            "subscriberAddress": "<address>"
        }
    }

## RSS (XML)

### Get RSS Feed

`GET /rss/:linkCid`

### Returns XML