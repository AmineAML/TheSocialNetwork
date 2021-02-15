import { Controller, HttpStatus, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { IUserConfirmResponse } from './interfaces/user-confirm-response.interface';
import { IUserCreateResponse } from './interfaces/user-create-response.interface';
import { IUserSearchQueryResponse } from './interfaces/user-search-by-query-response.interface';
import { IUserSearchResponse } from './interfaces/user-search-response.interface';
import { IUser } from './interfaces/user.interface';
import { UserService } from './services/user.service';
import { IUserUpdateResponse } from './interfaces/user-update-response.interface';
import { IInterestAllResponse } from './interfaces/interest-all.interface';
import { IChangePasswordResponse } from './interfaces/user-change-password-response.interface';

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
      } else {
        const usersWithUsername = await this.userService.searchUserByUserName({
          username: userParams.username
        });

        if (usersWithUsername && usersWithUsername.length > 0) {
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
                text: "Happy to have you as a member, confirm your email!",
                html: `<center>
                <b>Hi there, please confirm your email to unlock the full features of ${this.userService.getAppName()}.</b><br>
                Use the following link for this.<br>
                <a clicktracking="off" href="${this.userService.getConfirmationLink(userLink.link)}"><b>Confirm The Email</b></a><br>
                If that doesn't work, paste this link into a new page: ${this.userService.getConfirmationLink(userLink.link)}
                </center>`,
              })
              .toPromise();
          } catch (e) {
            console.log(e)

            result = {
              status: HttpStatus.PRECONDITION_FAILED,
              message: 'user_create_precondition_failed',
              user: null,
              errors: e.errors,
            };
          }
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
      const user = await this.userService.searchUserByUsername(username);
      if (user) {
        delete user.password

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
        delete user.password

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
        status: HttpStatus.BAD_REQUEST,
        message: 'user_search_by_credentials_bad_request',
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
  public async getUsersByCategory(params: { match: any, page: number, limit: number, route: string }): Promise<IUserSearchQueryResponse> {
    let result: IUserSearchQueryResponse;

    const { match, page, limit, route } = params

    if (match.search_term) {
      console.log('Any of is there')

      let queries: any = {}

      queries.interest = match.search_term

      const usersResponse = await this.userService.searchUsers(queries, page, limit, route);

      console.log(usersResponse.users)

      if (usersResponse.users && usersResponse.users.length > 0) {
        result = {
          status: HttpStatus.OK,
          message: 'users_get_by_id_query',
          users: usersResponse.users,
          meta: usersResponse.meta,
          link: usersResponse.link
        };
      } else {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: 'users_get_by_query_not_found',
          users: null,
          meta: usersResponse.meta,
          link: usersResponse.link
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'users_get_by_query_bad_request',
        users: null,
        meta: null,
        link: null
      };
    }

    return result;
  }

  @MessagePattern('user_confirm')
  public async confirmUser(confirmParams: { link: string }): Promise<IUserConfirmResponse> {
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
            subject: `Welcome to ${this.userService.getAppName()}`,
            text: "The Social Network team welcomes you!",
            html: `<center>
          Dear ${updatedUser.username},
          <b>Thank you for joining ${this.userService.getAppName()}, we are happy to have you as our member!<br>
          With us you can make new friends, chat and add people to your network<br>
          ${this.userService.getAppName()} team
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

  //Get top interests, mmeaning organized by how many users use them
  @MessagePattern('interest_get_all')
  public async getTopInterests(): Promise<IInterestAllResponse> {
    let result: IInterestAllResponse;

    const interests = await this.userService.getAllInterestBySorting();
    if (interests) {
      result = {
        status: HttpStatus.OK,
        message: 'interest_get_all_success',
        interests,
      };
    } else {
      result = {
        status: HttpStatus.NOT_FOUND,
        message: 'interest_get_all_not_found',
        interests: null,
      };
    }

    return result;
  }

  //Resend email confirmation link
  @MessagePattern('user_regenerate_email_confirmation_link')
  public async ReconfirmEmail(id: string): Promise<IUserUpdateResponse> {
    let result: IUserUpdateResponse;

    if (id) {
      try {
        const userLink = await this.userService.regenerateUserLink(id);
        const user = await this.userService.searchUserById(id)
        result = {
          status: HttpStatus.CREATED,
          message: 'regenerate_email_confirmation_link_success',
          user: user,
          errors: null,
        };
        this.mailerServiceClient
          .send('mail_send_confirm_email', {
            to: user.email,
            from: this.userService.getAppEmail(),
            subject: 'Email confirmation',
            text: "Happy to have you as a member, confirm your email!",
            html: `<center>
                <b>Hi there, please confirm your email to unlock the full features of ${this.userService.getAppName()}.</b><br>
                Use the following link for this.<br>
                <a clicktracking="off" href="${this.userService.getConfirmationLink(userLink.link)}"><b>Confirm The Email</b></a><br>
                If that doesn't work, paste this link into a new page: ${this.userService.getConfirmationLink(userLink.link)}
                </center>`,
          })
          .toPromise();
      } catch (e) {
        console.log(e)

        result = {
          status: HttpStatus.PRECONDITION_FAILED,
          message: 'regenerate_email_confirmation_link_precondition_failed',
          user: null,
          errors: e.errors,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'regenerate_confirmation_link_bad_request',
        user: null,
        errors: null,
      };
    }

    return result;
  }

  //Delete user's account by id
  @MessagePattern('user_delete_account')
  public async deleteModify(id: string): Promise<any> {
    let result: any;

    if (id) {
      await this.userService.deleteUser(id);

      result = {
        status: HttpStatus.OK,
        message: 'user_delete_account_success',
        errors: null,
      };
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'user_delete_account_request',
        errors: null,
      };
    }

    return result;
  }

  //Change password
  @MessagePattern('user_change_password')
  public async changePassword(changePassword: { id: string, password: string, new_password: string }): Promise<IChangePasswordResponse> {
    let result: IChangePasswordResponse;

    if (changePassword) {
      //Find user by id
      const user = await this.userService.searchUserById(changePassword.id);

      if (user) {
        //Compare password with hashedpassword
        if (await user.compareEncryptedPassword(changePassword.password)) {
          const userId = user.id

          const hashedPassword = await user.getEncryptedPassword(changePassword.new_password)

          //Modify password with new password of the user
          await this.userService.changeUserPasswordById(userId, hashedPassword);

          result = {
            status: HttpStatus.OK,
            message: 'user_change_password_success',
            errors: null
          };
        } else {
          result = {
            status: HttpStatus.NOT_FOUND,
            message: 'user_change_password_not_match',
            errors: null
          };
        }
      } else {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: 'user_change_password_not_found',
          errors: null,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'user_change_password_bad_request',
        errors: null,
      };
    }

    return result;
  }
}