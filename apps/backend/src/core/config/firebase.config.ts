import { registerAs } from '@nestjs/config';

export default registerAs('firebase', () => ({
  credentialsPath: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.FIREBASE_PROJECT_ID,
}));
