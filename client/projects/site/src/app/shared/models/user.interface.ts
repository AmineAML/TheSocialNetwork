/* eslint-disable @typescript-eslint/naming-convention */
import { SocialMedia } from '.'

export interface User {
    username?: string
    email?: string
    interest?: Array<string>
    first_name?: string
    last_name?: string
    description?: string
    gender?: string
    role?: string
    social_media?: SocialMedia
    is_confirmed?: boolean
    createdAt?: Date
    updatedAt?: Date
    id?: string
}
