import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'debug', 'log', 'verbose', 'warn'],
  });
  app.use(
    helmet({
      contentSecurityPolicy: true,
      hidePoweredBy: true,
    }),
  );

  app.enableCors({
    origin: process.env.CLIENT_DOMAIN,
    credentials: true,
  });

  app.use(cookieParser());
  /**
  app.use(
    csurf({
      cookie: true,
    }),
  ); */

  await app.listen(process.env.PORT);
}
bootstrap();
