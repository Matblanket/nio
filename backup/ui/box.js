'use client'
import { motion } from "framer-motion"
export default function Box(props) {

	return (
		<div className="flex justify-center w-screen">
			<motion.div
				animate={{ 
					x: props.appstate.position.x, 
					y: props.appstate.position.y,
					scale: props.appstate.scale,

				}}
				transition={{ type: props.appstate.transitiontype, duration: props.appstate.transitionduration }} 
				className="object-contain">
				{Listofimg(props.pagemap)}
			</motion.div>
		</div>
	)
}

function Listofimg(ele) {
	return (
		<>
			{Array.from(Object.keys(ele), (x) => {
				return createImage(ele[x])
			})}
		</>)
}

function createImage(data) {
	const variants = {
		closed: { opacity: 0, },
		open: { opacity: 1, },
	}
	return (
		<motion.div animate={data.anistate.display ? "open" : "closed"}
			variants={variants} style={{height: data.size.y}}
			className="w-screen justify-center">
			<img src={data.sr} alt="missing" className="object-cover m-auto">
			</img>
		</motion.div>)
}
