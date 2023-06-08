# Channel

Channel is an web application that: 

1) permits allowlisted admin users to upload media (audio, images, metadata) and format them into episodes
2) indexes this media into a stylized front-end web application (e.g. https://channel.xyz) for users to preview and listen
3) gates this media with a specifiable ERC-721 token; only holders of this token may access the media.
4) syndicates, serves, and generates unique RSS links per token holder; when ownership of tokens change hands, access is revoked.


This repository contains the two main components:

## Channel Server

[channel-server](channel-server) Interacts with the blockchain and smart contracts in order to view, modify, and authenticate content. The server watches Ethereum mainnet and creates uniquely generated RSS links based on token holder's wallet address and token. The server also handles media upload from administrators and generates unique RSS links to validate or invalidate access to the uploaded media. 

## Channel-XYZ

[channel-xyz](channel-xyz) Front-end web app for indexing, stylizing, and browsing new episodes. An admin dashboard is accessible for allowlisted administrators to upload media and metadata for episodes. This application also provides an interface for non-admin users to create new RSS links to access the media outside of the Channel web app in any RSS player.

## License

See the [LICENSE](LICENSE.txt) file for license rights and limitations (MIT).
