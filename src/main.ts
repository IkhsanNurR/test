import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const port = process.env.PORT;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      whitelist: true,
    }),
  );
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  const config = new DocumentBuilder()
    .setTitle('DB  API')
    .setDescription('API DOCS FOR DB')
    .setVersion('1.0')
    .addServer('http://localhost:3001/', 'Local environment')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
  });
}
bootstrap();
