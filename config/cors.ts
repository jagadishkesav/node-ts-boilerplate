import cors from 'cors';
import domainsAllowed from '@/data/domains.json';

const domains: string[] = domainsAllowed;

export = cors({
  origin: (origin, callback) => {
    if (!origin || domains.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
});
