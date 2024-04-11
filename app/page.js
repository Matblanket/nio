'use client';
import Box from '/app/ui/box';
import Sidebar from '/app/ui/sidebar';
import { useEffect, useState, useRef } from 'react';
import { Howl, Howler } from 'howler';
import Image from 'next/image';
import axios from 'axios';

export default function Home() {
	const [lift, setLift] = useState(0)
	const [sidebar, setSidebar] = useState(false)
	const [movie, setMovie] = useState(false)
	const workIterator = useRef(0)
	const [work, setWork] = useState([
		{ "workType": "focusToB", "atTime": "1", "duration": "1", "position": { "x": 897.2358294760566, "y": 984.0312010876141 }, "page": "0" },
		{ "workType": "focusToB", "atTime": "3", "duration": "3", "position": { "x": 1049.537985287812, "y": 9.303088838033993 }, "page": "0" },
		{ "workType": "playMusic", "duration": 10, "position": { "x": 0, "y": 0 }, "page": 2, "filename": "monotone.mp3", "atTime": "4" }
	])
	const [iter,setIter] = useState()
	const [iterList,setIterList] = useState({})

	var soundDict = {
	}
	const [pagemap, setPageMap] = useState({
		1: { sr: "/1.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		2: { sr: "/2.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		3: { sr: "/3.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		4: { sr: "/4.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		5: { sr: "/5.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		6: { sr: "/6.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		7: { sr: "/7.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		8: { sr: "/8.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		9: { sr: "/9.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		10: { sr: "/10.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		11: { sr: "/11.jpg", size: { x: 2133, y: 1600 }, anistate: { display: true } },
		12: { sr: "/12.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		13: { sr: "/13.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		14: { sr: "/14.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		15: { sr: "/15.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		16: { sr: "/16.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		17: { sr: "/17.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		18: { sr: "/18.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		19: { sr: "/19.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		20: { sr: "/20.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		21: { sr: "/21.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		22: { sr: "/22.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		23: { sr: "/23.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		24: { sr: "/24.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		25: { sr: "/25.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		26: { sr: "/26.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		27: { sr: "/27.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		28: { sr: "/28.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		29: { sr: "/29.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		30: { sr: "/30.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		31: { sr: "/31.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		32: { sr: "/32.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		33: { sr: "/33.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		34: { sr: "/34.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		35: { sr: "/35.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		36: { sr: "/36.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		37: { sr: "/37.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		38: { sr: "/38.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		39: { sr: "/39.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		40: { sr: "/40.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		41: { sr: "/41.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		42: { sr: "/42.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		43: { sr: "/43.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		44: { sr: "/44.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		45: { sr: "/45.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		46: { sr: "/46.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		47: { sr: "/47.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		48: { sr: "/48.jpg", size: { x: 2133, y: 1600 }, anistate: { display: true } },
		49: { sr: "/49.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		50: { sr: "/50.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		51: { sr: "/51.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		52: { sr: "/52.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		53: { sr: "/53.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		54: { sr: "/54.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		55: { sr: "/55.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		56: { sr: "/56.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		57: { sr: "/57.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		58: { sr: "/58.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		59: { sr: "/59.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		60: { sr: "/60.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		61: { sr: "/61.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		62: { sr: "/62.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		63: { sr: "/63.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		64: { sr: "/64.jpg", size: { x: 2133, y: 1600 }, anistate: { display: true } },
		65: { sr: "/65.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		66: { sr: "/66.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		67: { sr: "/67.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
	})
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
		"transitionduration": 1
	})

	const focuscoordtomiddle = (page, A, duration) => {
		let yprevpage = 0
		Object.keys(pagemap).sort().forEach((i) => {
			if (i < page) {
				yprevpage += pagemap[i].size.y
			}
		})
		setAppstate(prevAppstate => ({ ...prevAppstate, position: { "x": 533 - A.x, "y": -yprevpage + window.innerHeight / 2 - A.y }, transitionduration: duration }))
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
					soundDict[currwork.filename] = {
						player: new Howl({ src: currwork.filename })
					}
					console.log(soundDict)
					soundDict[currwork.filename].player.play()
					break
				}
			}
		}
		if (soundlist[lift] != undefined && typeof soundlist[lift] !== 'function') {
			setSoundlist(prevsound => {
				prevsound[lift].player = new Howl(soundlist[lift])
				prevsound[lift].player.play()
				return prevsound
			})
		}
		else if (typeof soundlist[lift] === 'function') {
			//soundlist[lift]()
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
	useEffect(()=>{getBook()},[])
	return (
		<>
			<div class='flex justify-center h-screen w-screen'>
				<div className="fixed top-0 left-0 p-4">
					<div className="bg-gray-800 p-1 rounded-lg shadow-md">
						<input onChange={(e)=>{setIter(e.target.value)}} />
						<button className="bg-gray-600 hover:bg-gray-700 text-white font-bold p-2 m-2 rounded" onClick={()=>{
							console.log(iterList)
							setWork(iterList[iter])
							setMovie(false)
							setLift(0)
							}
							}>Fetch Iteration</button>
						<div className='w-7'>
						{JSON.stringify(work)}
						</div>
					</div>
				</div>
				<Box tester={lift} pagemap={pagemap} appstate={appstate} />
				<button onClick={() => setLift(lift + 1)} className="absolute bottom-0">down</button>
				<button onClick={() => setLift(lift != 0 ? lift - 1 : 0)} className="absolute top-0">up</button>
				<button onClick={() => setMovie(movie != true ? true : false)} className="absolute top-0 right-0">movietime</button>
			</div>

		</>
	)
}
