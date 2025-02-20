import { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { port } from '../../port.js'
const MySwal = withReactContent(Swal)
import { CRow, CCol, CWidgetStatsA } from '@coreui/react'
import { CSpinner } from '@coreui/react'

const DailyWheel = () => {
  const defaultData = {
    1: '0',
    2: '0',
    3: '0',
    4: '0',
    5: '0',
    6: '0',
    7: '0',
    8: '0',
    9: '0',
    10: '0',
    11: '0',
    12: '0',
    13: '0',
    14: '0',
    15: '0',
    16: '0',
    17: '0',
    18: '0',
  }

  const [wheelData, setWheelData] = useState(defaultData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${port}dailywheeldata`, {
          headers: { Accept: 'application/json' },
        })

        const result = response

        if (result.status === 200 && result.data) {
          const apiData = result.data.data[0].dailyWheelData
          const formattedData = Object.keys(apiData).reduce((acc, key) => {
            acc[key.replace('value', '')] = apiData[key]
            return acc
          }, {})
          setWheelData(formattedData)
        } else {
          setWheelData(defaultData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setWheelData(defaultData)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (/^\d*\.?\d*$/.test(value)) {
      setWheelData({ ...wheelData, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formattedData = Object.keys(wheelData).reduce((acc, key) => {
      acc[`value${key}`] = wheelData[key]
      return acc
    }, {})

    try {
      const response = await fetch(`${port}update_dailywheeldata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      })

      const result = await response.json()

      if (result.status === 200) {
        MySwal.fire({
          title: 'Updated!',
          text: result.msg,
          icon: 'success',
          confirmButtonText: 'OK',
        })
      } else {
        MySwal.fire({
          title: 'Error!',
          text: 'Failed to update',
          icon: 'error',
          confirmButtonText: 'Try Again',
        })
      }
    } catch (error) {
      MySwal.fire({
        title: 'Error!',
        text: 'Failed to update',
        icon: 'error',
        confirmButtonText: 'Try Again',
      })
    }
  }

  const entries = Object.entries(wheelData)
  const half = Math.ceil(entries.length / 2)
  const firstHalf = entries.slice(0, half)
  const secondHalf = entries.slice(half)

  if (loading) return <div className="d-flex justify-content-center">
    <CSpinner color="primary" />
  </div>

  return (
    <div className="container">
      <div className="p-4 min-h-screen">
        <form onSubmit={handleSubmit} className="p-4 shadow-md rounded-md" style={{ marginTop: "-50px", marginBottom: "10px" }}>
          <table className="w-3/4 border-collapse border border-gray-300 mx-auto">
            <thead>
              <tr>
                <th className="border p-4 text-left w-1/4">S.No</th>
                <th className="border p-4 text-left w-1/4">Value</th>
                <th className="border p-4 text-left w-1/4"></th>
                <th className="border p-4 text-left w-1/4">S.No</th>
                <th className="border p-4 text-left w-1/4">Value</th>
              </tr>
            </thead>
            <tbody>
              {firstHalf.map(([key1, value1], index) => {
                const [key2, value2] = secondHalf[index] || ['', '']
                return (
                  <tr key={key1}>
                    <td className="border p-4 font-semibold text-left">{key1}</td>
                    <td className="border p-4 text-left">
                      <input
                        type="text"
                        name={key1}
                        value={value1}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </td>
                    <td className="border p-4"></td>
                    <td className="border p-4 font-semibold text-left">{key2}</td>
                    <td className="border p-4 text-left">
                      {key2 && (
                        <input
                          type="text"
                          name={key2}
                          value={value2}
                          onChange={handleChange}
                          className="form-control"
                        />
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div className="flex justify-center mt-4 ">
            <div className="d-flex justify-content-center">
              <button
                type="submit"
                style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#6261cc', width: '200px', height: '50px', color: 'white', borderRadius: '5px', fontSize: '20px', marginTop: 0 }}
                className="form-control"
              >
                Update Data
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DailyWheel
