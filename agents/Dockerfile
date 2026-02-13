FROM python:3.11-slim

RUN mkdir /app
WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY data/ ./data/
COPY agents/ ./agents/
COPY agent_controller.py ./agent_controller.py
COPY main.py ./main.py


ENV PORT=8000
ENTRYPOINT ["python", "main.py"]
