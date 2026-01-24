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
        const db = await getDB()

        try {
            const newPropRec = await upsertProperty(db, req.body)

            rep.status(201).send(newPropRec.id)

        } catch (e) {
            if (e.code === '23505')
                rep.status(409).send()
            else
                throw e
        }
    },
}
