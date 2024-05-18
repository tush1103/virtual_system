import { hashPassword, comparePassword } from '../helper/authHelper'
import userModel from '../models/user.model'

export const registerContoller = async (req, res) => {
  try {
    const { name, email, password, birthdate } = req.body
    if (!name) {
      return res.send({ error: 'Name is required' })
    }
    if (!email) {
      return res.send({ error: 'Email is required' })
    }
    if (!password) {
      return res.send({ error: 'Password is required' })
    }

    //checking existing user
    const existingUser = await userModel.findOne({ email })
    if (existingUser) {
      return res
        .status(200)
        .send({ success: false, message: 'User already exists,please login' })
    }

    //register user
    const hashedPassword = await hashPassword(password)

    //save user in db
    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      birthdate
    }).save()

    res.status(201).send({
      success: true,
      message: 'User registered successfully',
      user
    })
  } catch (err) {
    console.log(err)
    res
      .status(500)
      .send({ success: false, message: 'Error in registration', error: err })
  }
}

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res
        .status(404)
        .send({ success: false, message: 'Email or password is required' })
    }
    //check if user registered or not
    const user = userModel.findOne({ email })
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: 'User does not exist' })
    }

    //check if password is correct or not
    const isMatch = await comparePassword(password, user.password)
    if (!isMatch) {
      return res
        .status(200)
        .send({ success: false, message: 'Incorrect password' })
    }
  } catch (err) {}
}