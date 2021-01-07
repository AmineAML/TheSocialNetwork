# The Social Network Back-End

## API Gateway
* Controller
  * Account
    - Create user (POST) IMPROVING
    - Get user by id (GET) IMPROVING
    - Get users by query of interests meaning hobbies (stored exactly the same as user write them) IMPROVING
    - Update user by id (PUT) IMPROVING
    - Get example of protected route allowed with authentication and authorization (GET) IMPROVING
    - Login (POST) IMPROVING
  * Report
    - Create report (POST) IMPROVING
    - Update report by id (POST and authenticated and role of admin) IMPROVING
    - Get all reports (GET and authenticated and role of admin) IMPROVING
    - Get report by id (GET and authenticated and role of admin) IMPROVING
  * Image
    - Upload image (POST and authenticated and role of user) IMPROVING
    - Get images by user id(GET) IMPROVING
    - Delete image by image id (POST and authenticated and role of user) IMPROVING

## Service-account
* Controller
  - Create user IMPROVING
  - Get user by id IMPROVING
  - Search user by credentials (email and password) IMPROVING
  - Update user profile IMPROVING
  - Search user by query (category) and by region IMPROVING
* Service
  - Create user IMPROVING
  - Search user (by email) IMPROVING
  - Search user by id IMPROVING
  - Update user profile by id IMPROVING
  - Search users by category (query) IMPROVING

## Service-report
* Controller
  - Create report IMPROVING
  - Update report by id IMPROVING
  - Get all reports IMPROVING
  - Get report by id IMPROVING
* Service
  - Create report IMPROVING
  - Update report by id IMPROVING
  - Get all reports IMPROVING
  - Get report by id IMPROVING

## Service-image
* Controller
  - Create image IMPROVING
  - Get image by user id and type IMPROVING
  - Update image BETTER DELETE IMAGE AND INSERT A NEW IMAGE
* Service
  - Create image IMPROVING
  - Search image by user id or vehicule id and type IMPROVING
  - Delete image by image id

## Roles
* Admin
  - Similar Visitor and User permissions
  - Block user account
* Visitor
  - View other accounts
* User
  - View other accounts
  - Create own personal account
  - Delete own account
  - Chat
  - Modify own account
  - Report other accounts