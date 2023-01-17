import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserInterceptor } from './user/interceptors/user.interceptor';
// import { AuthGuard } from './guards/auth.guard';
import { ProductModule } from './product/product.module';

@Module({
  imports: [UserModule,ProductModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,// work
    // },
  ],
})
export class AppModule {}
