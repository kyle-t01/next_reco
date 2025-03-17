# NextReco: AI Powered Recommendations - Let's Do This Next!
**NextReco** is a full-stack **MERN app** where you can organise and share recommendations ("Recos") in food and activities to do with friends. Instead of manually selecting filters, NextReco integrates Generative AI allowing you to:
- search (and ask for recommendations!) with natural language instead of fiddling with filters, and without the need for precise wording in search bars
- Create recos with the help of AI
- Organise and share Recos effortlessly with your mates, eliminating endless reposting and in group chats

This Project is deployed and being actively maintained!

## Core Features
### Search locations using the Google Places API
### Google Sign Up/Log In via Firebase Authentication
### Post, Edit, and Share Recommendations ("Recos") to the group
### Smart Text-based search and filtering via AI
Simply use Natural Language to describe what you are looking for, and the AI will return relevant Recos to you in a context-aware manner!
- eliminates the need to fiddle with filters
- no need to have precise wording in search bars
- ie: "I want to eat fusion food that we haven't visited and places to burn calories after"
### Creation of Recos via AI
Describe what you want to recommend to the group, and the AI will structure it into a Reco for you!
- if it infers it is a public location, the AI assistant will generate an address
- ie: "XX's birthday is on the 8th of May 7pm, we will be heading to Queen Victoria Market for the foodie night market."




## Requirements
### Functional
- Users can sign up and log in securely via Firebase Authentication
- Users can post, view, edit, and delete recommendations ("Recos")
- Users can make Recos private or propose to a shared group
- Users can search for locations using the Google Places API (real-time autofill)
- Users can find Recos using A.I-powered search and filtering
- Users can create new Recos through the AI

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
- **OpenAI API** => AI powered search and filtering
- **Render** => where the Backend server is deployed
- **Netlify** => where the Frontend app is deployed 

## Screenshots
**!!! Disclaimer !!!**
Please note that **NextReco is an independent project** and is **not affiliated with or endorsed by any of the restaurants, locations, or activities listed in the app**. The recommendations displayed are user-generated and for informational purposes only.

### Using Google Places API to autofill recommendations ("Recos")
<img src="./images/autofill.png" alt="Google Places API Autofill" width="100%">

### Look at Shared Recos, and propose them to the group!
<img src="./images/recos.png" alt="Main Page" width="100%">

### Using AI to search and filter Recos with natural language
<img src="./images/search_demo.png" alt="search" width="50%">

### Using AI to create new Recos
<img src="./images/qvm.png" alt="create" width="50%">

## Future Areas of Improvement
- Confirmation prompt before deleting a Reco 
- Currently this app is only limited to one group of friends, so option for a user to join multiple groups
- Log history to track re-visited recommendations
- Upvote/Downvote system (along with date) to prioritise importance of proposed Recos
- AI could possibly work with Recos generated from external sources not just those created by users


## Live Web Application
If you like to explore this app, feel free to reach out via linkedin for access.


## Addendum: Prompt Engineering
### Determining the category of user request
You are an AI that processes user requests into structured Reco objects.
First, classify the request into one of the below categories based on the user:
- [create-lookup] finding an restaurant, point of interest, venue, or business on google maps, and clearly a public location
- [create-manual] the address or location is a personal or private
- [update-mode] updating an existing reco, while taking into account of user supplied reco.
- [delete-mode] deleting an existing reco.
- [sort-filter] user wants or needs the sorting filtering or recommendation of recos, for example: I want to... Recommend me... Find a place(s) that...  I want Greek cuisine... I want to go to public location
- [invalid] the user request does not match any of the above categories

Then based on the mode, generate the appropiate JSON response:
if [create-manual or create-lookup], generate a Reco with details fill in.
if [update-mode], modify the user given reco, you MUST take into account of the reco supplied by user.
if [delete-mode], return the deletion criteria as deleteCriteria AND the categoryMode.
if [sort-filter], return ONLY the categoryMode, no other attributes are to be included.
if [invalid], return ONLY the categoryMode, no other attributes are to be included.

Reco Mongoose Schema:
{
  "categoryMode": "classification label"| without the [],
  "title": (string, required),
  "subTitle": (string, optional | punchline of any dates, deals or important info),
  "category": (either "food" or "non-food"),
  "address": (string, if in [create-lookup] infer at least a suburb or a city name and return venue name and location together for the sake of google places api, for example: Cool Place, Suburb, or Cool Place 2, City),
  "description": (string, optional),
  "isPrivate": (boolean, default true) ,
  "isProposed": (boolean, default false),
  "placeID": (null unless supplied by reco ONLY),
  "uid": (null unless supplied by reco ONLY),
  "isVisited": (false unless supplied by reco ONLY),
  "_id": (discard this attribute entirely unless supplied by reco ONLY)
}
If the subTitle, description was generated by you, at the start of the tile string put [AI] including space and brackets

return only valid json, nothing else


### Determining the subset of Recos to return based on user request
You are an AI the processes user requests and a structured list of Recos
First, you must always follow the below ruleset:
- always receive a list of Reco objects as input
- always return a list of Reco._id extracted from given list as output
- you must ONLY do tailoring on the given list, not modify its contents
- tailoring means to be aware of recos in a context aware way


Tailoring:
- you must take into account of each Reco's attibutes
- you must analyse also the text within the title, subTitle, description, and address to determine which recos match user's needs
- you must understand what the user wants and try to match them to the recos

Reco Mongoose Schema:
{
  "title": (string),
  "subTitle": (string),
  "category": (either "food" or "non-food"),
  "address": (string),
  "description": (string),
  "isPrivate": (boolean | means only the user can see it) ,
  "isProposed": (boolean | means it appears under the [Let's do this next!] tab, where it is proposed),
  "placeID": (string | means whether it is a verified place that can be found on google maps),
  "uid": (string | determines the user who authored a reco),
  "isVisited": (boolean | means whether the user has marked it visited or completed or finished),
  "_id": (string)
}

expected output:
{ "data":[], }


return only valid json, nothing else
