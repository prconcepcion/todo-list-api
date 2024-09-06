# TODO List API

## Built With
<p align="center">
    <img alt="Static Badge" src="https://img.shields.io/badge/JavaScript-white?style=for-the-badge&logo=javascript&labelColor=black&color=black">
    <img alt="Static Badge" src="https://img.shields.io/badge/ExpressJS-white?style=for-the-badge&logo=Express&labelColor=black&color=black">
    <img alt="Static Badge" src="https://img.shields.io/badge/insomnia-%234000BF?style=for-the-badge&logo=insomnia&labelColor=%234000BF&color=%234000BF">
</p>

## Details
Setup a project with your programming language of choice and create an API for managing a TODO list with the following specification:
- [x] The user should be able to list all tasks in the TODO list
- [x] The user should be able to add a task to the TODO list
- [x] The user should be able to update the details of a task in the TODO list
- [x] The user should be able to remove a task from the TODO list
- [x] The user should be able to reorder the tasks in the TODO list
    - [ ] A task in the TODO list should be able to handle being moved more than 50 times
    - [x] A task in the TODO list should be able to handle being moved to more than one task away from its current position
    - Note: You can think of this as an API endpoint that will be used to handle the drag and drop feature of a TODO list application
- [ ] The application should be able to handle 1 million tasks with a response time of under 5 seconds

## Installation

1. Clone the repo
```
git clone https://github.com/prconcepcion/todo-list-api.git
```
2. Install dependencies
```
cd todo-list-api
npm install
```
3. Build and run the project
```
npm run dev 
```
## My Approach

### Schema
Each task will be stored inside an array as an object with the following properties:

```javascript
[
    {
        id: 1, // unique identifier for the task
        description: "Go to MCDO.", // description of the task
        isCompleted: "yes", // has the task been completed? "yes" or "no"
    },
]
``` 
1. `id` - will always a positive integer.
2. `description` - will always be of type string and is loosely a unique identifier.
3. `isCompleted` - will always be of type string and is exclusively `"yes"` or `"no"`

The `order` of the task will be represented by its index inside the array.

### Routes
Each of the routes always returns a message in JSON format:
```json
{
    "message": "Contains information if the request is successful or not"
}
```

- URI: `/todo/tasks/:id?`
    - METHOD: `GET`
    - Retrieves all the tasks or one task
- URI: `/todo/tasks`
    - METHOD: `POST` 
    - Inserts a task
    - Automatically assigns the `id` and `order` of a task
- URI: `/todo/tasks/:id`
    - METHOD: `PATCH`
    - Updates the following properties:
        1. `description`
        2. `isCompleted`
- URI: `/todo/tasks/:id`
    - METHOD: `DELETE`
    - Deletes a task
    - Automatically reorders the tasks
- URI: `/todo/tasks/reorder/:id`
    - METHOD: `PATCH` 
    - Reorders the array based on the `newOrder` located in the response body

### Testing and Tools
I used **Insomnia** to test the API. I also added a `test.js` which has an array that contains 100,000 objects to be used to check the speed of the API but I think it is unreliable.
