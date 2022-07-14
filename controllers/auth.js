const path = require("path");
const User = require(path.resolve('./models/User'));
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


module.exports.signup = (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        // console.log(req.body)
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    User.findOne({ email })
        .then(user => {
            if (user) return res.status(400).json({ msg: 'User already exists' });

            const newUser = new User({ name, email, password });

            // Create salt and hash
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {
                            const token = jwt.sign({ id: user._id },
                                process.env.jwtsecret,
                                { expiresIn: 3600000 })
                            const refreshToken = jwt.sign({ id: user._id },
                                process.env.jwtsecret,
                                { expiresIn: 24*3600000 })
                                res.cookie('token', token, {
                                    expires: new Date(Date.now() + 3600000),
                                    path: '/',
                                    httpOnly: true,
                                    secure: true,
                                    sameSite: 'none'
                                    }
                                )
                                res.cookie('refreshtoken', refreshToken, {
                                    expires: new Date(Date.now() + 24*3600000),
                                    path: '/',
                                    httpOnly: true,
                                    secure: true,
                                    sameSite: 'none'
                                    }
                                )
                                res.json(name)
                               
                        });
                })
            })
        })
}

module.exports.login = async (req, res) => {
    // console.log("here")
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ msg: 'Please enter all fields' });
    }
    User.findOne({ email })
        .then(user => {
            if (!user) return res.status(400).json({ msg: 'User does not exist' });

            // Validate password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

                    const token = jwt.sign({ id: user._id },
                        process.env.jwtsecret,
                        { expiresIn: 3600000 })
                    const refreshToken = jwt.sign({ id: user._id },
                        process.env.jwtsecret,
                        { expiresIn: 3600000*24 })

                        res.cookie('token', token, {
                            expires: new Date(Date.now() + 3600000),
                            path: '/',
                            httpOnly: true,
                            secure: true,
                            sameSite: 'none'
                            }
                        )
                        res.cookie('refreshtoken', refreshToken, {
                            expires: new Date(Date.now() + 24*3600000),
                            path: '/',
                            httpOnly: true,
                            secure: true,
                            sameSite: 'none'
                            }
                        )
                        res.json(user.name)
                    
                })
        })
}

module.exports.get_user = (req, res) => {
    
    User.findById(req.user.id)
        .select('-password')
        .then(user => {
            const token = jwt.sign({ id: user._id },
                process.env.jwtsecret,
                { expiresIn: 3600000 })
            res.cookie('token', token, {
                expires: new Date(Date.now() + 3600000),
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'none'
                }
            )
            res.json(user.name)
        });
}
module.exports.logout = (req, res)=>{
    const token=req.cookies.token
    if(!token) return res.json("Logged Out")

    res.cookie('token', '', {
        expires: new Date(Date.now() + 1),
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'none'
        }
    )
    res.cookie('refreshtoken', '', {
        expires: new Date(Date.now() + 1),
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'none'
        }
    )
    res.json("Logged Out")
}