// import { testTasks } from './test.js'
import express from 'express'

const app = express();
const PORT = 8080
const tasks = []

app.use( express.json() )

app.listen(
    PORT
)

app.get('/todo/tasks/:id?' , ( req, res ) => {
    const { id } = req.params

    if( ! id ) { // return a message if there are no tasks
        return tasks.length > 0 ? res.status( 200 ).json( { data: tasks } ) : res.status( 200 ).json( { message: 'There are no tasks' } )
    }

    if ( validateId( id ) ) { // id must be a positive integer
        return res.status( 400 ).json( { message: "Invalid request. Invalid parameter: id" } )
    }

    for ( const task of tasks ) {
        if ( task.id === parseInt( id, 10 ) ) {
            return res.status( 200 ).json( { data: task } )
        }
    }
    
    return res.status( 404 ).json( { message: "Invalid request. Task does not exist" } )

} )


app.post( '/todo/tasks/', ( req, res ) => {
    const { description, isCompleted } = req.body

    // validate request body 
    const isCompletedValid = validateIsCompleted( isCompleted )
    const isDescriptionValid = validateDescription( description )

    if ( ! isCompletedValid.isValid ) {
        return res.status( 400 ).json( { message: isCompletedValid.message } )
    }

    if ( ! isDescriptionValid.isValid ) {
        return res.status( 400 ).json( { message: isDescriptionValid.message } )
    }

    for ( const task of tasks ) {
        if ( task.description === description ) {
            return res.status( 400 ).json( { message: 'Invalid request. Task already exists' } )
        }
    }

    const id = tasks.length === 0 ? 1 : tasks.length + 1

    tasks.push(
        {
            id: id,
            description: description,
            isCompleted: isCompleted,
        }
    )

    return res.status( 201 ).json( { message: 'Succesfully added task', id: id } )

} )

app.patch( '/todo/tasks/:id', ( req, res ) => {
    const { id } = req.params
    const { description, isCompleted } = req.body

    // validate request body
    const isCompletedValid = validateIsCompleted( isCompleted )
    const isDescriptionValid = validateDescription( description )

    if ( validateId( id )  ) {
        return res.status( 400 ).json( { message: 'Invalid request. Invalid parameter: id' } )
    }

    if ( ! description && ! isCompleted ) {
        return res.status( 400 ).json( { message: 'Invalid request. Missing parameters' } )
    }

    for ( const task of tasks ) {

        if ( task.id === parseInt( id, 10 ) ) { // nasty block of code
            
            if ( isDescriptionValid.isValid ) {
                task.description = description
            }

            if ( isCompletedValid.isValid ) {
                task.isCompleted = isCompleted
            }

            if ( ! isDescriptionValid.isValid && ! isCompletedValid.isValid ) {
                return res.status( 400 ).json( { message: 'Invalid request. Invalid parameters' } )
            }

            if ( ! isDescriptionValid.isValid || ! isCompletedValid.isValid ) {
                return res.status( 207 ).json( {
                    message: 'Partialy updated the task. There was an error with one of the parameters',
                    invalidDescription: ! isDescriptionValid.isValid ? isDescriptionValid.message : undefined,
                    invalidIsCompleted: ! isCompletedValid.isValid ? isCompletedValid.message : undefined,
                } )
            }

            return res.status( 200 ).json( { message: 'Successfully updated task' } )

        }
    }

    return res.status( 404 ).json( { message: "Invalid request. Task does not exist" } )

} )

app.delete( '/todo/tasks/:id', ( req, res ) => {
    const { id } = req.params

    if ( validateId( id )  ) {
        return res.status( 400 ).json( { message: 'Invalid request. Invalid parameter: id' } )
    }

    const index = tasks.findIndex( task => {
        return task.id === parseInt( id, 10 )
    } )

    if ( index === -1 ) {
        return res.status( 404 ).json( { message: "Invalid request. Task does not exist" } )
    }

    tasks.splice( index, 1 )

    return res.status( 200 ).send( { message: "Successfully deleted task" } )

} )

app.patch( '/todo/tasks/reorder/:id', ( req, res ) => {
    const { id } = req.params
    const newIndex = req.body.newOrder

    if ( validateId( id )  ) {
        return res.status( 400 ).json( { message: 'Invalid request. Invalid parameter: id' } )
    }

    //validate request body
    if ( newIndex === null ) {
        return res.status( 400 ).json( { message: 'Invalid request. Missing parameter: newOrder.' } )
    }

    if ( ! isNaN( newIndex ) && parseInt( newIndex, 10 ) < 0 ) { // newIndex must be a non-negative integer
        return res.status( 400 ).json( { message: "Invalid request. Invalid parameter: newOrder" } )
    }

    if ( newIndex > tasks.length - 1 ) {
        return res.status( 400 ).json( { message: "Invalid request. Invalid parameter: newOrder exceeds size" } )
    }

    const oldIndex = tasks.findIndex( task => task.id === parseInt( id, 10 ) )

    if ( oldIndex === -1 ) {
        return res.status( 404 ).json( { message: "Invalid request. Task does not exist" } )
    }

    taskReorder( tasks, oldIndex, newIndex )

    return res.status( 200 ).json( { message: "Successfully reordered task" } )

} )

const taskReorder = ( arr, oldIndex, newIndex ) => {
    arr.splice( newIndex, 0, arr.splice( oldIndex, 1 )[0] )
}

const validateIsCompleted = ( isCompleted ) => {

    if ( ! isCompleted ) {
        return {
            isValid: false,
            message: 'Invalid request. Missing parameter: isCompleted',
        }
    }

    if ( typeof isCompleted !== 'string' || ! [ 'yes', 'no' ].includes( isCompleted ) ) {
        return {
            isValid: false,
            message: 'Invalid request. Invalid parameter: isCompleted',
        }
    }

    return {
        isValid: true,
        message: '',
    }

}

const validateDescription = ( description ) => {

    if ( ! description ) {
        return {
            isValid: false,
            message: 'Invalid request. Missing parameter: description',
        }
    }

    if ( typeof description !== 'string' ) {
        return {
            isValid: false,
            message: 'Invalid request. Invalid parameter: description',
        }
    }

    return {
        isValid: true,
        message: '',
    }

}

const validateId = id => {
    return isNaN( id ) || parseInt( id, 10 ) <= 0
}