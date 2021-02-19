import { Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IAuthorizedRequest } from './interfaces/common/authorized-request.interface';
import { IServiceAuthCreateResponse } from './interfaces/token/service-auth-create-response.interface';
import { IServiceAuthDestroyResponse } from './interfaces/token/service-auth-destroy-response.interface';
import { CreateUserResponseDto } from './interfaces/user/dto/create-user-response.dto';
import { CreateUserDto } from './interfaces/user/dto/create-user.dto';
import { GetUserByTokenResponseDto } from './interfaces/user/dto/get-user-by-token-reponse.dto';
import { GetUsersByQueryResponseDto } from './interfaces/user/dto/get-users-by-query.dto';
import { LoginUserResponseDto } from './interfaces/user/dto/login-user-response.dto';
import { LoginUserDto } from './interfaces/user/dto/login-user.dto';
import { LogoutUserResponseDto } from './interfaces/user/dto/logout-user-response.dto';
import { UpdateUserResponseDto } from './interfaces/user/dto/update-user-response.dto';
import { UpdateUserDto } from './interfaces/user/dto/update-user.dto';
import { IServiceUserCreateResponse } from './interfaces/user/service-account-create-response.interface';
import { IServiceUserGetByIdResponse } from './interfaces/user/service-account-get-by-id-response.interface';
import { IServiceUsersGetByQueryResponse } from './interfaces/user/service-account-get-by-query-response.interface';
import { IServiceUserSearchResponse } from './interfaces/user/service-account-search-response.interface';
import { IUser } from './interfaces/user/user.interface';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { hasRoles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { ConfirmUserDto } from './interfaces/user/dto/confirm-user.dto';
import { ConfirmUserResponseDto } from './interfaces/user/dto/confirm-user-response.dto';
import { IServiceUserConfirmResponse } from './interfaces/user/service-account-confirm-response.interface';
import { Request, Response } from 'express';
import { GetInterestAllResponseDto } from './interfaces/interest/dto/get-interest-all-response.dto';
import { IServiceUserGetInterestAllResponse } from './interfaces/interest/service-account-get-interest-all-response.interface';
import { UserIsUserGuard } from './guards/user-is-user.guard';
import { ChangePasswordDto } from './interfaces/user/dto/change-password.dto';
import { ChangePasswordResponseDto } from './interfaces/user/dto/change-password-response.dto';
import { IServiceChangePasswordResponse } from './interfaces/user/service-account-change-password-response.interface';
import { IServiceImageDeleteResponse } from './interfaces/image/service-image-delete-response.interface';

@Controller('users')
export class AccountsController {
  constructor(@Inject('ACCOUNT_SERVICE') private readonly accountServiceClient: ClientProxy,
    @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy,
    @Inject('IMAGE_SERVICE') private readonly imageServiceClient: ClientProxy
  ) { }

  //New user
  @Post('user')
  public async createUser(@Body() userRequest: CreateUserDto, @Res({ passthrough: true }) response: Response): Promise<CreateUserResponseDto> {
    userRequest.role = Role.User

    const createUserResponse: IServiceUserCreateResponse = await this.accountServiceClient
      .send('user_create', userRequest)
      .toPromise();
    if (createUserResponse.status !== HttpStatus.CREATED) {
      throw new HttpException(
        {
          message: createUserResponse.message,
          data: null,
          errors: createUserResponse.errors,
        },
        createUserResponse.status,
      );
    }

    const createTokenResponse: IServiceAuthCreateResponse = await this.authServiceClient.send('token_create', {
      userId: createUserResponse.user.id,
      role: createUserResponse.user.role,
    })
      .toPromise();

    //response.cookie('Set-Cookie', createTokenResponse.refresh_token)

    response.cookie('Refresh-Token', createTokenResponse.refresh_token, {
      httpOnly: true,
      //Valid with HTTPS only, meaning it's not working on localhost
      //secure: true,
      maxAge: 3600000,
      path: '/'
    })

    return {
      message: createUserResponse.message,
      data: {
        user: createUserResponse.user,
        access_token: createTokenResponse.access_token,
        refresh_token: null//createTokenResponse.refresh_token
      },
      errors: {
        user_error: createUserResponse.errors,
        token_error: createTokenResponse.errors
      },
    };
  }

  //Protected get user's profile by id
  @hasRoles(Role.User, Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('user/id/:id')
  public async getUserById(@Param() user: IUser): Promise<GetUserByTokenResponseDto> {
    //console.log(request)
    const userInfo = user;

    //Improve this by returning data based on user's role as Livreur, client(meaning normal user), entreprise, moderator and admin
    const userResponse: IServiceUserGetByIdResponse = await this.accountServiceClient
      .send('user_get_by_id', userInfo.id)
      .toPromise();

    return {
      message: userResponse.message,
      data: {
        user: userResponse.user,
      },
      errors: null,
    };
  }

  //Public get user profile by username
  @Get('user/username/:username')
  public async getUserByUsername(@Param() user: IUser): Promise<GetUserByTokenResponseDto> {
    //console.log(request)
    const userInfo = user;

    //Improve this by returning data based on user's role as Livreur, client(meaning normal user), entreprise, moderator and admin
    const userResponse: IServiceUserGetByIdResponse = await this.accountServiceClient
      .send('user_get_by_username', userInfo.username)
      .toPromise();

    return {
      message: userResponse.message,
      data: {
        user: userResponse.user,
      },
      errors: null,
    };
  }

  //Authenticated user data from JWT token
  @UseGuards(AuthGuard)
  @Get('user')
  public async getUserByToken(@Req() request: IAuthorizedRequest): Promise<GetUserByTokenResponseDto> {
    //console.log(request)
    const userInfo = request.user;

    const userResponse: IServiceUserGetByIdResponse = await this.accountServiceClient
      .send('user_get_by_id', userInfo.id)
      .toPromise();

    return {
      message: userResponse.message,
      data: {
        user: userResponse.user,
      },
      errors: null,
    };
  }

  //User update by id
  @hasRoles(Role.User, Role.Admin)
  @UseGuards(AuthGuard, RolesGuard, UserIsUserGuard)
  @Put('user/:id')
  public async updateUserById(@Param('id') user_id: string, @Body() user_update: UpdateUserDto, @Req() request: IAuthorizedRequest): Promise<UpdateUserResponseDto> {
    //console.log(request)

    //Don't allow user even authenticated to modify another's profile
    if (!(user_id == request.user.id)) {
      throw new HttpException(
        {
          message: null,
          data: null,
          errors: null,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    let userInfo: any = {}

    console.log(user_update)

    user_update.role ? delete user_update.role : ''

    userInfo.user_update = user_update

    userInfo.user_id = user_id

    //Improve this by returning data based on user's role as Livreur, client(meaning normal user), entreprise, moderator and admin
    const userResponse: IServiceUserGetByIdResponse = await this.accountServiceClient
      .send('user_modify_profile', userInfo)
      .toPromise();

    return {
      message: userResponse.message,
      data: {
        user: userResponse.user,
      },
      errors: null,
    };
  }

  //Users by query search of interests
  @UseGuards(AuthGuard)
  @Get('query')
  public async getUsersByQuery(@Query('search_term') search_term: string, @Query('page') page: number = 1, @Query('limit') limit: number = 10, @Req() req: Request): Promise<GetUsersByQueryResponseDto> {
    //page is either a number specified by the user or default to 1, and same to limit that either specified by the user or default to 10
    //limit is max to 100 items per page, if the user specified more than that, default to 100 else what the user specified
    page = Number(page)

    limit = Number(limit)

    limit = limit > 100 ? 100 : limit

    console.log(search_term)

    let match: any = {}

    //search_term means interests
    search_term ? match.search_term = search_term.toLowerCase() : match

    let usersResponse: IServiceUsersGetByQueryResponse

    if (match) {
      usersResponse = await this.accountServiceClient
        .send('users_search_by_query', {
          match,
          page,
          limit,
          route: `${req.headers.host}/search?interest=${search_term}`
        })
        .toPromise();
    }

    return {
      message: usersResponse.message,
      data: {
        users: usersResponse.users,
        meta: usersResponse.meta,
        link: usersResponse.link
      },
      errors: null,
    };
  }

  //Protected that authenticated users have access to it
  @hasRoles(Role.User, Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('ree')
  //@Authorization(true)
  public async ree(): Promise<any> {
    return {
      message: 'get_ree_success',
      data: {
        ree: 'Reeeeee'
      },
      errors: null,
    };
  }

  //Login user
  @Post('/login')
  //@Header('Set-Cookie', 'ree=coooooookie')
  public async loginUser(@Body() loginRequest: LoginUserDto, @Res({ passthrough: true }) response: Response): Promise<LoginUserResponseDto> {
    const getUserResponse: IServiceUserSearchResponse = await this.accountServiceClient
      .send('user_search_by_credentials', loginRequest)
      .toPromise();

    if (getUserResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getUserResponse.message,
          data: null,
          errors: null,
        },
        getUserResponse.status,
      );
    }

    const createTokenResponse: IServiceAuthCreateResponse = await this.authServiceClient
      .send('token_create', {
        userId: getUserResponse.user.id,
        role: getUserResponse.user.role,
      })
      .toPromise();

    response.cookie('Refresh-Token', createTokenResponse.refresh_token, {
      httpOnly: true,
      //Valid with HTTPS only, meaning it's not working on localhost
      //secure: true,
      maxAge: 3600000,
      path: '/'
    })

    return {
      message: createTokenResponse.message,
      data: {
        access_token: createTokenResponse.access_token,
        refresh_token: null//createTokenResponse.refresh_token
      },
      errors: null,
    };
  }

  //Refresh token
  //@UseGuards(AuthGuard)
  @Post('/refresh_token')
  public async refreshToken(@Req() req: Request, @Body() token: { refresh_token: string }): Promise<any> {
    const refresh_token = req.cookies['Refresh-Token']//.Refresh//token.refresh_token//req.headers['authorization']?.split(' ')[1]

    if (!refresh_token) {
      return {
        message: 'refresh_token_cookie_not_found_because_not_authenticated',
        data: {
          access_token: null,
        },
        errors: null,
      };
    }

    console.log(refresh_token)

    const refreshTokenResponse: any = await this.authServiceClient
      .send('token_refresh', refresh_token)
      .toPromise();

    return {
      message: refreshTokenResponse.message,
      data: {
        access_token: refreshTokenResponse.access_token,
      },
      errors: null,
    };
  }

  //Logout authenticated user
  @UseGuards(AuthGuard)
  @Put('/logout')
  public async logoutUser(@Req() request: IAuthorizedRequest, @Res({ passthrough: true }) response: Response): Promise<LogoutUserResponseDto> {
    const userInfo = request.user;

    const destroyTokenResponse: IServiceAuthDestroyResponse = await this.authServiceClient
      .send('token_destroy', {
        userId: userInfo.id,
      })
      .toPromise();

    if (destroyTokenResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: destroyTokenResponse.message,
          data: null,
          errors: destroyTokenResponse.errors,
        },
        destroyTokenResponse.status,
      );
    }

    //response.cookie('Set-Cookie', 'Refresh=; HttpOnly; Path=/; Max-Age=0')

    response.clearCookie('Refresh-Token')

    return {
      message: destroyTokenResponse.message,
      errors: null,
      data: null,
    };
  }

  //Confirm the verification of user's email
  @Get('/confirm/:link')
  public async confirmUser(@Param() params: ConfirmUserDto): Promise<ConfirmUserResponseDto> {
    const confirmUserResponse: IServiceUserConfirmResponse = await this.accountServiceClient
      .send('user_confirm', {
        link: params.link,
      })
      .toPromise();

    if (confirmUserResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: confirmUserResponse.message,
          data: null,
          errors: confirmUserResponse.errors,
        },
        confirmUserResponse.status,
      );
    }

    return {
      message: confirmUserResponse.message,
      errors: null,
      data: null,
    };
  }

  //Top interests/hobbies of registered users
  @Get('interests')
  public async getTopInterests(): Promise<GetInterestAllResponseDto> {
    const interestResponse: IServiceUserGetInterestAllResponse = await this.accountServiceClient
      .send('interest_get_all', {})
      .toPromise();

    if (interestResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: interestResponse.message,
          data: null,
          errors: null,
        },
        interestResponse.status,
      );
    }

    return {
      message: interestResponse.message,
      data: {
        interests: interestResponse.interests,
      },
      errors: null,
    };
  }

  //Resend confirmation email link
  @UseGuards(AuthGuard)
  @Put('user/confirm/email')
  public async regenerateEmailConfirmationLink(@Req() request: IAuthorizedRequest): Promise<UpdateUserResponseDto> {
    //console.log(request)
    const userInfo = request.user;

    const userResponse: IServiceUserGetByIdResponse = await this.accountServiceClient
      .send('user_regenerate_email_confirmation_link', userInfo.id)
      .toPromise();

    if (userResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: userResponse.message,
          data: null,
          errors: null,
        },
        userResponse.status,
      );
    }

    return {
      message: userResponse.message,
      data: {
        user: userResponse.user,
      },
      errors: null,
    };
  }

  //Delete user by id account
  @hasRoles(Role.User, Role.Admin)
  @UseGuards(AuthGuard, RolesGuard, UserIsUserGuard)
  @Delete('user/:id')
  public async deleteUserById(@Req() request: IAuthorizedRequest, @Res({ passthrough: true }) response: Response): Promise<any> {
    const userInfo = request.user

    const userResponse: any = await this.accountServiceClient
      .send('user_delete_account', userInfo.id)
      .toPromise()

    await this.imageServiceClient
      .send('image_delete_all', userInfo.id)
      .toPromise();

    if (userResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: userResponse.message,
          errors: userResponse.errors,
          data: null,
        },
        userResponse.status,
      );
    }

    response.clearCookie('Refresh-Token')

    return {
      message: userResponse.message,
      data: null,
      errors: null
    }
  }

  //Modify Password
  @UseGuards(AuthGuard)
  @Put('/user/change/password')
  public async modifyPassword(@Body() passwordRequest: ChangePasswordDto, @Req() request: IAuthorizedRequest): Promise<ChangePasswordResponseDto> {
    passwordRequest.id = request.user.id

    const changepasswordResponse: IServiceChangePasswordResponse = await this.accountServiceClient
      .send('user_change_password', passwordRequest)
      .toPromise();

    if (changepasswordResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: changepasswordResponse.message,
          data: null,
          errors: null,
        },
        changepasswordResponse.status,
      );
    }

    return {
      message: changepasswordResponse.message,
      data: null,
      errors: null,
    };
  }
}