'use client'
import { useRef, useState } from "react"
const routineIterator = (setMasterState,routine,routineIter) => {
	const currJob = testroutine.current[iter.current]
	currJob.forEach((work) => {
		if (work.job == "changePosition") {
			setMasterState((prev) => {
				console.log(work.target)
				return { ...prev, [work.target]: { ...prev[work.target], position: work.newPosition } }
			})
		}
		else if (work.job == "draw") {
			setMasterState((prev) => ({ ...prev, [work.target]: { ...prev[work.target], render: true } }))
		}
		else if (work.job == "disableDraw") {
			setMasterState((prev) => ({ ...prev, [work.target]: { ...prev[work.target], render: false } }))
		}
	})

	iter.current = iter.current + 1
	if (iter.current == testroutine.current.length) {
		iter.current = 0
	}
}

const a = {
	iterator: routineIterator,
	jsx: (componentname) => (
		<>
			{Object.keys(masterState[componentname]).map((imgName) => {
				return (masterState[componentname][imgName].render && (<img src={masterState[componentname][imgName].src} style={{ left: masterState[componentname][imgName].position.x, top: masterState[componentname][imgName].position.y, }} className="object-cover absolute" />))
			})}
		</>
	)
}

export default routineIterator;


// masterState all elem details
// steps that define masterstate changes
// reactive workflow that draws accordingly
// interface for iterating on steps
//
//
//
//
//
