import React, { useEffect, useState } from 'react'

const API_URL = 'http://localhost:8080'

function App() {
  const [data, setData] = useState<string>()

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    const response = await fetch(API_URL)
    const { data, token } = await response.json()

    localStorage.setItem('bequest-token', token)
    document.cookie = data.data
    setData(data.data)
  }

  const handleChange = (value: string) => {
    setData(value)
    document.cookie = value
  }

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
