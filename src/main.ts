import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('E-commerce');

  const config = new DocumentBuilder()
    .setTitle('E-Commerce')
    .setDescription('E-Commerce API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, { useGlobalPrefix: true });

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
