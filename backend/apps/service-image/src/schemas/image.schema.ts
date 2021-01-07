import * as mongoose from 'mongoose';

function transformValue(doc, ret: { [key: string]: any }) {
    delete ret._id;
}

export const ImageSchema = new mongoose.Schema(
    {
        link: {
            type: String,
            required: [true, 'Link can not be empty']
        },
        type: {
            type: String,
            required: [true, 'Type can not be empty'],
            enum: ['avatar', 'background']
        },
        user_id: {
            type: String,
            required: [true, 'User id can not be empty']
        },
        imagekit_file_id: {
            type: String,
            required: [true, 'Imagekit file id can not be empty']
        }
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
        timestamps: true
    },
);