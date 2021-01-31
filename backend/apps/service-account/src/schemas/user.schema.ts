import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { IUser } from '../interfaces/user.interface';

const SALT_ROUNDS = 12;

function transformValue(doc, ret: { [key: string]: any }) {
    delete ret._id;
    delete ret.password;
}

export const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email can not be empty'],
            match: [
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Email should be valid',
            ],
        },
        is_confirmed: {
            type: Boolean,
            required: [true, 'Confirmed can not be empty'],
        },
        password: {
            type: String,
            required: [true, 'Password can not be empty'],
            minlength: [3, 'Password should include at least 6 chars'],
            //Bcrypt cannot handle a number of bytes that's why max 72 chars
            maxlength: [72, 'Password should not include more than 72 chars']
        },
        username: {
            type: String,
            required: [true, 'Username can not be empty'],
            trim: true
        },
        first_name: {
            type: String,
            //required: [true, 'First name can not be empty'],
            required: [false, ''],
            trim: true
        },
        last_name: {
            type: String,
            //required: [true, 'Last name can not be empty'],
            required: [false, ''],
            trim: true
        },
        description: {
            type: String,
            //required: [true, 'Description can not be empty'],
            required: [false, ''],
            maxlength: [1000, 'Description should not include more than 1000 chars'],
            trim: true
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
            //required: [true, 'Gender can not be empty'],
            required: [false, ''],
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            required: [true, 'Role can not be empty']
        },
        social_media: {
            type: {
                facebook: String,
                linkedin: String,
                twitter: String,
                tiktok: String,
                discord: String,
                instagram: String,
                youtube: String
            },
            required: [false],
        },
        interest: {
            type: Array,
            required: [false]
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

UserSchema.methods.getEncryptedPassword = (password: string) => {
    return bcrypt.hash(String(password), SALT_ROUNDS);
};

UserSchema.methods.compareEncryptedPassword = function (password: string) {
    return bcrypt.compare(password, this.password);
};

UserSchema.pre('save', async function (next) {
    const self = this as IUser;
    if (!this.isModified('password')) {
        return next();
    }
    self.password = await self.getEncryptedPassword(self.password);
    next();
});