const joiOptions = {
    abortEarly: false,
    stripUnknown: true,
    convert: true
};

const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], joiOptions);

        if (error) {
            return res.status(400).json({
                message: 'Validation error',
                errors: error.details.map(d => d.message)
            });
        }

        // IMPORTANT : body nettoyé et sécurisé
        req[property] = value;
        next();
    };
};

module.exports = validate;
