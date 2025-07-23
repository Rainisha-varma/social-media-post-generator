# AI Social Media Post Generator

**Live Demo:** [https://social-media-post-generator-production-eda1.up.railway.app/](https://social-media-post-generator-production-eda1.up.railway.app/)

---

## Overview

This project is a cutting-edge web application that harnesses the power of **Generative Artificial Intelligence (Gen AI)**, specifically utilizing **Google's Gemini API**, to effortlessly create engaging and tailored social media posts. Say goodbye to writer's block! Whether you need content for Instagram, Twitter, LinkedIn, or any other platform, and want to control the tone, add emojis, or include hashtags, this tool helps you craft compelling captions and messages in seconds.

The architecture features a minimalist Node.js backend that acts as a secure proxy, taking your input, communicating directly with the Gemini AI model, and returning the generated post to your browser, all while keeping your sensitive API key securely hidden.

## Features

* **Generative AI Core:** Powered by **Google's Gemini 1.5 Flash model** for highly creative and relevant text generation.
* **Highly Customizable Prompts:**
    * Input a **Topic/Keywords** for your desired social media post.
    * Specify a **Desired Tone** (e.g., "inspiring," "funny," "professional," "any").
    * Choose a target **Social Media Platform** (e.g., "Instagram," "Twitter," "LinkedIn," "any").
    * **Toggle Options:** Include or exclude **relevant emojis** and **appropriate hashtags** with simple switches.
* **Minimalist & Secure Backend:** A lean Node.js Express server handles API requests and securely interfaces with the Gemini API.
* **Intuitive Static Frontend:** A clean and responsive user interface built with plain HTML, CSS, and JavaScript for a smooth user experience.
* **Instant Copy:** Quickly copy the generated post to your clipboard with a dedicated button.
* **Live Demo:** Explore the application directly via the provided Railway deployment.

##  Technologies Used

**Frontend:**
* HTML5
* CSS3
* Vanilla JavaScript

**Backend:**
* Node.js
* Express.js
* `dotenv` for secure environment variable management

**AI Integration:**
* **Google Gemini API (`@google/genai` SDK)**

**Deployment:**
* Railway
