# NextReco: Let's Do This Next!
**NextReco** is a full-stack **MERN app** where you can organise and share recommendations ("Recos") in food and activities to do with friends, eliminating the need for endless reposting and time consuming searches of recommendations in group chats.
This Project is deployed and being actively maintained!

## Core Features
- Search locations using the Google Places API
- Google Sign Up/Log In via Firebase Authentication
- Post, Edit, and Share Recommendations ("Recos") to the group

## Requirements
### Functional
- Users can sign up and log in securely via Firebase Authentication
- Users can post, view, edit, and delete recommendations ("Recos")
- Users can make Recos private or propose to a shared group
- Users can search for locations using the Google Places API 

### Non-Functional
- UI must be intuitive and responsive
- Backend must be able to handle at least 10 users within <3 second delay
- The application needs to be available at least 16 hours a day

## Technologies Used
- **MongoDB** => database for storing Recos 
- **Mongoose** => standardisation of Reco Schemas 
- **Express.js + Node.js** => execution of js from server side
- **React.js** => frontend UI
- **Firebase Authentication** => user authentication with Google Sign-In
- **Google Places API** => fetches location data real-time
- **Render** => where the Backend server is deployed
- **Netlify** => where the Frontend app is deployed 

## Screenshots
**!!! Disclaimer !!!**
Please note that **NextReco is an independent project** and is **not affiliated with or endorsed by any of the restaurants, locations, or activities listed in the app**. The recommendations displayed are user-generated and for informational purposes only.

### Using Google Places API to autofill recommendations ("Recos")
<img src="./images/autofill.png" alt="Google Places API Autofill" width="100%">

### Look at Shared Recos, and propose them to the group!
<img src="./images/recos.png" alt="Main Page" width="100%">

## Future Improvements
- Confirmation prompt before deleting a Reco 
- Currently this app is only limited to one group of friends, so option for a user to join multiple groups
- Visit history
- Upvote/Downvote system (along with date) to prioritise importance of proposed Recos
- Tag a Reco with food or non-food
- Search and Filter Recos

## Live Web Application
If you like to explore this app, feel free to reach out via linkedin for access.