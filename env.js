const ENV = {
	dev: {

	},
	production: {
	"token": process.env.token,
	"anilist_id": process.env.anilist_id,
	"anilist_secret": process.env.anilist_secret		
	}
};

const getEnv = (environment) => {
	return environment;
}

module.exports = ENV[getEnv('production')];