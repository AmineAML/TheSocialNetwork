import { Image } from '.'

export interface ImageData {
    message: string
    data: {
        images: Image[]
    }
    errors: any
}
