from agents import (
    GuardAgent,
    ClassificationAgent,
    DetailsAgent,
    AgentProtocol,
    RecommendationAgent,
    OrderTakingAgent,
)
import pathlib
import os

folder_path = pathlib.Path(__file__).parent.resolve()


class AgentController:
    def __init__(self):
        self.guard_agent = GuardAgent()
        self.classification_agent = ClassificationAgent()
        self.recommendation_agent = RecommendationAgent(
            os.path.join(folder_path, "data/apriori_recommendations.json"),
            os.path.join(folder_path, "data/popularity_recommendation.csv"),
        )

        self.agent_dict: dict[str, AgentProtocol] = {
            "details_agent": DetailsAgent(),
            "recommendation_agent": self.recommendation_agent,
            "order_taking_agent": OrderTakingAgent(self.recommendation_agent),
        }

    def get_response(self, messages):
        # Get response from guard agent
        response = self.guard_agent.get_response(messages)
        if response["memory"]["decision"] == "not allowed":
            return response

        # Get Classification Agent Response
        classification_response = self.classification_agent.get_response(messages)
        chosen_agent = classification_response["memory"]["decision"]

        # Get the chose agent's response
        agent = self.agent_dict[chosen_agent]
        agent_response = agent.get_response(messages)
        return agent_response
