const
    {getDB} = require('../db'),
    upsertProperty = require('../upsertProperty'),
    {PropertySchema} = require('../../schema')


module.exports = {
    url: '/properties/:id',
    method: 'put',

    schema: {
        summary: 'Update property',
        params: {
            type: 'object',
            properties: {
                id: {type: 'integer'},
            },
        },
        body: PropertySchema,
        response: {
            204: {type: 'null'},
        },
    },

    handler: async (req, rep) => {
        const db = await getDB()

        await upsertProperty(db, {
            id: req.params.id,
            ...req.body,
        })

        rep.status(204).send(null)
    },
}
