import { connect } from "/app/dbfiles/db"
import User from "/app/dbfiles/models/userModel"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"

connect()

export async function POST(request) {
	try {
		const reqBody = await request.json()
		const { username, email, password } = reqBody

		const user = await User.findOne({ email })
		if (user) {
			return NextResponse.json({ error: "User there already" }, { status: 400 })
		}
		const salt = await bcryptjs.genSalt(10)
		const hashed = await bcryptjs.hash(password, salt)
		const newUser = await new User({ username, email, password: hashed }).save()

		return NextResponse.json({ message: "created user", success: true, newUser })
	}
	catch (error) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}
}
