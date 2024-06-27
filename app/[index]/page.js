'use client';
import Box from '../ui/box'
import { useEffect, useState, useRef } from 'react';
import { Howl, Howler } from 'howler';
import axios from 'axios';
import gifElementFactory from '../creator/ui/page';
import { motion } from 'framer-motion';

export default function reader({ params }) {
	const [lift, setLift] = useState(0)
	const [movie, setMovie] = useState(false)
	const workIterator = useRef(0)
	const [work, setWork] = useState([
		{ "workType": "focusToB", "atTime": "1", "duration": "1", "position": { "x": 0, "y": 984.0312010876141 }, "page": "0" },
		{ "workType": "focusToB", "atTime": "3", "duration": "3", "position": { "x": 1049.537985287812, "y": 0 }, "page": "1" },
		{ "workType": "playMusic", "duration": 10, "position": { "x": 0, "y": 0 }, "page": 2, "filename": "monotone.mp3", "atTime": "4" },
		{ "workType": "playMusic", "duration": 10, "position": { "x": 0, "y": 0 }, "page": 2, "filename": "monotone.mp3", "atTime": "8" }
	])
	const [iter, setIter] = useState()
	const [iterList, setIterList] = useState({})
	const [componentList, setComponentList] = useState(
		[
			{
				"yellow": {
					"component": {
					},
					"metadata": {
						"width": "3960px",
						"height": "3000px",
						"position": {
							"x": 1038,
							"y": 722
						},
						"creatorPosition": {
							"x": 1038,
							"y": 722
						},
						"page": 0,
						"render": 0
					},
					"routine": [
						[
							{
								"job": "changePosition",
								"target": "testimage1",
								"newPosition": {
									"x": 10,
									"y": 10
								}
							},
							{
								"job": "draw",
								"target": "testimage2"
							}
						],
						[
							{
								"job": "changePosition",
								"target": "testimage2",
								"newPosition": {
									"x": 0,
									"y": 20
								}
							},
							{
								"job": "disableDraw",
								"target": "testimage2"
							}
						]
					]
				}
			}
		]
	)

	const soundDict = useRef({
	})
	const [pagemap, setPageMap] = useState(
		[{ picture: '/1.jpg', size: { x: 1066, y: 1600 } }, { picture: '/2.jpg', size: { x: 1066, y: 1600 } }])
	const visible = (id) => {
		setPageMap(prevState => ({
			...prevState, [id]: { ...prevState[id], anistate: { display: true } }
		}))
	}
	const invisible = (id) => {
		setPageMap(prevState => ({
			...prevState, [id]: { ...prevState[id], anistate: { display: false } }
		}))
	}
	const [appstate, setAppstate] = useState({
		"position": { "x": 0, "y": 0 },
		"scale": 1,
		"transitiontype": "linear",
		"transitionduration": 1,
		"currentPage": 0
	})
	useEffect(() => { console.log(appstate) }, [appstate])

	const focuscoordtomiddle = (page, A, duration) => {
		let yprevpage = 0
		pagemap.forEach((value, index) => {
			if (index < page) {
				yprevpage += value.size.y
			}
		})
		setAppstate(prevAppstate => ({ ...prevAppstate, position: { "x": 533 - A.x, "y": -yprevpage + window.innerHeight / 2 - A.y }, transitionduration: duration, currentPage: page }))
	}

	const realign = () => {
		setAppstate(prevAppstate => ({ ...prevAppstate, position: { ...prevAppstate.position, "x": 0 } }))
	}

	const [soundlist, setSoundlist] = useState({
		1: () => {
			//visible(1)
		},
		3: () => {
			//focuscoordtomiddle(1, { x: 533, y: 1100 }, 5)
		},
		8: () => {
			//focuscoordtomiddle(2, 533, 600, 2)
		},
		5: () => {
			//realign()
		},
		6: () => {
			//setAppstate(prevAppstate => ({ ...prevAppstate, scale: 0.4 }))
		},
		7: () => {
			//setAppstate(prevAppstate => ({ ...prevAppstate, scale: 2 }))
		},
		9400: {
			src: ["kousei crying.mp3"],
			loop: true
		},
		10500: {
			onplay: () => {
				soundlist[9400].player.stop()
			},
			src: ["playground.mp3"],
			loop: true,
			volume: 0.6
		},
		12800: {
			src: ["d1-16baseball.mp3"],
			volume: 0.4
		},
		11400: {
			src: ["baseballbat.mp3"]
		},
		12700: {
			src: ["glassshatter.wav"]
		},
		20200: () => {
			soundlist[10500].player.fade(0.6, 0, 5000)
		},
		21200: {
			src: ["whoosh.wav"],
			volume: 0.5
		},
		23100: () => {
			soundlist[10500].player.fade(0, 0.2, 3000)
		},
		24800: () => {
			soundlist[10500].player.fade(0.2, 0, 3000)
		},
		25000: {
			src: ["04. Yuuguredoki no Gekou.mp3"],
			volume: 0.3
		},
		32900: {
			src: ["steps.wav"],
			loop: true
		},
		39400: {
			src: ["monotone.mp3"]
		}
	})


	useEffect(() => {
		let scrolljob;
		if (movie) {
			scrolljob = setInterval(() => { setLift((prevTest) => prevTest + 1) }, 1000)
		}
		return () => clearInterval(scrolljob)
	}, [movie])

	const prepForNextWork = () => {
		if (workIterator.current < work.length - 1) {
			workIterator.current += 1
		}
	}

	useEffect(() => {
		var currwork = work[workIterator.current]
		if (lift == currwork.atTime) {
			switch (currwork.workType) {
				case "focusToB": {
					focuscoordtomiddle(currwork.page, currwork.position, currwork.duration)
					prepForNextWork()
					break
				}
				case "playMusic": {
					soundDict.current[currwork.filename] = {
						player: new Howl({ src: currwork.filename })
					}
					soundDict.current[currwork.filename].player.play()
					prepForNextWork()
					break
				}
			}
		}
	}, [lift])

	//<Sidebar class="absolute left-0 h-screen" steps={soundlist} sidebar={sidebar} setsidebar={setSidebar} setLift={setLift} />
	//<button type="button" onClick={() => { setSidebar(true) }} className=' absolute top-0 left-0'>
	//	<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	//		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
	//	</svg>
	//</button >

	const getBook = () => {
		axios.get('http://localhost:5000/read')
			.then(response => {
				console.log('Response:', response.data);
				setIterList(response.data)
			})
			.catch(error => {
				console.error('Error:', error);
			});
	}
	useEffect(() => { getBook() }, [])
	useEffect(() => { console.log(pagemap) }, [pagemap])

	const drawComponent = (componentname) => {
		if (componentList[0][componentname] != undefined) {
			const componentSel = componentList[0][componentname]
			return (
				<div style={{ left: componentSel.metadata.position.x, top: componentSel.metadata.position.y, position: 'absolute', width: componentSel.metadata.width }}>
					{Object.keys(componentSel.component).map((imgName) => {
						return (componentSel.component[imgName].render &&
							(<img src={componentSel.component[imgName].src}
								style={{ left: componentSel.component[imgName].position.x, top: componentSel.component[imgName].position.y, }}
								className='' />))
					})}
				</div>
			)
		}
	}

	return (
		<>
			<div class='flex justify-center h-screen w-screen max-h-full'>
				<div className="fixed top-0 left-0 p-4">
					<div className="bg-gray-800 p-1 rounded-lg shadow-md z-10">
						<input onChange={(e) => { setIter(e.target.value) }} />
						<button className="bg-gray-600 hover:bg-gray-700 text-white font-bold p-2 m-2 rounded" onClick={() => {
							setWork(iterList[iter][0])
							setPageMap(iterList[iter][1])
							setComponentList(iterList[iter][2])
							setMovie(false)
							setLift(0)
						}
						}>Fetch Iteration</button>
						<div className='w-7'>
							{JSON.stringify()}
							<br />
							{lift}
						</div>
					</div>
				</div>
				<div className="flex justify-center w-screen">
					<div className="relative">
						<motion.div
							animate={{
								x: appstate.position.x * appstate.scale,
								y: appstate.position.y * appstate.scale,

							}}
							transition={{ type: appstate.transitiontype, duration: appstate.transitionduration }}
							className="object-contain">
							<Box componentList={componentList} tester={lift} pagemap={pagemap} appstate={appstate} />
							{drawComponent("yellow")}
							{drawComponent("red")}
							{drawComponent("green")}
						</motion.div>
					</div>
				</div>
				<button onClick={() => setLift(lift + 1)} className="absolute bottom-0">down</button>
				<button onClick={() => setLift(lift != 0 ? lift - 1 : 0)} className="absolute top-0">up</button>
				<button onClick={() => setMovie(movie != true ? true : false)} className="absolute top-0 right-0">movietime</button>
			</div>
		</>
	)
}
