import { Test, TestingModule } from '@nestjs/testing';
import { MeeetingsService } from './meeetings.service';

describe('MeeetingsService', () => {
  let service: MeeetingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeeetingsService],
    }).compile();

    service = module.get<MeeetingsService>(MeeetingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
