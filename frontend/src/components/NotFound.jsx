import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div>
            <h2>Error 404</h2>
            <button className='bg-violet-400'>
                <Link to={"/"} className='text-black'>Go Back To HomePage</Link>
            </button>
        </div>
    )
}

export default NotFound