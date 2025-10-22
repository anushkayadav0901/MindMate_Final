from pdf_extract_kit.tasks.base_task import BaseTask
from pdf_extract_kit.tasks.layout_detection.task import LayoutDetectionTask
from pdf_extract_kit.tasks.ocr.task import OCRTask

from pdf_extract_kit.registry.registry import TASK_REGISTRY

__all__ = [
    "BaseTask",
    "LayoutDetectionTask",
    "",
    "LayoutDetectionTask",
    "OCRTask",
    "",
]

def load_task(name, cfg=None):
    task_class = TASK_REGISTRY.get(name)
    task_instance = task_class(cfg)

    return task_instance
