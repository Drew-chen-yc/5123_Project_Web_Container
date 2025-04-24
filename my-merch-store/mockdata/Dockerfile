FROM python:3.10
WORKDIR /app
COPY mock_server.py .
RUN pip install flask flask-cors
CMD ["python", "mock_server.py"]