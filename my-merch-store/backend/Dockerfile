FROM python:3.10

WORKDIR /app
COPY app.py .

RUN pip install flask flask_cors requests

CMD ["python", "app.py"]