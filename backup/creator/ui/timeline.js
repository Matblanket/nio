
import React, { useState } from 'react';

const TimelineComponent = () => {
	const [boxes, setBoxes] = useState([]);

	const handleClick = (time) => {
		const newBox = {
			id: Math.random().toString(36).substr(2, 9),
			time,
			text: 'Sample Text',
		};

		setBoxes([...boxes, newBox]);
	};

	return (
		<div className="flex flex-col h-screen">
			<div className="flex flex-nowrap overflow-x-auto border-b border-gray-300">
				{[...Array(86)].map((_, index) => (
					<div
						key={index}
						className="cursor-pointer flex-shrink-0 w-16 h-12 flex justify-center items-center border-r border-gray-300"
						onClick={() => handleClick(index)}
					>
						{index}
						{}
					</div>
				))}
			</div>

			<div className="flex flex-wrap gap-4 h-1/5 overflow-y-auto">
				{boxes.map((box) => (
					<div key={box.id} className="p-2 bg-gray-200 rounded-md">
						{JSON.stringify(box)}
					</div>
				))}
			</div>
		</div>
	);
};

export default TimelineComponent;
