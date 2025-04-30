FROM python:3.10

WORKDIR /chat

COPY chat.py .
COPY templates ./templates
COPY static ./static

RUN pip install flask flask_cors openai

CMD ["python", "chat.py"]
