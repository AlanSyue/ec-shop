import { Test, TestingModule } from '@nestjs/testing';
import { AuthDto } from '../dtos/auth-dto';
import { EmailExistError } from '../errors/email-exist-error';
import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    signup: jest.fn((dto: AuthDto) => {
      if (dto.email === '1') {
        throw new EmailExistError()
      }
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should response ok', () => {
    const response = {};
    const dto = new AuthDto;
    const serviceSignupSpy = jest.spyOn(service, 'signup');

    expect(controller.signup(response as any, dto))
    expect(serviceSignupSpy).toBeCalledTimes(1)
  })

  it('should throw error', () => {
    const response = {};
    const dto = new AuthDto;
    const serviceSignupSpy = jest.spyOn(service, 'signup').mockImplementation(() => {
      throw new EmailExistError()
    });

    expect(() => {
      controller.signup(response as any, dto)
    })
    .toThrowError(EmailExistError)
    expect(serviceSignupSpy).toBeCalledTimes(1)
  })
});
