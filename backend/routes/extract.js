const
    Anthropic = require('@anthropic-ai/sdk'),
    {PropertySchema} = require('../schema'),
    {ANTHROPIC_API_KEY} = process.env,

    anthropic = new Anthropic({apiKey: ANTHROPIC_API_KEY}),


    /* eslint-disable max-len */
    prompt = `
Extract structured data from this German Teilungserklärung PDF. Output ONLY valid JSON, no extra text. Use this exact schema:

{
  "name": string,
  "unique_number": string,
  "management_type": "weg" | "mv",
  "total_mea": number,
  "property_manager": { "name": string, "address": string | null },
  "accountant": { "name": string, "address": string | null },
  "buildings": [
    {
      "name": string,
      "street": string,
      "house_number": string,
      "construction_year": number | null,
      "description": string | null,
      "units": [
        {
          "number": string,
          "type": "Apartment" | "Office" | "Garden" | "Parking",
          "floor": string | null,
          "entrance": string | null,
          "size": number | null,
          "co_ownership_share": number | null,
          "construction_year": number | null,
          "rooms": number | null,
          "description": string | null
        }
      ]
    }
  ]
}

Parse §§1-3 carefully. Handle grouped units (parking 09-13 as separate). Convert 95,00 → 95.00. ca → approx. Manager/accountant from §5.
`
/* eslint-enable max-len */



module.exports = {
    url: '/extract',
    method: 'post',

    schema: {
        description: 'Extract structured data from Teilungserklärung PDF',
        consumes: ['multipart/form-data'],
        response: {
            200: PropertySchema,
        },
    },

    handler: async (req, rep) => {
        const data = await req.file()

        if (!data)
            return rep.status(400).send({error: 'No file uploaded'})

        if (data.mimetype !== 'application/pdf')
            return rep.status(400).send({error: 'Only PDF files are allowed'})

        const
            buffer = await data.toBuffer(),
            base64PDF = buffer.toString('base64'),

            claudeResp = await anthropic.messages.create({
                model: 'claude-sonnet-4-5-20250929',
                max_tokens: 4096,
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'document',
                                source: {
                                    type: 'base64',
                                    media_type: 'application/pdf',
                                    data: base64PDF,
                                },
                            },
                            {
                                type: 'text',
                                text: prompt,
                            },
                        ],
                    },
                ],
            }),

            respText = claudeResp.content[0].text,

            // Extract JSON (remove markdown code blocks if present)
            jsonMatch =
                respText.match(/```json\n([\s\S]*?)\n```/)
                || respText.match(/```([\s\S]*?)```/),

            jsonText = jsonMatch ? jsonMatch[1] : respText,

            extractedData = JSON.parse(jsonText)

        rep.send(extractedData)
    },
}
