# Restaurant Web Resource Development with Python and Flask

## Overview
This repository contains the code and documentation for the bachelor's qualification work by Mykola Nesterenko, a student of group AI-204 at the National University "Odesa Polytechnic," under the supervision of Oleksii Volodymyrovych Ivanov. The project involves developing a restaurant web resource using Python and Flask.

## Table of Contents
- [Overview](#overview)
- [Abstract](#abstract)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)

## Abstract
This project presents a web resource for restaurant management, providing real-time administration and user interaction capabilities. It aims to facilitate efficient communication between restaurants and their customers, streamlining the process of choosing and ordering food online.

The web resource is designed with a microservice architecture that allows easy scalability and expansion of functionality. The backend system, built on the Flask platform, interacts through a REST API, while MongoDB is used for data storage, ensuring quick access and easy management of unstructured data. Quality control is maintained through functional and unit testing.

## Features
- **User Management:** Authentication, authorization, and profile management.
- **Menu Management:** Create, update, delete, and view menu items.
- **Order Management:** Place and manage orders in real-time.
- **Analytics:** View statistics on popular dishes and generate reports on customer preferences.
- **Microservice Architecture:** Independent services for user and menu management, ensuring flexibility and scalability.
- **Responsive Design:** User-friendly interface accessible from both desktops and mobile devices.

## Technology Stack
- **Backend:** Python, Flask
- **Frontend:** React, Redux
- **Database:** MongoDB Atlas
- **Styling:** Bootstrap
- **HTTP Client:** Axios
- **Development Environment:** Visual Studio Code

## Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/bezpechno/Adjoint.git
   cd Adjoint
2. **Set up a virtual environment**
   python3 -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
3. **Install the dependencies**
   pip install -r requirements.txt
   npm install --legacy-peer-deps
4. **Set up the environment variables**
   Create a .env file in the project root and add the necessary configurations (e.g., MongoDB URI, Flask secret key).
5. **Run the application**
   flask run
## Usage
1. Open your web browser and navigate to http://127.0.0.1:5000.
2. Explore the features:
    Sign up and log in to manage your profile.
    View and manage the restaurant menu.
    Place orders and view order history.
    Access analytics to gain insights into popular dishes and customer preferences.

