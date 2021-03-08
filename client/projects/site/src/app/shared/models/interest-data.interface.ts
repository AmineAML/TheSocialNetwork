import { Interest } from '.'

export interface InterestData {
    message: string
    data: {
        interests: Interest[]
    }
    errors: any
}
