import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getLogger } from './utils/logger';

async function bootstrap() {
    const logger = getLogger();
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(10300);
    logger.info('[Main]', `Application is running on: ${await app.getUrl()}`);
}
bootstrap();
