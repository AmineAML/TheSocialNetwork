import * as mongoose from 'mongoose';

function transformValue(doc, ret: { [key: string]: any }) {
    delete ret._id;
}

export function generateLink() {
    let link: string = ''

    for (let i = 0; i < 9; i++) link += Math.random().toString(36).substr(2)

    return link
}

export const UserLinkSchema = new mongoose.Schema(
    {
        user_id: {
            type: String,
            required: [true, 'User can not be empty'],
        },
        is_used: {
            type: Boolean,
            default: false,
        },
        link: {
            type: String,
            default: generateLink(),
        },
    },
    {
        toObject: {
            virtuals: true,
            versionKey: false,
            transform: transformValue,
        },
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: transformValue,
        },
    },
);