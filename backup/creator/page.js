'use client'
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const ImageWithClickCoordinates = () => {
	const [currImg, setCurrImg] = useState(0)
	const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
	const [enableCoordGetter, setEnableCoordGetter] = useState(false);
	const [popupContent, setPopupContent] = useState(null);
	const [work, setWork] = useState([])
	const workRef = useRef()
	const imgWinRef = useRef()
	const [crosshair, setCrosshair] = useState({ x: 0, y: 0, visible: 0 })
	const [panels, setPanels] = useState([[0, 0, 100, 100]])
	const [lastTime, setLastTime] = useState(0)
	const [projectName,setProjectName] = useState("")
	const stepState = useRef({
		workType: "focusToB",
		duration: 10,
		position: { x: 1000, y: 100 },
		page: 2,
	})
	const [panelList, setPanelList] = useState({})

	const [showPopup, setShowPopup] = useState(false);
	workRef.current = work
	const imgList = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg', '11.jpg', '12.jpg']

	const BoxDrawer = ({ panels, imgref }) => {
		var height = 0
		var width = 0
		var top = 0
		var left = 0
		return (
			<>
				{
					panels.map((panel) => {
						if (imgref.current) {
							width = (panel[2] - panel[0]) * (imgref.current.clientWidth / imgref.current.naturalWidth)
							height = (panel[3] - panel[1]) * (imgref.current.clientHeight / imgref.current.naturalHeight)
							left = panel[0] * (imgref.current.clientWidth / imgref.current.naturalWidth)
							top = panel[1] * (imgref.current.clientHeight / imgref.current.naturalHeight)
						}
						return (
							<div className='absolute border-4 border-red-600 border-dashed' style={{
								width: width,
								height: height,
								left: left,
								top: top,
								zIndex: 10,
							}} />
						)
					})
				}
			</>
		)
	}

	const handleImageClick = (event) => {
		if (enableCoordGetter) {
			const x = event.clientX
			const y = event.clientY
			setCrosshair({ x: x, y: y, visible: 1 })
			const boundingRect = event.target.getBoundingClientRect();
			const offsetX = (event.clientX - boundingRect.left) * (event.target.naturalWidth / boundingRect.width);
			const offsetY = (event.clientY - boundingRect.top) * (event.target.naturalHeight / boundingRect.height);
			setCoordinates({ x: offsetX, y: offsetY });
		}
	};


	const appendStep = () => {
		const temp = [...workRef.current]
		console.log(workRef.current)
		temp.sort((a, b) => a.atTime - b.atTime)
		//setWork(temp)
	}


	const handleChange = (e) => {
		const { name, value } = e.target
		stepState.current[name] = value
		console.log(stepState)
	};

	const resetStep = () => {
		stepState.current = {
			workType: "",
			duration: 0,
			position: { x: 0, y: 0 },
			page: 0,
			filename: "",
		}
		console.log("here")
	}
	useEffect(() => {
		stepState.current.position = coordinates
	}, [coordinates]);

	useEffect(() => {
		resetStep()
	}, [work]);

	useEffect(() => { console.log(stepState) }, [stepState])

	const focusRoutine = () => {
		setEnableCoordGetter(true);
		stepState.current.workType = 'focusToB'
		setPopupContent(
			<div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 z-50" style={{ width: '300px' }}>
				<div className="fixed inset-0 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg shadow-lg p-6 transform transition-transform translate-x-0 z-50" style={{ width: '400px' }}>
						<div className="flex justify-between">
							<h2 className="text-xl font-bold mb-4">Enter Data</h2>
							<button
								className='right-0 text-xl font-bold mb-4'
								onClick={() => {
									setEnableCoordGetter(false);
									setShowPopup(false)
								}}

							>X</button>
						</div>
						<div className="mb-4">
							<label htmlFor="page" className="block text-sm font-medium text-gray-700 mb-2">Start at:</label>
							<input
								type="number"
								id="atTime"
								name="atTime"
								placeholder={lastTime}
								onChange={handleChange}
								className="border rounded-md p-2 w-full"
							/>
						</div>
						<div className="mb-4">
							<label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">Duration:</label>
							<input
								type="number"
								id="duration"
								name="duration"
								onChange={handleChange}
								className="border rounded-md p-2 w-full"
							/>
						</div>
						<div className="flex justify-between">
							<button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => {
								stepState.current["page"]=currImg
								confirmStep();
								setEnableCoordGetter(false);
								setShowPopup(false);
								setCrosshair({ ...crosshair, visible: 0 })
								appendStep()
							}}>Confirm</button>
							{JSON.stringify(work)}
							<button type="button" className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => {
								setEnableCoordGetter(false);
								setShowPopup(false);
								setCrosshair({ ...crosshair, visible: 0 })
							}}>Cancel</button>
						</div>
					</div>
				</div>
			</div>

		);
		setShowPopup(true);
	};

	const musicRoutine = () => {
		stepState.current.workType = 'playMusic'
		resetStep();
		setPopupContent(
			<div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 z-50" style={{ width: '300px' }}>
				<div className="fixed inset-0 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg shadow-lg p-6 transform transition-transform translate-x-0 z-50" style={{ width: '400px' }}>
						<div className="flex justify-between">
							<h2 className="text-xl font-bold mb-4">Enter Data</h2>
							<button
								className='right-0 text-xl font-bold mb-4'
								onClick={() => {
									setShowPopup(false)
								}}

							>X</button>
						</div>
						<div className="mb-4">
							<label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">Audiofile name:</label>
							<input
								type="text"
								id="filename"
								name="filename"
								onChange={handleChange}
								className="border rounded-md p-2 w-full"
							/>
						</div>
						<div className="mb-4">
							<label htmlFor="page" className="block text-sm font-medium text-gray-700 mb-2">Start at:</label>
							<input
								type="text"
								id="atTime"
								name="atTime"
								onChange={handleChange}
								className="border rounded-md p-2 w-full"
							/>
							<button className="border rounded-md p-2 w-full" onClick={() => {
								stepState.current.sfx = true
							}}>Sfx</button>
						</div>
						<div className="flex justify-between">
							<button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => {
								confirmStep();
								resetStep();
								setShowPopup(false);
							}}>Confirm</button>
							<button type="button" className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => {
								setShowPopup(false);
								resetStep();
							}}>Cancel</button>
						</div>
					</div>
				</div>
			</div>
		)
		setShowPopup(true);
	}


	const confirmStep = () => {
		setWork((prev) => [...prev, { ...stepState.current }])
		const temp = [...workRef.current]
		temp.sort((a, b) => a.atTime - b.atTime)
		//setWork([...work].sort((a, b) => a.atTime - b.atTime))
		if (work.length > 0) {
			setLastTime(work[work.length - 1].atTime)
		}
	}
	//		const insertTime = stepState.current.atTime
	//		for (let i = 0; i < work.length; i++) {
	//			if (work[i].atTIme >= insertTime) {
	//				setWork((a) => { a.splice(i - 1, 0, { ...stepState.current }) })
	//				break
	//			}
	//		}
	//		if (work.length > 0) {
	//			setLastTime(work[work.length - 1].atTime)
	//		}
	const getCoords = async () => {
		if (currImg in Object.keys(panelList)) {
			setPanels(panelList[currImg])
			return
		}
		const formData = new FormData();
		const response = await fetch(imgList[currImg])
		const blob = await response.blob()
		formData.append('file', blob);
		await axios.post("http://localhost:5000/predict", formData)
			.then((response) => {
				setPanelList((prev) => ({ ...prev, [currImg]: response.data.result_coords }))
				setPanels(response.data.result_coords)
			})
	}


	const writeData = async (json) => {
		try {
			const response = await axios.post('http://localhost:5000/write', json,);

			console.log(response.data.message); // Message from Flask server
		} catch (error) {
			console.error('Error:', error);
		}
	}


	return (
		<div className="h-screen flex flex-col items-center">
			<div className="fixed bottom-0 right-0 p-4">
				<div className="bg-gray-800 p-1 rounded-lg shadow-md">
					<button className="bg-gray-600 hover:bg-gray-700 text-white font-bold p-2 m-2 rounded"
						onClick={() => { setCurrImg(prev => prev - 1) }}> Previous Image </button>
					<button className="bg-gray-600 hover:bg-gray-700 text-white font-bold p-2 m-2 rounded"
						onClick={() => { setCurrImg(prev => prev + 1) }}> Next Image </button>
					<span className='text-gray-200 bg-gray-700 p-2 m-2'>{currImg}/{imgList.length}</span>
				</div>
			</div>

			<div className="fixed top-24 right-0 p-4">
				<div className="bg-gray-800 p-4 rounded-lg shadow-md">
					<button onClick={getCoords} className="bg-blue-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded ml-2" ></button>
					<button onClick={() => { console.log(work) }} className="bg-blue-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded ml-2" >work</button>
					<button onClick={() => { setPanels([[0, 10, 200, 200]]) }} className="bg-blue-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded ml-2" >heh</button>
				</div>
			</div>

			<div className="fixed top-0 right-0 p-4">
				<div className="bg-gray-800 p-4 rounded-lg shadow-md">
					<button onClick={focusRoutine} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
						Focus Routine
					</button>
					<button onClick={musicRoutine} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded ml-2">
						Add music
					</button>
					<button onClick={getCoords} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded ml-2">
						Preview panels
					</button>
				</div>
			</div>

			<div className="fixed bottom-0 left-0 p-4">
				<div className="bg-gray-800 p-4 rounded-lg shadow-md">
					{work.map((obj) => (
						<div className="box bg-white m-2 p-4 rounded-lg shadow-md">
							<p>Start time:{obj.atTime}<br />
								Work: {obj.workType}<br />
								Work: {}<br />
								Page: {obj.page}</p>
						</div>
					))}
				</div>
				<input onChange={(e)=>{setProjectName(e.target.value)}}/>
				<button onClick={() => { writeData({[projectName]: work}) }} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded ml-2">
					Finalize Book
				</button>
			</div>

			{showPopup && popupContent}
			<div className='flex justify-center w-screen h-full'>
				<div>
					<div className='w-full h-full relative'>
						<img
							src={imgList[currImg]}
							alt="Your Image"
							className="max-h-full z-0"
							onClick={handleImageClick}
							ref={imgWinRef}
						/>
						<div className='top-0 left-0 absolute w-full h-full pointer-events-none'>
							<BoxDrawer panels={panels} imgref={imgWinRef} />
						</div>
					</div>
				</div>
			</div>
			<div
				style={{
					position: 'absolute',
					left: crosshair.x - 10, // Adjust the offset based on the crosshainr size
					top: crosshair.y - 10, // Adjust the offset based on the crosshair size
					opacity: crosshair.visible,
					width: 20,
					height: 20,
					border: '2px solid red',
					borderRadius: '50%',
					pointerEvents: 'none', // Prevent the crosshair from intercepting click events
				}}
			/>
		</div>
	);
};

export default ImageWithClickCoordinates;
