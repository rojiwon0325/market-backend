type IEnv = {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;

  JWT_SECRET: string;
  JWT_EXPIRESIN: string;
  MONGODB_URL: string;

  AWS_CLIENT_ID: string;
  AWS_SECRET: string;
  AWS_REGION: string;
  AWS_S3_BUCKET: string;
};
