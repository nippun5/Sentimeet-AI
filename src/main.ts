import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

 
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API documentation for my new project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = 3000;
  await app.listen(port);


  console.log(`Swagger is running at: http://localhost:${port}/api`);
}

bootstrap();
