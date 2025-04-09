import { Test, TestingModule } from '@nestjs/testing';
import { MeeetingsController } from './meeetings.controller';
import { MeeetingsService } from './meeetings.service';

describe('MeeetingsController', () => {
  let controller: MeeetingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeeetingsController],
      providers: [MeeetingsService],
    }).compile();

    controller = module.get<MeeetingsController>(MeeetingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
