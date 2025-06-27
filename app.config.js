import 'dotenv/config';
import appJson from './app.json';

export default () => {
  return {
    ...appJson,
    expo: {
      ...appJson.expo,
      extra: {
        ...appJson.expo.extra,
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
        API_URL: process.env.API_URL,
      },
    },
  };
};