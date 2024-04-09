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
<div class="flex">
    <div class="h-screen w-2/3 bg-cover" style={{backgroundImage: "url(/loginimg.jpg)"}}></div>

    <div class="h-screen flex items-center justify-center w-full">
        <div class="max-w-md p-8 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-lg shadow-lg">
            <h2 class="text-3xl font-semibold text-gray-800 mb-8">Create an Account</h2>
            <div class="mb-4">Sign Up</div>
            <label for="username" class="block mb-2">Username</label>
            <input id="username"
                class="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                type="text"
                onChange={(txt) => setUser({ ...user, username: txt.target.value })}
                placeholder="Enter your username" />
            <label for="email" class="block mb-2 mt-4">Email</label>
            <input id="email"
                class="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                type="email"
                onChange={(txt) => setUser({ ...user, email: txt.target.value })}
                placeholder="Enter your email" />
            <label for="password" class="block mb-2 mt-4">Password</label>
            <input id="password"
                class="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                type="password"
                onChange={(txt) => setUser({ ...user, password: txt.target.value })}
                placeholder="Enter your password" />
            <button class="mt-6 bg-yellow-500 text-white py-2 px-6 rounded-full hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105" onClick={onsignup}>Sign Up</button>
            <p class="mt-4 text-gray-700">Already have an account? <Link href="/login" class="text-yellow-500 hover:underline">Login</Link></p>
        </div>
    </div>
</div>
	)
}
//		<>
//			<label>email</label>
//			<input id="email"
//				value={user.email}
//				type="email"
//				onChange={(txt) => setUser({ ...user, email: txt.target.value })}
//				placeholders="email" />
//			<label>username</label>
//			<input id="username"
//				value={user.username}
//				type="text"
//				onChange={(txt) => setUser({ ...user, username: txt.target.value })}
//				placeholders="username" />
//			<label>password</label>
//			<input id="password"
//				value={user.password}
//				type="password"
//				onChange={(txt) => setUser({ ...user, password: txt.target.value })}
//				placeholders="email" />
//			<button onClick={onsignup}>Signup</button>
//		</>
