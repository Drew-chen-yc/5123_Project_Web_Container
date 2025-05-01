# 5123_Project_Web_Container (Project 3)
A full-stack Game Review Website built for Project 3 in the 5123 course. This site allows users to explore, review, and discuss their favorite games.

## Features
📝 Game Review Display

📊 Ratings and Aggregated Statistics

🔍 Multiple Sorting Method

🐳 Containerized using Docker and Docker Compose

## Technologies Used
Docker – Containerizes all services to ensure portability and consistency across environments

PostgreSQL – Stores user reviews and product (game) data

HTML & CSS – Builds and styles the web pages

JavaScript – Implements dynamic front-end features such as sorting reviews and displaying star ratings

Python (Flask) – Manages backend APIs and processes data between frontend and database

## Contributors
### Peter Vo
design the web pages and beautify the overall appearance
### Drew Chen
Building the basic framework
### Keevin Funderburg
Develop the necessary content and improve the user experience.

## Project Structure
5123_Project/
├── backend(mockdata)/
│   └── app.py
│   └── dockerfile
├── frontend/
│   └── index.html
│   └── dockerfile
├── review/
│   └── reviews.py
│   └── dockerfile
├── chatbot/
│   └── chat.py
│   └── dockerfile
├── docker-compose.yml
└── README.md

## VS code environment:

## Start the docker: 
docker-compose up --build
## End the docker: 
docker-compose down
