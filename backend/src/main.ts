import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              
      forbidNonWhitelisted: true,  
      transform: true,             
    }),
  );

  // ✅ Enable CORS so frontend can talk to the backend
  app.enableCors({
    origin: ['http://localhost:3000'], // your Next.js frontend origin
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API documentation for my new project')
    .setVersion('1.0')
    .addBearerAuth(
      { 
        type: 'http', 
        scheme: 'bearer', 
        bearerFormat: 'JWT', 
        description: 'Enter JWT token' 
      }, 
      'Authorization'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = 8000;
  await app.listen(port);

  console.log(`Swagger is running at: http://localhost:${port}/api`);
}

bootstrap();
