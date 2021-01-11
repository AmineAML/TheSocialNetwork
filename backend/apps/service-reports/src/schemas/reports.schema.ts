import * as mongoose from 'mongoose';

function transformValue(doc, ret: { [key: string]: any }) {
    delete ret._id;
}

export const ReportSchema = new mongoose.Schema(
    {
        by_user_id: {
            type: String,
            required: [true, 'User id can not be empty']
        },
        reported_user_id: {
            type: String,
            required: [true, 'Reported user id can not be empty']
        },
        description: {
            type: String,
            required: [true, 'Description can not be empty']
        },
        status: {
            type: String,
            required: [true, 'Status can not be empty'],
            enum: ['opened', 'closed'],
            default: 'opened'
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