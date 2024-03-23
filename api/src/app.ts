import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import axios from 'axios';

import * as middlewares from './middlewares';
import MessageResponse from './interfaces/MessageResponse';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get<{}, MessageResponse>('/', async (req, res) => {
  try {

    const rapidAPIKey = "126e2cd957mshbd5ead3a2e18a5ap10fe39jsn8e82fd0268a2" // Assuming you have set this environment variable


    const options = {
      method: 'POST',
      url: 'https://crunchbase-crunchbase-v1.p.rapidapi.com/searches/organizations',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': '126e2cd957mshbd5ead3a2e18a5ap10fe39jsn8e82fd0268a2',
        'X-RapidAPI-Host': 'crunchbase-crunchbase-v1.p.rapidapi.com'
      },
      data: {
        field_ids: [
          'identifier',
          'location_identifiers',
          'short_description',
          'rank_org',
          'image_url'
        ],
        limit: 50,
        order: [
          {
            field_id: 'rank_org',
            sort: 'asc'
          }
        ],
        query: [
          {
            field_id: 'location_identifiers',
            operator_id: 'includes',
            type: 'predicate',
            values: [
              '6106f5dc-823e-5da8-40d7-51612c0b2c4e'
            ]
          },
          {
            field_id: 'facet_ids',
            operator_id: 'includes',
            type: 'predicate',
            values: ['company']
          }
        ]
      }
    };
    
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error(error);

  }
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
