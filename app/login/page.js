"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/router"
import { Axios } from "axios"

export default function SignupPage() {
	const [user, setUser] = useState({ email: "", password: "" })
	const onlogin = async () => { }
	return (
		<>
			<div>login{user.username}{user.password}{user.email}</div>
			<label>email</label>
			<input id="email"
				value={user.email}
				type="email"
				onChange={(txt) => setUser({ ...user, email: txt.target.value })}
				placeholders="email" />
			<label>password</label>
			<input id="password"
				value={user.password}
				type="password"
				onChange={(txt) => setUser({ ...user, password: txt.target.value })}
				placeholders="email" />
			<button onClick={onlogin}>Login</button>

		</>
	)
}
