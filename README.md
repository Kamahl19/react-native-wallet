# React Starter

Simple starter for React, React Native and Express API server

## What’s Inside?

* React Web App Starter
    * Auth using JWT
    * Ant.Design
    * Axios
    * i18n (i18next)
    * Redux (saga, persist, logger, Reselect)
    * react-router
    * [create-react-app](https://github.com/facebookincubator/create-react-app)
    * Basic user functionality (signup, login, logout, reset password, activate user)
* React Native Starter
    * Auth using JWT
    * Axios
    * Redux (saga, persist, logger, Reselect)
    * React Navigation
    * Form validation
    * Alert service
    * Basic user functionality (signup, login, logout, reset password)
* Rest API Express Server
    * Mongo DB
    * DB Seeding
    * Migrations
    * Auth using JWT
    * Logging (bunyan & morgan)
    * Env variables using .env
    * Cors, Compression, Helmet
    * E-mail service
    * Request validation (joi)
    * Basic user functionality (signup, login, logout, reset password, activate user)

## Getting Started

Clone this repository:

```sh
git clone https://github.com/Kamahl19/react-starter my-app
cd my-app
rm -rf .git
git init
```

This project uses [dotenv](https://www.npmjs.com/package/dotenv) for setting environmental variables during development. Simply copy `.env.example` in both ``/backend`` and ``/frontend``, rename it to `.env` and add your env vars as you see fit.

Seed DB & Start the backend

```sh
cd backend
yarn install
yarn seed
yarn start
```

Start the frontend

```sh
cd frontend
yarn install
yarn start
```

Start the React native

```sh
cd rnmobile
yarn install
react-native run-ios
```

## Deployment

Build frontend
```sh
cd frontend
yarn build
```

Deploy app to Heroku
```sh
cd backend
heroku login
heroku create my-app
git init
heroku git:remote -a my-app
git add .
git commit -am "initial commit"
git push heroku master
```

## Login credentials

### After running `yarn seed` you can login with these credentials

* username: `user@example.com`
* password: `password`
