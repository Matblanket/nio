'use client';
import Box from '/app/ui/box';
import Sidebar from '/app/ui/sidebar';
import { useEffect, useState } from 'react';
import { Howl, Howler } from 'howler';
import Image from 'next/image';
//TODO
//
// finish sidebar with click integration 
//
//TODO

export default function Home() {
	const [lift, setLift] = useState(0)
	const [sidebar, setSidebar] = useState(false)
	const [movie, setMovie] = useState(false)
	const [pagemap, setPageMap] = useState({
		1: { sr: "/1.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		2: { sr: "/14.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		3: { sr: "/12.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
		4: { sr: "/13.jpg", size: { x: 1066, y: 1600 }, anistate: { display: true } },
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
	})

	const focus = (page, x, y) => {
		let yprevpage = 0
		Object.keys(pagemap).sort().forEach((i) => {
			if (i < page) {
				yprevpage += pagemap[i].size.y
			}
		})
		setAppstate(prevAppstate => ({ ...prevAppstate, position: { "x": 533 - x, "y": -yprevpage + window.innerHeight / 2 - y } }))
	}

	const realign = () => {
		setAppstate(prevAppstate => ({ ...prevAppstate, position: { ...prevAppstate.position, "x": 0 } }))
	}

	const [soundlist, setSoundlist] = useState({
		1: {
			src: ["stunned_intro.mp3"]
		},
		2: () => {
			focus(1, 0, 0)
		},
		3: () => {
			focus(2, 0, 0)
		},
		4: () => {
			focus(3, 0, 0)
		},
		5: () => {
			realign()
		},
		7: () => {
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

	useEffect(() => {
		if (soundlist[lift] != undefined && typeof soundlist[lift] !== 'function') {
			setSoundlist(prevsound => {
				prevsound[lift].player = new Howl(soundlist[lift])
				prevsound[lift].player.play()
				return prevsound
			})
		}
		else if (typeof soundlist[lift] === 'function') {
			soundlist[lift]()
		}
	}, [lift])


	return (
		<>
		<button type="button" onClick={() => { setSidebar(true) }} className=' absolute bottom-0 right-0'>
				<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
</svg>
			</button >
			<Sidebar class="absolute left-0 h-screen" steps={soundlist} sidebar={sidebar} setsidebar={setSidebar} setLift={setLift} />
			<div class='flex justify-center h-screen'>
				<Box tester={lift} url={pagemap} appstate={appstate} />
				<div className='top-2'>{lift}</div>
				<button onClick={() => setLift(lift + 1)} class="absolute bottom-0">down</button>
				<button onClick={() => setLift(lift != 0 ? lift - 1 : 0)} class="absolute top-0">up</button>
				<button onClick={() => setMovie(movie != true ? true : false)} class="absolute top-0 right-0">movietime</button>
			</div>

		</>
	)
}
