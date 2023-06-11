# **DAiO** 
We have prepared this README file with great care to provide a comprehensive guide to both deploying our work for developers and understanding the journey of this project. We kindly request that you review it.

# Sections:
1.	Deployment Walkthrough + Technical Details
2.	Project Story
    -	About
    -	How we built DAiO
    -	Challenges Faced and Overcoming Hurdles
    -	What’s Next for Us

# 1. Project Setup
Follow the below steps and the [YouTube Video]() to replicate our system

1. Front-End
     - Clone this repository
     - Go to the "DAIO-Frontend" folder and do ```npm i```
     - To start the front end use ```npm start``` to run the development server
2. Activating the Machine Learning Model API ( FastAPI running on Google Colab )
     - In the repo go to the "DAIO-ML-MODELS" directory and run the "sentimentAI.ipynb" on Google Colab
     - or alternatively visit the [Goolge Colab Link](https://colab.research.google.com/drive/1qR-o_azL6BG4EPQWACzb7xvPeX3lCOZn?usp=sharing)
     - Run all the cells and will result in an ngrok API base URL will be created > copy this 
3. Back-End
     - Go to the "BackEnd" folder and activate the python virtual environment using ```python -m venv testtransac```
     - To activate the environment do this ```.\testtransac\Scripts\activate```
     - Intall all the requirements via ```pip install -r requirements.txt```
     - Now go to main.py and paste in your ngrok base URL in this code line ![WhatsApp Image 2023-06-10 at 04 22 45](https://github.com/AmeiyAcharya/DAiO/assets/90678802/d435d9f0-e720-422e-b1e1-1dedd9e9d44d)
     - Start the FastAPI server using the comand ``` uvicorn main:app --reload```
     - It will generate a URL > copy it > Go to axios.js file > paste it in the base URL 
 
 Check out the following section on how the AI algo works and how we put chainlink services to use.

# 2. Project Story
## About
Inspired by our roles as developers & board members running our university's DAO, we encountered an unexpected challenge: a lack of active participation, despite having a substantial number of members and no restrictive tokenomics.
**This sparked a thought—what if we could empower individuals to have their voices heard by enabling someone to vote on their behalf, embodying their sentiments and influencing their votes?**
This led us to envision DAiO, where decentralized governance meets personalized education. 
As university students ourselves, we also recognized the restrictions imposed on students in pursuing their desired courses. Thus, we made it our moral principle to create DAiO, a platform exclusively for teachers and students, to provide curriculum freedom and empower passion-driven teaching and learning.

## What it does
DAiO is a cutting-edge platform that tackles the challenge of low participation in DAOs through personalized AI bots and advanced technical solutions. By leveraging sentiment analysis and the BERT model, the platform quantifies user sentiment and creates personalized bots that mirror their voting preferences.

**How ??**
During the onboard process for any new user of the DAiO, the user will be directed to answer a few sentiment gauging questions. The responses to these questions are run through a sentiment quantification process and we create a bot that is personalised to that user henceforth. ( More about this in the How We Built DAiO section )

This innovative approach maximizes participation by allowing the bots to vote on behalf of users who fail to cast their votes, ensuring their voices are heard. Therefore whenever the user fails to vote, the bot mirrors the sentiment and votes in the user's stead thereby maximizing participation. 

Following that, the DAiO incorporates Chainlink VRF to handle disputes, ensuring fairness and preventing 51% attacks. AutomationCompatibleInterface by Chainlink enables proposal timestamps, enhancing transparency and accountability in the voting process. With a separate wallet system for AI voting and seamless integration between blockchain and AI, DAiO creates a secure and efficient environment for decentralized governance, enhancing decision-making in DAOs. 


## How we built DAiO
1.	Identified the quorum problem in DAOs and proposed the use of personalized bots to mitigate it.
2.	**Trained bots using sentiment analysis to replicate user sentiment**, employing the BERT model for sentiment quantification.
3.	Developed a vote prediction model using the Random Forest Classifier, building upon previous results.

  ![image](https://github.com/AmeiyAcharya/DAiO/assets/90678802/7a7c717e-80f1-4f7a-8c7b-68fcf745e5f4)

4.	Researched and applied Chainlink VRF to handle disputes within DAiO.
5.	**Implemented a dispute handling mechanism using the Chainlink VRF funding model** under the EVM network.

![VRFchart](https://github.com/AmeiyAcharya/DAiO/assets/90678802/f1a01942-32b0-4113-9c78-e4ba598d7d45)

6.	**Created a system that delegates a separate wallet for AI to vote on behalf of users**, minimizing the risks of direct user wallet access.
7.	Employed the **AutomationCompatibleInterface by Chainlink to implement a system for proposal timestamps**.
8.	Completed the overall DAO contract.

![image](https://github.com/AmeiyAcharya/DAiO/assets/90678802/eab02cec-0e07-4e36-b8eb-a633bad99ea6)


9.	Conducted **backend development using FastAPI, integrating the BERT Sentiment Analysis ML model** with user proposals and votes.
10.	Developed a groundbreaking AI-powered automatic vote feature that activates after the voting period ends.
11.	Streamlined the integration between AI and smart contracts to ensure seamless interaction between the two different tech stacks.
By following this comprehensive process, we successfully built DAiO, incorporating advanced technologies to address the quorum problem, enhance decision-making, and revolutionize education.

## Challenges Faced and Overcoming Hurdles

During the development of DAiO, we encountered several challenges that required extensive research, trial and error, and technical expertise. Here are the challenges we faced and how we successfully overcame them:

1.  **Figuring out how to use sentiment analysis**: Implementing sentiment analysis to train bots and replicate user sentiment was a complex task. We conducted in-depth research on various sentiment analysis techniques and models. Ultimately, we employed the BERT model for sentiment quantification, which provided accurate and insightful results.
    
2.  **Implementing VRF in DAO for dispute handling**: Integrating Chainlink VRF into our DAO for dispute handling required us to learn and understand the technology from scratch. We extensively studied the use cases and documentation provided by Chainlink, which enabled us to ideate and implement a dispute handling mechanism using the Chainlink VRF funding model. This allowed us to randomly select 10 voters from the DAO membership to handle disputes, ensuring fairness and preventing a 51% attack.
    
3.  **Mitigating the risk of AI having wallet access**: We recognized the potential risks associated with AI having direct access to user wallets. To mitigate this risk, we designed and implemented a separate wallet system specifically for AI to vote on behalf of users via mapping AI wallet address to the user. This approach ensured the security and integrity of user funds, providing a safeguard against potential vulnerabilities.
    
4.  **Enabling AI to vote after proposal closure in a completely automated manner**: Developing an AI-powered automatic vote feature that activates after the voting period ends required meticulous planning and technical implementation. We worked on integrating AI and smart contracts, leveraging the capabilities of the FastAPI backend framework. Through extensive testing and refining, we successfully achieved a seamless and automated process for AI voting, enhancing the efficiency of decision-making in our DAO.
    
5.  **Fusing polar opposite tech stacks and integrating the AI feature into our DAO**: Combining blockchain technology with AI posed a significant challenge due to their different characteristics and requirements. We dedicated significant time and effort to streamline the integration of these two tech stacks. By leveraging the capabilities of FastAPI and implementing robust communication protocols, we successfully fused the AI feature into our DAO, enabling efficient interaction and collaboration between the two technologies. 

## What’s Next for Us

### Code Improvements
1. ***Automated Calls of check_proposal_status()*** : Currently, this function has to be manually called from the backend fastAPI code. Instead of that, we can start the calling of this function as result of an API call from the frontend. So, everytime a user logs in we can send a request to the API to run that function which basically checks for the closed proposals where the user hasn't voted for, and if it finds any, it will invoke the ai_automated_vote function which will calculate the average persona of the previous proposal-vote sentiment values and based on the closeness of the resulting persona sentiment with the sentiment value of the current proposal-vote value it will cast the vote using the private key alotted to that user.

### Improvements
1.  **Optimize Smart Contract and AI algo Efficiency**: Review and optimize the smart contracts underlying DAiO to improve efficiency and reduce gas costs. Consider implementing techniques such as contract sharding, contract upgrades, or layer-2 solutions to enhance scalability as well as advanced avenues in AI and ML like federated learning and load distribution optimization.
    
2.  **Implement Layered Architecture**: Introduce a layered architecture that allows for modular development and scalability. Separate the different components of DAiO, such as the AI module, voting module, and governance module, into distinct layers, enabling independent scaling and maintenance.

### Features to Scale Up 
1.  **Personalized Career Path Recommendations**: DAiO can analyze students' interests, strengths, and goals using sentiment analysis and AI algorithms. Based on this analysis, it can provide personalized career path recommendations, taking into account the individual's skills, preferences, and market demand.
    
2.  **Matching with Industry Professionals**: DAiO can leverage its network of industry professionals and experts to match students with mentors in their desired fields. Using sentiment analysis, it can identify mentors who share similar interests, values, and experiences with the students, facilitating meaningful connections and guidance.
