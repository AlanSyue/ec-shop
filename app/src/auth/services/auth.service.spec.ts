import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { EmailExistError } from '../errors/email-exist-error';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../../entities/users.entity';
import { AuthDto } from '../dtos/auth-dto';

describe('AuthService', () => {
  let service: AuthService;
  let repo;

  const mockUsersRepo = {
    findOneBy: jest.fn((dto: AuthDto) => {
      if (dto.email === '1') {
        return Promise.resolve(new Users())
      }
      return null
    }),
    insert: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [Users],
      providers: [
        AuthService,
        Users,
        {
          provide: getRepositoryToken(Users),
          useValue: mockUsersRepo,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repo = module.get(getRepositoryToken(Users))
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('test signup method', () => {
    it('throw email exist error', async () => {
      const authDto = new AuthDto()
      authDto.email = '1'

      const repoFindOneBySpy = jest.spyOn(repo, 'findOneBy')
      const repoInsertSpy = jest.spyOn(repo, 'insert')

      try {
        await service.signup(authDto)
      } catch (error) {
        expect(error).toBeInstanceOf(EmailExistError);
        expect(error.message).toBe(EmailExistError.ERROR_MESSAGE);
        expect(repoFindOneBySpy).toBeCalledWith({ email: authDto.email })

        expect(repoFindOneBySpy).toBeCalledTimes(1)

        expect(repoInsertSpy).toBeCalledTimes(0)
      }
    });

    it('should execute success', async () => {
      const authDto = new AuthDto()
      authDto.email = '2'
      authDto.password = '1'
      jest.spyOn(authDto, 'getHashPassword').mockImplementation(() => 'hash-password')

      const repoFindOneBySpy = jest.spyOn(repo, 'findOneBy')
      const repoInsertSpy = jest.spyOn(repo, 'insert')

      await service.signup(authDto)

      expect(repoFindOneBySpy).toBeCalledWith({ email: authDto.email })

      expect(repoFindOneBySpy).toBeCalledTimes(1)

      expect(repoInsertSpy).toBeCalledWith({
        email: authDto.email,
        password: 'hash-password'
      })
      expect(repoInsertSpy).toBeCalledTimes(1)
    });
  })
});
