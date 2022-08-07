import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { EmailExistError } from '../errors/email-exist-error';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { AuthDto } from '../dtos/auth-dto';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let repo;

  const mockUserRepo = {
    findOneBy: jest.fn(),
    insert: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'access token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('test signup method', () => {
    it('throw email exist error', async () => {
      const authDto = new AuthDto();
      authDto.email = '1';

      const repoFindOneBySpy = jest
        .spyOn(repo, 'findOneBy')
        .mockImplementation(async () => {
          return generateUser();
        });
      const repoInsertSpy = jest.spyOn(repo, 'insert');

      try {
        await service.signup(authDto);
      } catch (error) {
        expect(error).toBeInstanceOf(EmailExistError);
        expect(error.message).toBe(EmailExistError.ERROR_MESSAGE);
        expect(repoFindOneBySpy).toBeCalledWith({ email: authDto.email });

        expect(repoFindOneBySpy).toBeCalledTimes(1);

        expect(repoInsertSpy).toBeCalledTimes(0);
      }
    });

    it('should execute success', async () => {
      const authDto = new AuthDto();
      authDto.email = '2';
      authDto.password = '1';
      jest
        .spyOn(authDto, 'getHashPassword')
        .mockImplementation(() => 'hash-password');

      const repoFindOneBySpy = jest.spyOn(repo, 'findOneBy');
      const repoInsertSpy = jest.spyOn(repo, 'insert');

      await service.signup(authDto);

      expect(repoFindOneBySpy).toBeCalledWith({ email: authDto.email });

      expect(repoFindOneBySpy).toBeCalledTimes(1);

      expect(repoInsertSpy).toBeCalledWith({
        email: authDto.email,
        password: 'hash-password',
      });
      expect(repoInsertSpy).toBeCalledTimes(1);
    });
  });

  describe('test login method', () => {
    it('should execute success', async () => {
      const user = new User();
      user.id = 1;
      user.email = '1';

      const jwtServiceSignSpy = jest
        .spyOn(mockJwtService, 'sign')
        .mockImplementation(() => {
          return 'access token';
        });

      const result = await service.login(user);

      expect(jwtServiceSignSpy).toBeCalledWith({ email: '1', sub: 1 });

      expect(jwtServiceSignSpy).toBeCalledTimes(1);

      expect(result).toEqual({
        access_token: 'access token',
      });
    });
  });

  describe('test validate user', () => {
    it('should return result', async () => {
      const authDto = new AuthDto();
      authDto.email = '1';
      authDto.password = '1';
      const authDtoComparePasswordSpy = jest
        .spyOn(authDto, 'comparePassword')
        .mockImplementation(async () => {
          return true;
        });

      jest.spyOn(repo, 'findOneBy').mockImplementation(async () => {
        return generateUser();
      });

      const result = await service.validateUser(authDto);
      const user = new User();
      user.email = '1';
      user.password = '1';
      expect(authDtoComparePasswordSpy).toBeCalledWith(authDto.password);
      expect(authDtoComparePasswordSpy).toBeCalledTimes(1);
      expect(result).toEqual(user);
    });

    it('should return null when not found user', async () => {
      const authDto = new AuthDto();
      authDto.email = '2';

      const result = await service.validateUser(authDto);
      expect(result).toEqual(null);
    });

    it('should return null when password invalid', async () => {
      const authDto = new AuthDto();
      authDto.email = '1';
      authDto.password = '1';

      jest.spyOn(repo, 'findOneBy').mockImplementation(async () => {
        return generateUser();
      });

      const authDtoComparePasswordSpy = jest
        .spyOn(authDto, 'comparePassword')
        .mockImplementation(async () => {
          return false;
        });

      const result = await service.validateUser(authDto);
      expect(authDtoComparePasswordSpy).toBeCalledWith(authDto.password);
      expect(authDtoComparePasswordSpy).toBeCalledTimes(1);
      expect(result).toEqual(null);
    });
  });
});

const generateUser = () => {
  const user = new User();
  user.email = '1';
  user.password = '1';

  return user;
};
