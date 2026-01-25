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
            200: {
                type: 'object',
                properties: {
                    id: {type: 'integer'},
                    property_manager_id: {type: 'integer'},
                    accountant_id: {type: 'integer'},
                },
            },
        },
    },

    handler: async (req, rep) => {
        const db = await getDB()

        try {
            const propRec =
                await upsertProperty(db, {
                    id: req.params.id,
                    ...req.body,
                })

            rep.status(200).send(propRec)

        } catch (e) {
            if (e.code === '23505')
                rep.status(409).send()
            else
                throw e
        }
    },
}
