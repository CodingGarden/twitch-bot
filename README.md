# Twitch Bot

A general purpose twitch bot that will work with multiple channels.

## TODO

* [x] Model the data
* [x] Setup Backend
* [x] Install tmi.js
* [x] Twitch Oauth
* [x] Add the bot to a channel
* [x] Bot can read and respond to messages in specified channels

## Environment Variable Names

- PORT - HTTP port for the Express server.
- TWITCH_CLIENT_ID - Client ID for the Twitch app
- TWITCH_CLIENT_SECRET - Client OAuth Secret for the Twitch app
- TWITCH_CLIENT_REDIR_HOST - Base host for the OAuth redirect URL.
	(`/auth/twitch/callback`)

http://localhost:8888/auth/twitch?scope=moderation:read

## Data Model

* Work in progress.
* Green entities are completed.

![ERD](ERD.png)

## 10-20-2019 TODO

* [x] List all commands for a channel
* [x] Add command to a channel
	* [ ] `!so <name>`
* [x] Architect variables and replyText replacement/format
* [ ] Review TODOs
<!-- * [ ] Add more TODOs -->


## TODO LATER

* Schema validation with JOI
* Profanity filter settings for a given channel
	* use twitch API

## Colors

https://coolors.co/57bc59-d7263d-0072bb-f6ae2d-f26419