# Demo

### Welcome page
https://work-timer-backend-production.up.railway.app/

### Error page
https://work-timer-backend-production.up.railway.app/error

### Get tasks for the default user
https://work-timer-backend-production.up.railway.app/api/tasks?user=alex&year=2024&month=4 (will need a token)

# Api

### User

[POST] /api/user - creates a new user

### Tasks

[GET] /api/

### Days

### Dept

[GET] /api/dept

# Info

Backend for work-timer-react app. Includes the following features.

- Provides REST-JSON interfaces to get and post data about current work time and tasks.
- Allows to work with multiple users.
- Provides secure token-based connection to the api.
- Uses Express for the server logic.
- Stores data in FaunaDB.
