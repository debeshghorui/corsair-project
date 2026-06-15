import 'dotenv/config';

import { db as pool} from '../lib/db';
import { createCorsair } from 'corsair';
import { gmail } from '@corsair-dev/gmail';
import { googlecalendar } from '@corsair-dev/googlecalendar';
import { github } from '@corsair-dev/github';


export const corsair = createCorsair({
    plugins: [
        gmail(),
        googlecalendar(),
        github()
    ],
    database: pool,
    kek: process.env.CORSAIR_KEK!,
    multiTenancy: false,
});

