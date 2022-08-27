import { Client } from 'redis-om'
import dotenv from 'dotenv'

dotenv.config()
const endpoint = `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_ENDPOINT}`

const dbClient = new Client()
dbClient.open(endpoint).catch(err => {
    console.log('Redis Client Error', err)
})


export {
    dbClient
}
