'use client'
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const ImageWithClickCoordinates = ({ params }) => {
	const [currImg, setCurrImg] = useState(0)
	const work = useRef([])
	const imgWinRef = useRef()
	const [crosshair, setCrosshair] = useState({ x: 0, y: 0, visible: 0 })
	const [panels, setPanels] = useState([[0, 0, 100, 100]])
	const [projectName, setProjectName] = useState("")
	const stepState = useRef({
		workType: "focusToB",
		duration: 10, position: { x: 1000, y: 100 },
		page: 2,
	})
	const [panelList, setPanelList] = useState({})
	const [showBound, setShowBound] = useState(false)
	const [showPopup, setShowPopup] = useState(0);
	const [imgList, setImgList] = useState([
		{ picture: 'https://wp.youtube-anime.com/aln.youtube-anime.com/images137/howMfEQ4vvXfLWYfY/1/sub/2.css', size: { x: 1000, y: 1000 } }, { picture: '/2.jpg', size: { x: 1000, y: 1000 } }
	])
	const [componentList, setComponentList] = useState({
		yellow: {
			component: {
			},
			metadata: { width: "3960px", height: "3000px", position: { x: 100, y: 0 }, creatorPosition: { x: 100, y: 0 }, page: 1, render: 0 },
			routine: [
				[{ job: "changePosition", target: "testimage1", newPosition: { x: 10, y: 10 } }, { job: "draw", target: "testimage2" }],
				[{ job: "changePosition", target: "testimage2", newPosition: { x: 0, y: 20 } }, { job: "disableDraw", target: "testimage2" }]
			]
		},
		red: {
			component: {
			},
			metadata: { width: "3960px", height: "3000px", position: { x: 100, y: 0 }, creatorPosition: { x: 1000, y: 0 }, page: 1, render: 0 },
			routine: [
				[{ job: "changePosition", target: "testimage1", newPosition: { x: 10, y: 10 } }, { job: "draw", target: "testimage2" }],
				[{ job: "changePosition", target: "testimage2", newPosition: { x: 0, y: 20 } }, { job: "disableDraw", target: "testimage2" }]
			]
		},
		green: {
			component: {
			},
			metadata: { width: "3960px", height: "3000px", position: { x: 100, y: 0 }, creatorPosition: { x: 10, y: 110 }, page: 1, render: 0 },
			routine: [
				[{ job: "changePosition", target: "testimage1", newPosition: { x: 10, y: 10 } }, { job: "draw", target: "testimage2" }],
				[{ job: "changePosition", target: "testimage2", newPosition: { x: 0, y: 20 } }, { job: "disableDraw", target: "testimage2" }]
			]
		},
	})


	//Log on rerender
	useEffect(() => { console.log("mylorditrerend") })


	//Fetch default pages on page load
	useEffect(() => {
		axios.get("http://localhost:5001/getdefaultpages/" + params.book)
			.then((response) => {
				console.log(params)
				setImgList(response.data.bookpages)
			})
	}, [])


	//Draw around segmentation
	const BoxDrawer = (panels, imgref) => {
		var height = 0
		var width = 0
		var top = 0
		var left = 0
		return (
			<>
				{
					panels.map((panel, index) => {
						if (imgref.current) {
							width = (panel[2] - panel[0]) * (imgref.current.clientWidth / imgref.current.naturalWidth)
							height = (panel[3] - panel[1]) * (imgref.current.clientHeight / imgref.current.naturalHeight)
							left = panel[0] * (imgref.current.clientWidth / imgref.current.naturalWidth)
							top = panel[1] * (imgref.current.clientHeight / imgref.current.naturalHeight)
						}
						return (
							<div className='absolute pointer-events-auto border-4 border-red-600 border-dashed z-20' style={{
								width: width,
								height: height,
								left: left,
								top: top,
							}}
								onClick={async () => {
									const formData = new FormData();
									const response = await fetch(imgList[currImg].picture)
									const blob = await response.blob()
									formData.append('image', blob);
									formData.append('coordinates', panel);
									axios.post('http://localhost:5001/crop_image', formData, {
										headers: {
											'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
										},
									}).then((response) => {
										setComponentList((prev) => ({
											...prev, [stepState.current.componentName]: {
												...prev[stepState.current.componentName], component: {
													...prev[stepState.current.componentName].component, [response.data.message]:
														{ src: "http://localhost:5001/getimg/" + response.data.message, position: { x: 0, y: 0 }, render: 1 }
												}
											}
										}))
										setPanels([[0, 0, 10, 10]])
										setShowBound(false)
									})
								}}
							></div>
						)
					})
				}
			</>
		)
	}

	//Get coordinates on imgclick
	const handleImageClick = (event) => {
		const boundingRect = event.target.getBoundingClientRect();
		if (showPopup == 1 || showPopup == 4) {
			const x = event.clientX
			const y = event.clientY
			setCrosshair({ x: x, y: y, visible: 1 })
			if (showPopup == 4 && stepState.current.componentName != undefined) {
				const componentName = stepState.current.componentName
				setComponentList((prev) => ({ ...prev, [componentName]: { ...prev[componentName], metadata: { ...prev[componentName].metadata, creatorPosition: { x: x - boundingRect.left, y: y }, page: currImg } } }))
			}
			const offsetX = (event.clientX - boundingRect.left) * (event.target.naturalWidth / boundingRect.width);
			const offsetY = (event.clientY - boundingRect.top) * (event.target.naturalHeight / boundingRect.height);
			stepState.current.position = { x: offsetX, y: offsetY }
		}
	};

	const confirmStep = () => {
		stepState.current["page"] = currImg
		work.current = [...work.current, { ...stepState.current }]
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
	}

	useEffect(() => {
		resetStep()
	}, [work]);

	useEffect(() => {
		console.log(crosshair)
	}, [crosshair]);

	useEffect(() => { console.log(stepState.current) }, [stepState.current])


	const getCoords = async () => {
		if (currImg in Object.keys(panelList)) {
			setPanels(panelList[currImg])
			return
		}
		const formData = new FormData();
		const response = await fetch(imgList[currImg].picture)
		const blob = await response.blob()
		formData.append('file', blob);
		axios.post("http://localhost:5000/predict", formData)
			.then((response) => {
				setPanelList((prev) => ({ ...prev, [currImg]: response.data.result_coords }))
				setPanels(response.data.result_coords)
				console.log(response.data.result_coords)
			})
	}

	const getColouredImg = async () => {
		const formData = new FormData()
		const response = await axios.get(imgList[currImg].picture, {
			responseType: 'blob'
		})
		const blob = await response.data
		formData.append('file', blob)
		axios.post("http://localhost:5001/colour", formData).then(
			(response) => {
				console.log(response.data)
				setImgList((prev) => {
					prev[currImg].picture = "http://localhost:5001/getimg/" + response.data.message
					return [...prev]
				}
				)
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

	const popupFactory = (popupType) => {
		const closePopup = () => {
			setShowPopup(0)
			setCrosshair({ ...crosshair, visible: 0 })
		}

		switch (popupType) {
			case 1: {
				stepState.current.workType = 'focusToB'
				break
			}
			case 2: {
				stepState.current.workType = 'playMusic'
				break
			}
			case 4: {
				return (
					<div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 z-50" style={{ width: '300px' }}>
						<div className="fixed inset-0 flex items-center justify-center z-50">
							<div className="bg-white rounded-lg shadow-lg p-6 transform transition-transform translate-x-0 z-50" style={{ width: '400px' }}>
								<button className='right-0 text-xl font-bold mb-4' onClick={
									closePopup
								} >X</button>
								<div className="mb-4">
									<label htmlFor="page" className="block text-sm font-medium text-gray-700 mb-2">Component Name</label>
									<input type="text" id="componentName" name="componentName" onChange={handleChange} className="border rounded-md p-2 w-full" />
								</div>
								<div className="flex justify-between">
									<button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => {
										closePopup()
										try {
											const componentName = stepState.current.componentName
											const position = stepState.current.position
											setComponentList((prev) => ({ ...prev, [componentName]: { ...prev[componentName], metadata: { ...prev[componentName].metadata, position: position, page: currImg } } }))
										}
										catch {
											//Status line
											console.log("componentName Doesnt exist")
										}
									}}>Confirm</button>
								</div>
							</div>
						</div>
					</div >
				)
			}
			case 5: {
				return (
					<div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 z-50" style={{ width: '300px' }}>
						<div className="fixed inset-0 flex items-center justify-center z-50">
							<div className="bg-white rounded-lg shadow-lg p-6 transform transition-transform translate-x-0 z-50" style={{ width: '400px' }}>
								<button className='right-0 text-xl font-bold mb-4' onClick={
									closePopup
								} >X</button>
								<div className="mb-4">
									<label htmlFor="page" className="block text-sm font-medium text-gray-700 mb-2">Component Name</label>
									<input type="text" id="componentName" name="componentName" onChange={handleChange} className="border rounded-md p-2 w-full" />
								</div>
								<div className="flex justify-between">
									<button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => {
										closePopup()
										try {
											const componentName = stepState.current.componentName
											getCoords()
											setShowBound(true)
										}
										catch {
											//Status line
											console.log("componentName Doesnt exist")
										}
									}}>Confirm</button>
								</div>
							</div>
						</div>
					</div >
				)
			}
		}

		return (<>
			<div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 z-50" style={{ width: '300px' }}>
				<div className="fixed inset-0 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg shadow-lg p-6 transform transition-transform translate-x-0 z-50" style={{ width: '400px' }}>
						<div className="flex justify-between">
							<h2 className="text-xl font-bold mb-4">Enter Data</h2>
							<button className='right-0 text-xl font-bold mb-4' onClick={closePopup} >X</button>
						</div>
						<div className="mb-4">
							<label htmlFor="page" className="block text-sm font-medium text-gray-700 mb-2">Start at: </label>
							<input type="number" id="atTime" name="atTime" onChange={handleChange} className="border rounded-md p-2 w-full" />
						</div>
						{
							popupType == 1 && (
								<div className="mb-4">
									<label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">Duration:</label>
									<input type="number" id="duration" name="duration" onChange={handleChange} className="border rounded-md p-2 w-full" />
								</div>)
						}
						{
							popupType == 2 && (
								<div className="mb-4">
									<label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">Audiofile name:</label>
									<input type="text" id="filename" name="filename" onChange={handleChange} className="border rounded-md p-2 w-full" />
								</div>
							)
						}
						<div className="flex justify-between">
							<button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => {
								confirmStep();
								closePopup()
								setCrosshair({ ...crosshair, visible: 0 })
							}}>Confirm</button>
							<button type="button" className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => {
								closePopup()
								setCrosshair({ ...crosshair, visible: 0 })
							}}>Cancel</button>
						</div>
					</div>
				</div>
			</div>
		</>)
	}

	const placeComponent = () => {
		setShowPopup(4)
	}
	const componentadd = () => {
		setShowPopup(5)
	}

					//<button onClick={async () => {
					//	const formData = new FormData();
					//	const response = await fetch(imgList[currImg].picture)
					//	const blob = await response.blob()
					//	formData.append('image', blob);
					//	formData.append('coordinates', [0, 0, 10, 10]);
					//	axios.post('http://localhost:5001/crop_image', formData, {
					//		headers: {
					//			'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
					//		},
					//	}).then((response) => { console.log(response) })
					//}} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded ml-2">
					//	herhek
					//</button>
	const commandBars = (
		<>
			<div className="fixed bottom-0 right-0 p-4">
				<div className="bg-gray-800 p-1 rounded-lg shadow-md">
					<button className="bg-gray-600 hover:bg-gray-700 text-white font-bold p-2 m-2 rounded"
						onClick={() => { setCurrImg(prev => prev - 1) }}> Previous Image </button>
					<button className="bg-gray-600 hover:bg-gray-700 text-white font-bold p-2 m-2 rounded"
						onClick={() => { setCurrImg(prev => prev + 1) }}> Next Image </button>
					<span className='text-gray-200 bg-gray-700 p-2 m-2' >{currImg}/{imgList.length}</span>
				</div>
			</div>

			<div className="fixed top-24 right-0 p-4">
				<div className="bg-gray-800 p-4 rounded-lg shadow-md">
					<button onClick={getColouredImg} className="bg-blue-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded ml-2" >wowie</button>
				</div>
			</div>

			<div className="fixed top-0 right-0 p-4">
				<div className="bg-gray-800 p-4 rounded-lg shadow-md">
					<button onClick={() => setShowPopup(1)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
						Focus Routine
					</button>
					<button onClick={() => setShowPopup(2)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded ml-2">
						Add music
					</button>
					<button onClick={placeComponent} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded ml-2">
						Position Components
					</button>
					<button onClick={componentadd} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded ml-2">
						Add segment to component
					</button>
				</div>
			</div>
			<div className="fixed bottom-0 left-0 p-4">
				<div className="bg-gray-800 p-4 w-20 rounded-lg shadow-md z-10">
				</div>
				<input onChange={(e) => { setProjectName(e.target.value) }} />
				<button onClick={() => { writeData({ [projectName]: [work.current, imgList, [componentList]] }) }} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded ml-2">
					Finalize Book
				</button>
				<button onClick={() => { work.current = work.current.slice(0, -1) }} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded ml-2">
					Delete last work
				</button>
			</div>
		</>
	)

	const drawComponent = (componentname) => {
		const componentSel = componentList[componentname]
		return (
			<div style={{ left: componentSel.metadata.creatorPosition.x, top: componentSel.metadata.creatorPosition.y,pointerEvents: 'none', position: 'absolute', width: componentSel.metadata.width }}>
				{Object.keys(componentSel.component).map((imgName) => {
					console.log(imgName)
					return (componentSel.component[imgName].render &&
						(<img src={componentSel.component[imgName].src}
							style={{ left: componentSel.component[imgName].position.x, top: componentSel.component[imgName].position.y, }}
							className='' />))
				})}
			</div>
		)
	}

	return (
		<div className="h-screen flex flex-col items-center">
			{commandBars}
			{showPopup != 0 && popupFactory(showPopup)}
			<div className='flex justify-center overflow-x-visible w-screen h-full'>
				<div className='relative'>
					<img
						src={imgList[currImg].picture}
						alt="Your Image"
						className="max-w-full"
						onClick={handleImageClick}
						ref={imgWinRef}
					/>
					{drawComponent('yellow')}
					{drawComponent('red')}
					{drawComponent('green')}
					{showBound && (
						<div className='top-0 left-0 absolute w-full h-full pointer-events-none'>
							{BoxDrawer(panels, imgWinRef)}
						</div>
					)}
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
		</div>
	);
};

export default ImageWithClickCoordinates;
