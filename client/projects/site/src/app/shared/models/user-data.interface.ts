import { Link, Meta, User } from '.'

export interface UserData {
    message: string
    data: {
        users: User[]
        meta: Meta
        link: Link
    }
    errors: any
}
