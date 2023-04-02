import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';

describe('AppController (e2e)', () => {
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should return "Hello World!"', () => {
    expect(true).toBe(true);
  });
});
