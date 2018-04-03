import React from 'react'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {logout} from './store'

const UserPage = (props) => {
  const {user, handleClick} = props

  if (!user.id) {
    return <Redirect to='/' />
  }

  return (
    <div className='h100 w100 flex column align-items-center justify-center'>
      <div className='flex'>
        <img src={user.imageUrl} className='rounded mr1' />
        <h1>Welcome back {user.email}!</h1>
      </div>
      <div>
        <button className='btn bg-red white p1 rounded' onClick={handleClick}>Logout</button>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleClick () {
      dispatch(logout())
        .then(() => {
          ownProps.history.push('/')
        })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPage)
