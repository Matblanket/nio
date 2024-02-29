import { connect } from "/app/dbfiles/db"
import User from "/app/dbfiles/models/userModel"
import { NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

connect()

export async function POST(request) {
	try {
		const reqBody = await request.json()
		const { username, password } = reqBody
		//console.log(reqBody)

		const user = await User.findOne({ username })
		console.log(user)
		if (user == null) {
			console.log("here")
			return NextResponse.json({ error: "unregistered user " }, { status: 402 })
		}
		const validPass = await bcryptjs.compare(password, user.password)
		//console.log(validPass)
		if (!validPass) {
			return NextResponse.json({ error: "Invalid password" }, { status: 402 })
		}
		const tokendata = {
			id: user._id,
			username: user.username,
			email: user.email
		}

		const token = jwt.sign(tokendata, process.env.JWT_SECRET_KEY, 
			{ expiresIn: "1h" })
		//console.log("here")
		const response = NextResponse.json({
			message: "login done",
			success: true,
		})
		response.cookies.set("token", token, { httpOnly: true, })
		return response;
	}
	catch (error) {
		return NextResponse.json({ error: "why did this"}, { status: 500 })
	}
}
