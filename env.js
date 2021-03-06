const ENV = {
	production: {
		"prefix": "~",
		"token": process.env.token,
		"anilist_id": process.env.anilist_id,
		"anilist_secret": process.env.anilist_secret,
		"apiai_token": process.env.apiai_token,
		"youtube_token": process.env.youtube_token
	}
};

const getEnv = (environment) => {
	return environment;
}

module.exports = ENV[getEnv('production')];