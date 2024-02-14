"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/router"
import axios from "axios"

export default function SignupPage() {
	const [user, setUser] = useState({ email: "", password: "", username: "", })
	const onsignup = async () => {
		try { axios.post("/api/users/signup", user) }
		catch (error) { console.log(error) }
	}
	return (
		<>
			<label>email</label>
			<input id="email"
				value={user.email}
				type="email"
				onChange={(txt) => setUser({ ...user, email: txt.target.value })}
				placeholders="email" />
			<label>username</label>
			<input id="username"
				value={user.username}
				type="text"
				onChange={(txt) => setUser({ ...user, username: txt.target.value })}
				placeholders="username" />
			<label>password</label>
			<input id="password"
				value={user.password}
				type="password"
				onChange={(txt) => setUser({ ...user, password: txt.target.value })}
				placeholders="email" />
			<button onClick={onsignup}>Signup</button>
		</>
	)
}
