import { Link, Meta, User } from '.'

export interface UserProfileData {
    message: string
    data: {
        user: User
        meta: Meta
        link: Link
    }
    errors: any
}
