const userModel = require("../model/models")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const signUp = async (req, res)=> {
    try {
        const { fullName, email, password } = req.body
// check if t he user is already existing
        const userExist = await userModel.findOne({email})

        if (userExist) {
            return res.status(400).json({
                message: `user with this email already exists`
            })
        }

        const salt = bcrypt.genSaltSync(12)
        const hash = bcrypt.hashSync(password, salt)

        const user = await userModel.create({
            fullName,
            email, 
            password: hash
        })

        res.status(201).json({
            message: `User successfully created`,
            user
        })
    } catch (error) {
        error: error.message
    }
}

const logIn = async (req, res)=> {
    try {
        const { email, password }= req.body
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).json({
                message: `user not found`
            })
        }
        const checkPassword = bcrypt.compareSync(password, user.password)

        if (!checkPassword) {
            return res.status(400).json({
                message: `Invalid password`
            })
        };

        const token = jwt.sign({
            userId: user._id,
            email: user.email,
        }, process.env.jsonSecret, {expiresIn: "1d"})

        res.status(200).json({
            message: `Login Successful`,
            token,
            user
        })
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const updateUser = async (req, res) => {
    try {
        const id = req.params.id
        const vivi = await userModel.findById(id)

        const updatedScore = {...vivi.score, ...req.body.score}
        const data ={ 
            fullName: req.body.fullName,
            score: updatedScore,
        } 

        const user = await userModel.findByIdAndUpdate(id, data, {new: true})
        if (!user) {
            return res.status(404).json({
                message: `User does not exist`
            })
        }
        return res.status(201).json({
            message: `user updated`,
            userId:user._id
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

}

const logOut = async (req, res) => {

    try {
        const authoRize = req.headers.authorization

        const token = authoRize.split(" ")[1]

        const id = req.user.userId

        //go into the database
        const user = await userModel.findById(id)
        //check 
        if (!user) {
            return res.status(404).json({
                message: `user not found`
            })
        }
        // Add the token to the blacklist array
        user.blackList.push(token)
        await user.save()

        res.status(200).json({
            message: `Successfully logged out`
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    signUp,
    logIn,
    updateUser,
    logOut,
};




// try {
//     // Assuming the token is sent in the Authorization header
//     const token = req.headers.authorization;

//     if (!token) {
//         return res.status(401).json({
//             message: "Unauthorized: No token provided",
//         });
//     }

//     // You might want to add logic here to blacklist the token on the server if needed.

//     res.status(200).json({
//         message: 'User has been logged out.',
//     });
// } catch (error) {
//     res.status(500).json({
//         message: error.message,
//     });
// }