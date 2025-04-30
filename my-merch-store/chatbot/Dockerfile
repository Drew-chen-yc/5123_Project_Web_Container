FROM python:3.10

WORKDIR /chat
COPY chat.py .
COPY index.html .
COPY static ./static

RUN pip install flask flask_cors openai

CMD ["python", "chat.py"]