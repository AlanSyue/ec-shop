import { Test, TestingModule } from '@nestjs/testing';
import { AuthDto } from '../dtos/auth-dto';
import { EmailExistError } from '../errors/email-exist-error';
import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';
import { Response } from 'express';
import { User } from '../../entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    signup: jest.fn((dto: AuthDto) => {
      if (dto.email === '1') {
        throw new EmailExistError();
      }
    }),
    login: jest.fn(),
  };

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

  describe('test signup method', () => {
    it('should response ok', () => {
      const response = {};
      const dto = new AuthDto();
      const serviceSignupSpy = jest.spyOn(service, 'signup');

      expect(controller.signup(response as any, dto));
      expect(serviceSignupSpy).toBeCalledTimes(1);
      expect(serviceSignupSpy).toBeCalledWith(dto);
    });

    it('should throw email exists error', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockImplementation().mockReturnValue(400),
        json: jest.fn().mockImplementation().mockReturnValue({
          error_code: EmailExistError.ERROR_CODE,
          error_message: EmailExistError.ERROR_MESSAGE
        }),
      }
      const dto = new AuthDto();
      const serviceSignupSpy = jest
        .spyOn(service, 'signup')
        .mockImplementation(() => {
          throw new EmailExistError();
        });

      const result = await controller.signup(mockResponse as any, dto);

      expect(result).toBe(mockResponse.json())
      expect(serviceSignupSpy).toBeCalledTimes(1);

    });
  })

  describe('test login method', () => {
    it('should response ok', () => {
      const user = new User();
      const tokenObject = { access_token: 'access token' }

      const mockRequest = { user: user };
      const serviceLoginSpy = jest
        .spyOn(service, 'login')
        .mockImplementation(async () => {
          return tokenObject
        });

      expect(controller.login(mockRequest)).toEqual(Promise.resolve(tokenObject));
      expect(serviceLoginSpy).toBeCalledTimes(1);
      expect(serviceLoginSpy).toBeCalledWith(user);
    });
  })
});
