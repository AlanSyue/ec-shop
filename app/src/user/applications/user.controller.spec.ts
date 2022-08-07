import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('test user profile', () => {
    it('should return user data',() => {
      const user = { id: 1, email: '2' }
      const request = { user: user }
      const expected = {
        data: user
      }
      
      expect(controller.getProfile(request)).toEqual(expected)

    })
  })
});
