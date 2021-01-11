import { Controller, HttpStatus, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { IUserConfirmResponse } from './interfaces/user-confirm-response.interface';
import { IUserCreateResponse } from './interfaces/user-create-response.interface';
import { IUserSearchQueryResponse } from './interfaces/user-search-by-query-response.interface';
import { IUserSearchResponse } from './interfaces/user-search-response.interface';
import { IUser } from './interfaces/user.interface';
import { UserService } from './services/user.service';
import { IUserUpdateResponse } from './interfaces/user-update-response.interface';

@Controller()
export class ServiceAccountController {
  constructor(private readonly userService: UserService,
              @Inject('MAILER_SERVICE') private readonly mailerServiceClient: ClientProxy) { }

  //Create a new user account
  @MessagePattern('user_create')
  public async createUser(userParams: IUser): Promise<IUserCreateResponse> {
    let result: IUserCreateResponse;

    if (userParams) {
      const usersWithEmail = await this.userService.searchUserByEmail({
        email: userParams.email,
      });

      const usersWithUsername = await this.userService.searchUserByUserName({
        username: userParams.username
      });

      if (usersWithEmail && usersWithEmail.length > 0) {
        result = {
          status: HttpStatus.CONFLICT,
          message: 'user_create_conflict',
          user: null,
          errors: {
            email: {
              message: 'Email already exists',
              path: 'email',
            },
          },
        };
      } else if (usersWithUsername && usersWithUsername.length > 0) {
        result = {
          status: HttpStatus.CONFLICT,
          message: 'user_create_conflict',
          user: null,
          errors: {
            email: {
              message: 'Username already exists',
              path: 'username',
            },
          },
        };
      } else {
        try {
          userParams.is_confirmed = false;

          const createdUser = await this.userService.createUser(userParams);
          const userLink = await this.userService.createUserLink(createdUser.id);

          delete createdUser.password;
          result = {
            status: HttpStatus.CREATED,
            message: 'user_create_success',
            user: createdUser,
            errors: null,
          };
          this.mailerServiceClient
            .send('mail_send_confirm_email', {
              to: createdUser.email,
              from: this.userService.getAppEmail(),
              subject: 'Email confirmation',
              text: "and easy to do anywhere, even with Node.js",
              html: `<center>
              <b>Hi there, please confirm your email to unlock the full features of The Social Network.</b><br>
              Use the following link for this.<br>
              <a href="${this.userService.getConfirmationLink(userLink.link)}"><b>Confirm The Email</b></a><br>
              If that doesn't work, paste this link into a new page: ${this.userService.getConfirmationLink(userLink.link)}
              </center>`,
            })
            .toPromise();
        } catch (e) {
          result = {
            status: HttpStatus.PRECONDITION_FAILED,
            message: 'user_create_precondition_failed',
            user: null,
            errors: e.errors,
          };
        }
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'user_create_bad_request',
        user: null,
        errors: null,
      };
    }

    return result;
  }

  //Get user by username
  @MessagePattern('user_get_by_username')
  public async getUserByUsername(username: string): Promise<IUserSearchResponse> {
    let result: IUserSearchResponse;

    if (username) {
      const user = await this.userService.searchUserById(username);
      if (user) {
        result = {
          status: HttpStatus.OK,
          message: 'user_get_by_username_success',
          user,
        };
      } else {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: 'user_get_by_username_not_found',
          user: null,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'user_get_by_username_bad_request',
        user: null,
      };
    }

    return result;
  }

  //Get user by id, and also useful to verify that the id with the JWT token is valid
  @MessagePattern('user_get_by_id')
  public async getUserById(id: string): Promise<IUserSearchResponse> {
    let result: IUserSearchResponse;

    if (id) {
      const user = await this.userService.searchUserById(id);
      if (user) {
        result = {
          status: HttpStatus.OK,
          message: 'user_get_by_id_success',
          user,
        };
      } else {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: 'user_get_by_id_not_found',
          user: null,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'user_get_by_id_bad_request',
        user: null,
      };
    }

    return result;
  }

  //Get user by email and password to verify they are valid and return a JWT token to the user of login
  @MessagePattern('user_search_by_credentials')
  public async searchUserByCredentials(searchParams: { email: string; password: string; }): Promise<IUserSearchResponse> {
    let result: IUserSearchResponse;

    if (searchParams.email && searchParams.password) {
      const user = await this.userService.searchUserByEmail({
        email: searchParams.email,
      });

      if (user && user[0]) {
        if (await user[0].compareEncryptedPassword(searchParams.password)) {
          result = {
            status: HttpStatus.OK,
            message: 'user_search_by_credentials_success',
            user: user[0],
          };
        } else {
          result = {
            status: HttpStatus.NOT_FOUND,
            message: 'user_search_by_credentials_not_match',
            user: null,
          };
        }
      } else {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: 'user_search_by_credentials_not_found',
          user: null,
        };
      }
    } else {
      result = {
        status: HttpStatus.NOT_FOUND,
        message: 'user_search_by_credentials_not_found',
        user: null,
      };
    }

    return result;
  }

  //Modify user profile data
  @MessagePattern('user_modify_profile')
  public async modifyUser(modifyParams: { user_id: string, user_update: IUser }): Promise<IUserUpdateResponse> {
    let result: IUserUpdateResponse;

    if (modifyParams) {
      console.log(modifyParams)

      const user = await this.userService.searchUserById(modifyParams.user_id);

      console.log(user)

      if (user /*&& user[0]*/) {
        const userId = user/*[0]*/.id;
        const userData = modifyParams.user_update
        const user_updated = await this.userService.updateUserProfileById(userId, userData);
        result = {
          status: HttpStatus.OK,
          message: 'user_confirm_success',
          user: user_updated,
          errors: null,
        };
      } else {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: 'user_confirm_not_found',
          user: null,
          errors: null,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'user_confirm_bad_request',
        user: null,
        errors: null,
      };
    }

    return result;
  }

  //Get users by search query which's category
  @MessagePattern('users_search_by_query')
  public async getUsersByCategory(match: any): Promise<IUserSearchQueryResponse> {
    let result: IUserSearchQueryResponse;

    if (match.interest) {
      console.log('Any of is there')

      let queries: any = {}

      queries.interest = match.interest

      const users = await this.userService.searchUsers(queries);

      console.log(users)

      if (users) {
        result = {
          status: HttpStatus.OK,
          message: 'user_get_by_id_success',
          users,
        };
      } else {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: 'user_get_by_id_not_found',
          users: null,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'user_get_by_id_bad_request',
        users: null,
      };
    }

    return result;
  }

  @MessagePattern('user_confirm')
  public async confirmUser(confirmParams: {
    link: string;
  }): Promise<IUserConfirmResponse> {
    let result: IUserConfirmResponse;

    if (confirmParams) {
      const userLink = await this.userService.getUserLink(confirmParams.link);

      if (userLink && userLink[0]) {
        const userId = userLink[0].user_id;
        const updatedUser = await this.userService.updateUserById(userId, {
          is_confirmed: true,
        });
        await this.userService.updateUserLinkById(userLink[0].id, {
          is_used: true,
        });

        //Send a welcome and platform tutorial mail
        this.mailerServiceClient
        .send('mail_send_welcome_tutorial', {
          to: updatedUser.email,
          from: this.userService.getAppEmail(),
          subject: `Welcome to ${this.userService.getAppName}`,
          html: `<center>
          Dear ${updatedUser.first_name} ${updatedUser.last_name},
          <b>Thank you for joining ${this.userService.getAppName}, we are happy to have you!<br>
          With us you can make new friends, chat and add people to your network<br>
          ${this.userService.getAppName} team
          </center>`,
        })
        .toPromise();

        result = {
          status: HttpStatus.OK,
          message: 'user_confirm_success',
          errors: null,
        };
      } else {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: 'user_confirm_not_found',
          errors: null,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'user_confirm_bad_request',
        errors: null,
      };
    }

    return result;
  }
}