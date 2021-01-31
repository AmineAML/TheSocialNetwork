import * as mongoose from 'mongoose';

function transformValue(doc, ret: { [key: string]: any }) {
    delete ret._id;
}

export const InterestSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name can not be empty'],
        },
        byNumberOfUsers: {
            type: Number,
            required: [true, 'By number of users can not be empty'],
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