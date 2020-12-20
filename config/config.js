const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    port: process.env.PORT,
    db_url: process.env.DB_URL,
    db_port: process.env.DB_PORT,
    db_name: process.env.DB_NAME,
    jwt_secret: process.env.SECRET_KEY,
    mail_address: process.env.USER_MAIL,
    mail_pwd: process.env.PASS_MAIL,
    encryption_pwd: process.env.ENCRYPTION_PASSWORD,
    encryption_url: process.env.ENCRYPTION_URL,
    frontServerUrl : process.env.NODE_ENV == 'dev' ? "http://localhost:4020/": "https://gark.app/"
}