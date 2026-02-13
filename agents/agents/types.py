from typing import TypedDict, List


class GuardMemory(TypedDict, total=False):
    agent: str
    decision: str


class ClassificationMemory(TypedDict, total=False):
    agent: str
    decision: str


class DetailsMemory(TypedDict, total=False):
    agent: str


class RecommendationMemory(TypedDict, total=False):
    agent: str


class OrderItem(TypedDict):
    item: str
    quantity: int
    price: float


class OrderTakingMemory(TypedDict, total=False):
    agent: str
    step_number: str
    order: List[OrderItem]
    asked_recommendation_before: bool


class AgentMessage(TypedDict):
    role: str
    content: str
    memory: (
        GuardMemory
        | ClassificationMemory
        | DetailsMemory
        | RecommendationMemory
        | OrderTakingMemory
    )
