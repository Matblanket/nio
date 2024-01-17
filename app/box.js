import { motion } from "framer-motion"
import { createElement, useState } from "react"
export default function Box(props) {

	return (
		<>
			<motion.div
				animate={{ y: -props.tester }}
				transition={{ type: "linear", duration: 10 }} >
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
				position: 'absolute',
				top: `${data.t}px`,
				left: `${data.l}px`,
			}}>
			</img>
		</motion.div>)
}
