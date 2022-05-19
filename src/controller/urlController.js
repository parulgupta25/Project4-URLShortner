const urlModel = require('../model/urlModel')
const shortid = require('shortid')
const redis = require("redis");
const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
    11174,
    "redis-11174.c263.us-east-1-2.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("ke0igLFHKuc7PSPVwhBWVxpnKmPeFMKk", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});

//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

const isValidUrl = (longUrl) => {
    return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(longUrl)
}

const createShortUrl = async function (req, res) {
    try {
        const { longUrl } = req.body

        if (!longUrl) {
            return res.status(400).send({ status: false, message: 'Long url is required' })
        }

        if (!isValidUrl(longUrl)) {
            return res.status(400).send({ status: false, message: 'Invalid long URL' })
        }

        const isUrlAlreadyUsed = await urlModel.findOne({ longUrl });
        if (isUrlAlreadyUsed) {
            return res.status(400).send({ status: false, message: "Url Already Exist" });
        }

        const baseUrl = 'http://localhost:3000'

        const urlCode = shortid.generate()
        const shortUrl = baseUrl + '/' + urlCode

        const newUrl = {
            longUrl: longUrl,
            shortUrl: shortUrl,
            urlCode: urlCode
        }

        const generatedUrl = await urlModel.create(newUrl)

        return res.status(201).send({ status: true, message: 'Success', data: generatedUrl })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

const getUrl = async (req, res) => {
    try {
        const urlCode = req.params.urlCode

        const data = await urlModel.find({ urlCode })

        if (!data) {
            return res.status(400).send({ status: false, message: 'url not exist' })
        }

        res.redirect(data.longUrl)
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createShortUrl, getUrl }