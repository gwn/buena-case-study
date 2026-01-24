const
    {getDB} = require('../db'),
    upsertProperty = require('../upsertProperty'),
    {PropertySchema} = require('../../schema')


module.exports = {
    url: '/properties',
    method: 'post',

    schema: {
        summary: 'Create property',
        body: PropertySchema,
        response: {
            201: {type: 'integer'},
        },
    },

    handler: async (req, rep) => {
        const
            db = await getDB(),
            newPropRec = await upsertProperty(db, req.body)

        rep.status(201).send(newPropRec.id)
    },
}
