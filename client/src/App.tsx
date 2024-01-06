import React, { useEffect, useState } from 'react'

const API_URL = 'http://localhost:8080'

function App() {
  const [data, setData] = useState<string>()

  useEffect(() => {
    getData()
  }, [])

  //Don't save cookie here in case data has been compromised
  const getData = async () => {
    const response = await fetch(API_URL)
    const { data, token } = await response.json()

    localStorage.setItem('bequest-token', token)
    setData(data.data)
  }

  //When changed, save a cookie so the user can restore some data if server is compromised
  const handleChange = (value: string) => {
    setData(value)
    document.cookie = value
  }

  //Verify user identity with token sent to server
  const updateData = async () => {
    let token = localStorage.getItem('bequest-token')
    let resp = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ data, token }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (resp.status === 200) {
      await getData()
    } else {
      alert('Unauthorized')
    }
  }

  //I'm not sure exactly what the verify function is supposed to do, but this compares the token to the server
  //To check if it works, delete token from the body. That will trigger the error
  const verifyData = async () => {
    let cookieArr = document.cookie.split(';')
    let token = localStorage.getItem('bequest-token')
    let resp = await fetch(API_URL + '/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    if (resp.status === 200) {
      alert('Data verified')
    } else {
      alert(
        'Data has been tampered with. If you have recently made any changes, they have been recovered.'
      )
      //If a user has made any changes without updating, it should be saved in the cookie
      setData(cookieArr[cookieArr.length - 1].trim())
    }
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        position: 'absolute',
        padding: 0,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '20px',
        fontSize: '30px'
      }}
    >
      <div>Saved Data</div>
      <input
        style={{ fontSize: '30px' }}
        type='text'
        value={data}
        onChange={(e) => handleChange(e.target.value)}
      />

      <div style={{ display: 'flex', gap: '10px' }}>
        <button style={{ fontSize: '20px' }} onClick={updateData}>
          Update Data
        </button>
        <button style={{ fontSize: '20px' }} onClick={verifyData}>
          Verify Data
        </button>
      </div>
    </div>
  )
}

export default App
