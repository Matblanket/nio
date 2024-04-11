"use client"

import { useState } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import Link from "next/link"

export default function LoginPage() {
	const [user, setUser] = useState({ username: "", password: "" })
	const [status, setStatus] = useState("Welcome Back!")
	const onlogin = async () => {
		try {
			setStatus("...Loading")
			var a = await axios.post("/api/users/login", user)
			setStatus("Redirecting")
		}
		catch (error) {
			setStatus("Authentication failed")
			console.log(error)
		}
	}
	return (
	
<div class="flex">
    <div class="h-screen w-2/3 bg-cover" style={{backgroundImage: "url(/loginimg.jpg)"}}></div>

    <div class="h-screen flex items-center justify-center w-full">
        <div class="max-w-md p-8 bg-gradient-to-b from-sky-200 to-sky-300 rounded-lg shadow-lg">
            <h2 class="text-3xl font-semibold text-gray-800 mb-8">{status}</h2>
            <div class="mb-4">Login</div>
            <label for="username" class="block mb-2">Username</label>
            <input id="username"
                class="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                type="text"
                onChange={(txt) => setUser({ ...user, username: txt.target.value })}
                placeholder="Enter your username" />
            <label for="password" class="block mb-2 mt-4">Password</label>
            <input id="password"
                class="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                type="password"
                onChange={(txt) => setUser({ ...user, password: txt.target.value })}
                placeholder="Enter your password" />
            <button class="mt-6 bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105" onClick={onlogin}>Login</button>
            <p class="mt-4 text-gray-700">Don't have an account? <Link href="/signup" class="text-blue-500 hover:underline">Sign Up</Link></p>
        </div>
    </div>
</div>
	)
}
