import { motion } from "framer-motion"
import hljs from 'highlight.js';
import 'highlight.js/styles/srcery.css'
export default function Sidebar(props) {
	const variants = {
		visible: { transform: "translateX(0%)", },
		hidden: { transform: "translateX(-100%)", opacity: 0, },
	}
	return (
		<>
			<motion.div className="fixed top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto bg-white dark:bg-gray-800" animate={props.sidebar ? "visible" : "hidden"} variants={variants}>
				<h5 className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">Menu</h5>
				<button type="button" onClick={() => { props.setsidebar(false) }} class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" >
					<svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
					<span class="sr-only">Close menu</span>
				</button>
				<div class="py-4 overflow-y-auto">
					<ul class="space-y-2 font-medium">
						{Object.keys(props.steps).map((value,index) => ( 
						<li className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group" onClick={() => {props.setLift(value)}}>
							{stepdraw(props.steps[value])}
						</li>
							)
						)}
					</ul>
				</div>
			</motion.div>
		</>
	)
}

function stepdraw(item) {

	let highlightedCode = ""
	if (typeof item == "function") {
		highlightedCode = hljs.highlight(
			item.toString(),
			{ language: 'javascript' }
		).value
	}
	else {
		highlightedCode = hljs.highlight(
			"Play:'" + item.src + "'",
			{ language: 'javascript' }
		).value
	}
	return (
		<button dangerouslySetInnerHTML={{ __html: highlightedCode }} />
	)
}
