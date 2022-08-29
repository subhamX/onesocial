# OneSocial

It's the ultimate super app for creators and their audience. With OneSocial, you can share your thoughts on blog, manage an active newsletter, organize events with people, and do much more.

Have some digital offerings you want to offer to users? No worries, you can sell digital products on the platform, like notion templates, design illustrations, stock images, etc. And if you offer services like video consultation, mock interviews, or resume reviews, you can list them on the app as well. Plus, with integrated chat and video streaming, you can communicate securely with anyone on the platform, including your clients.

Content discovery is a big problem. There are so many nice creators on the Internet, but we never get to know about them. OneSocial platform's discover section ranks the content from all the creators and enables users to find the thing they want.

So you, as a creator or service provider, can chill out a bit and focus more on your work instead of managing a website and having marketing campaigns.

# Overview video

Here's a short video that explains the project and how it uses Redis:

[![YouTube video](https://i.ytimg.com/vi/0IgKm6kiGqQ/maxresdefault.jpg)](https://youtu.be/0IgKm6kiGqQ)

## How it works

### How the data is stored:


The data is stored as Redis JSON, and we're using [redis-om-node](https://github.com/redis/redis-om-node) library to interact with the database. Each of the major fields are indexed or sorted for best performance based on the design requirements. You can view all the model schemas in  [/shared/src/db](/shared/src/db).

We're using [RediSearch](https://github.com/RediSearch/RediSearch) to query and index the data in Redis.

We're also using [Redis Streams](https://redis.io/docs/data-types/streams-tutorial/) to publish and subscribe events across multiple services. The chat module is powered by it.


### How the data is accessed:

We're using [redis-om-node](https://github.com/redis/redis-om-node) library to access the data. The accesses are broadly of the following categories.
1. Using the `fetch()` method provided by the `fetchRepository()` method in redis-om-node. The effect of it is just like direct retrieval using KEYS.
2. Using the `search()` method provided by the `fetchRepository()` method in redis-om-node. We're using it to filter and fetch the data using the secondary index. The operators `equals()`, `or()`, `and()` are chained based on the application logic. Please note that we're doing it only on the indexed fields, with a minimal performance impact.
3. Incase of `pub/sub` communication, we're encoding the data as `JSON`, and transporting the object as a string.
4. There're instances where we're using `RediSearch` for full-text search. Here, we use the same `search()` method but instead of `equals()` we're using it along with `contains()` and `containsOneOf()`.

> **Note:** While RedisJSON is a No SQL database, which embraces de-normalized data modelling, please note that currently [redis-om-node](https://github.com/redis/redis-om-node) doesn't support Embedding Schemas. This was a major limitation, as we had to build things with level one fields. There're several instances where we've duplicated the data in the application, but most of the critical ones aren't done purely to have more consistency.


## How to run it locally?


### Prerequisites

- Docker Compose v1.29.2
- Node.js v16.15.0
- yarn v1.22.19
- Stripe CLI v1.11.3
- [OAuth 2.0, credentials](https://console.cloud.google.com/apis/credentials) for social authentication with google.
- Google Storage Bucket credentials JSON
- Cloudinary API key
- Stripe API key

### Local installation

In each of the directory namely `backend/`, `chat/`, `frontend/`, and `notification/`. There is a file named `.env.example`. Please fill in the credentials and save it as `.env`. Also, please put the `gcloud-service-account-key.json` inside `backend/`. It should have access to the GCP bucket.

1. After cloning the repo, run the following command to install all dependencies.
```bash
yarn
```

2. Now build all the applications.
```bash
yarn build
```

3. Now, run the following command to start the development server.
```bash
yarn start
```

4. We're using cookies to authenticate the clients. To keep things secure, we're using cookies with `SameSite=Lax`. As a result, we're using NGINX reverse proxy to keep the domain of all our individual servers same. Run the following command from the root, and it will take care of everything related to configuring nginx.
```bash
docker-compose up --build
```

5. The following app processes payments only via webhooks and not using redirect URi. To redirect the webhook calls to our local server, please use the following command:
```bash
stripe listen --forward-to localhost/ms/impact/api/payments/webhook
```

6. Congrats! 🎉 You've successfully started the `OnSocial` application on local development environment. Please ensure that you always visit [http://localhost/](http://localhost/) (i.e on port 80).


## Architecture Diagram

![landing](https://raw.githubusercontent.com/subhamX/onesocial/main/_docs/screenshots/onesocial_architecture.png)
