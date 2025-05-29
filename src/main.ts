import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { getGeneralLogger } from '@/modules/logger/logger.service';
import { AccessInterceptor } from '@/middleware/access.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new AccessInterceptor());
    await app.listen(10300);
    const logger = getGeneralLogger();
    logger.info('[Main]', `Application is running on: ${await app.getUrl()}`);
}
bootstrap();
