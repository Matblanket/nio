'use client'
import { useState } from "react";
import gifElementFactory from "../creator/ui/page"

export default function testPage() {
	const [masterState, setMasterState] = useState(
		{ allowPlacing: true }
	)
	const [tempComponent, setTempComponent] = useState("he")
	const [tempCoords, setTempCoords] = useState({ x: 0, y: 0 })
	const handleViewportClick = (event) => {
		if (masterState.allowPlacing) {
			const x = event.clientX
			const y = event.clientY
			setTempCoords({ x: x, y: y })
		}
	}
	const temp = gifElementFactory()

	const f = () => {
		setTempComponent(temp)
	}
	return (
		<>
			<div className="absolute right-0">
				<button onClick={() => { setComponentPlacing(!masterState.allowPlacing) }}>here</button>
				<input name="componentname" onChange={(e) => { setTempComponent(e.target.value) }} />
				<button onClick={()=>{f()}}>fetch component</button>
			</div>
			<div onClick={handleViewportClick} className="h-screen w-screen max-h-full max-w-full">
				<div className="absolute w-96 border-red-500 border-dashed border-2" style={{ left: tempCoords.x, top: tempCoords.y }}>
					{temp.jsx("yellow")}
					{temp.jsx("yellow")}
				</div>
			</div>
		</>
	)
}
