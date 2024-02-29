import mongoose from "mongoose";

export async function connect() {
	try{
		await mongoose.connect(process.env.DB_CONN)
		const connection = mongoose.connection
		connection.on('error', (err) =>{
			console.log('Error at Mongoconnect',err)
		})
		connection.on('connected', () =>{
			console.log('Mongodb sucessfully connected')
		})
	}catch (error){
		console.log("Uve missed something")
		console.log(error)
	}
}
