const path = require('node:path')

require('dotenv').config()

const DEV_WP_CONTENT_FOLDER = process.env.DEV_WP_CONTENT_FOLDER
if(!DEV_WP_CONTENT_FOLDER) {
	console.error("DEV_WP_CONTENT_FOLDER is not set, please add it to your .env")
	process.exit(1)
}

const target = path.join(DEV_WP_CONTENT_FOLDER, 'plugins/lespotocyclettes')

module.exports = {
	source: '.', // relative to directory where config is placed
	destination: path.join(DEV_WP_CONTENT_FOLDER, 'plugins/lespotocyclettes'), // destination directory on remote or local machine
	glob: '**/*', // glob for files which should be synced
	ignore: ['node_modules/**/*', 'src/**/*', '.git/**/*'], // array of string globs which exclude files/directories
}
