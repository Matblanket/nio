'use client';
import Box from './box';
import { useEffect, useState } from 'react';
import { Howl, Howler } from 'howler';
import Image from 'next/image';

export default function Home() {
	const [lift, setLift] = useState(0)
	const [movie, setMovie] = useState(false)
	const [pagemap, setPageMap] = useState({
		1: { sr: "(0,0).png", l: 0, t: 0, anistate: { display: false } },
		2: { sr: "(0,500).png", l: 0, t: 500, anistate: { display: false } },
		3: { sr: "(500,500).png", l: 500, t: 500, anistate: { display: false } },
		4: { sr: "(0,1050).png", l: 0, t: 1050, anistate: { display: false } },
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

	const [soundlist, setSoundlist] = useState({
		//		100: {
		//			src: ["stunned_intro.mp3"]
		//		},
		200: () => {
			visible(1)
		},
		300: () => {
			visible(2)
		},
		400: () => {
			visible(3)
		},
		500: () => {
			visible(4)
		},
		7100: {
			src: ["stunned_intro.mp3"]
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
			scrolljob = setInterval(() => { setLift((prevTest) => prevTest + 100) }
				, 1000)
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
		<div style={{ width: 1066 }}>
			<Box class='w-full' tester={lift} url={pagemap} />
			<h1 class="absolute top-4">{lift}{movie ? "true" : "false"}</h1>
			<button onClick={() => setLift(lift + 100)} class="absolute bottom-0">down</button>
			<button onClick={() => setLift(lift + 1000)} class="absolute bottom-4">down1000</button>
			<button onClick={() => setLift(lift + 10000)} class="absolute bottom-8">down10000</button>
			<button onClick={() => setLift(lift != 0 ? lift - 100 : 0)} class="absolute top-0">up</button>
			<button onClick={() => setMovie(movie != true ? true : false)} class="absolute top-0 right-0">movietime</button>
		</div>
	)
}
