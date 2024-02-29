'use client'
import { motion } from "framer-motion"
export default function Box(props) {

	return (
		<>
			<motion.div
				animate={{ 
					x: props.appstate.position.x, 
					y: props.appstate.position.y,
					scale: props.appstate.scale,

				}}
				transition={{ type: "spring", duration: 2 }} >
				{Listofimg(props.url)}
			</motion.div>
		</>
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
			variants={variants}>
			<img src={data.sr} alt="missing" style={{
				top: `${data.t}px`,
				left: `${data.l}px`,
			}}>
			</img>
		</motion.div>)
}
