FROM python:3.10
WORKDIR /app
COPY mock_server.py .
COPY static ./static
RUN pip install flask flask-cors pandas flask-sqlalchemy psycopg2
CMD ["python", "mock_server.py"]
