from roboflow import Roboflow
rf = Roboflow(api_key="4uLPYt53nLEqtVOxpRq0")
project = rf.workspace("personal-ov9jg").project("comic-panel-detectors")
dataset = project.version(8).download("coco")
