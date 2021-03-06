const Joi = require('joi');

module.exports = {
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = Joi.validate(req.body, schema);
            if (result.error) {
                return res.status(400).json(result.error);
            }

            if (!req.value) { req.value = {}; }
            req.value['body'] = result.value;
            next();
        }
    },
    schemas: {
        registerSchema: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            // gender: Joi.string().required(),
        }),
        authSchema: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        })
    }
}