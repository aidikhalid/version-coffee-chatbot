from typing import Protocol, List, Dict, Any
from .types import AgentMessage


class AgentProtocol(Protocol):
    def get_response(self, messages: List[Dict[str, Any]]) -> AgentMessage: ...
