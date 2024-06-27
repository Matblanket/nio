'use client'
import { motion } from "framer-motion"
export default function Box(props) {

	return (
		<>
				{Listofimg(props.pagemap)}
		</>
	)
}

function Listofimg(ele) {
	return (
		<>
			{ele.map((x) => {
				return createImage(x)
			})}
		</>
	)
}

function createImage(data,) {
	const Img = (<img src={data.picture} alt="missing" className="w-auto h-auto object-fill m-auto">
			</img>)
	console.log(data)
	return (
		<div style={{height: data.size.y,width:data.size.x}}
			className="justify-center">
			{Img}
		</div>)
}
