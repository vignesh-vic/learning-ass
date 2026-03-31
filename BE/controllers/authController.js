import User  from '../models/User.js'

function generateToken(id) {
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
        throw new Error('JWT secret key is not defined in environment variables');
    }

    const options = {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    };

    const token = jwt.sign({ id }, secretKey, options);
    return token;
}


export const register = async (req, res, next) => {

    try {

        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const userExists = await User.findOne({ email });


        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        const token = generateToken(user._id);

        if (user) {
            res.status(201).json({
                success: true,
                data: {
                    _id: user._id,
                    username: user.name,
                    email: user.email,
                    profileImage: user.profileImage,
                    createdAt: user.createdAt,
                },
                token,
                message: 'User registered successfully'
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });

        }
    }
    catch (error) {
        next(error)

    }

}

export const login = (req, res, next) => {

    try {



    } catch (error) {
        next(error)

    }

}


export const getProfile = (req, res, next) => {

    try {



    } catch (error) {
        next(error)

    }

}


export const updateProfile = (req, res, next) => {

    try {
    } catch (error) {
        next(error)
    }
}


export const changePassword = (req, res, next) => {

    try {
    } catch (error) {
        next(error)
    }
}