'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  Plus, 
  Calendar, 
  Clock, 
  UserCheck, 
  CheckCircle, 
  X,
  Search,
  Filter
} from 'lucide-react'

interface Doctor {
  id: number
  firstName: string
  lastName: string
  specialization: string
  location: string
  isAvailable: boolean
}

interface Appointment {
  id: number
  patientName: string
  patientPhone?: string
  patientEmail?: string
  notes?: string
  status: 'booked' | 'in_progress' | 'completed' | 'cancelled'
  type: 'walk_in' | 'scheduled'
  appointmentDate: string
  appointmentTime: string
  duration: number
  doctor: Doctor
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    notes: '',
    appointmentDate: new Date().toISOString().split('T')[0],
    appointmentTime: '',
    duration: 30,
    doctorId: '',
    type: 'scheduled' as const,
  })

  useEffect(() => {
    fetchData()
  }, [selectedDate])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
      const [appointmentsRes, doctorsRes] = await Promise.all([
        axios.get(`http://localhost:3001/appointments/date/${selectedDate}`, config),
        axios.get('http://localhost:3001/doctors/available', config),
      ])
      setAppointments(appointmentsRes.data)
      setDoctors(doctorsRes.data)
    } catch (error) {
      toast.error('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  const bookAppointment = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
      
      // Prepare the data for the backend
      const appointmentData = {
        ...formData,
        doctorId: parseInt(formData.doctorId as string),
        type: formData.type === 'scheduled' ? 'scheduled' : 'walk_in'
      }
      
      await axios.post('http://localhost:3001/appointments', appointmentData, config)
      toast.success('Appointment booked successfully')
      setShowAddForm(false)
      setFormData({
        patientName: '',
        patientPhone: '',
        patientEmail: '',
        notes: '',
        appointmentDate: new Date().toISOString().split('T')[0],
        appointmentTime: '',
        duration: 30,
        doctorId: '',
        type: 'scheduled' as const,
      })
      fetchData()
    } catch (error: any) {
      console.error('Appointment booking error:', error.response?.data || error.message)
      if (error.response?.data?.message) {
        toast.error(`Failed to book appointment: ${error.response.data.message}`)
      } else {
        toast.error('Failed to book appointment')
      }
    }
  }

  const updateStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem('token')
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
      await axios.patch(`http://localhost:3001/appointments/${id}/status`, { status }, config)
      toast.success('Status updated')
      fetchData()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const cancelAppointment = async (id: number) => {
    try {
      const token = localStorage.getItem('token')
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
      await axios.delete(`http://localhost:3001/appointments/${id}`, config)
      toast.success('Appointment cancelled')
      fetchData()
    } catch (error) {
      toast.error('Failed to cancel appointment')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'booked':
        return <Calendar className="h-5 w-5 text-blue-500" />
      case 'in_progress':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'cancelled':
        return <X className="h-5 w-5 text-red-500" />
      default:
        return <Calendar className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked':
        return 'status-booked'
      case 'in_progress':
        return 'status-in-progress'
      case 'completed':
        return 'status-completed'
      case 'cancelled':
        return 'status-cancelled'
      default:
        return 'badge-secondary'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner h-8 w-8"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Appointments</h1>
          <p className="page-subtitle">Manage patient appointments and scheduling</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary"
        >
          <Plus className="h-5 w-5 mr-2" />
          Book Appointment
        </button>
      </div>

      {/* Date Filter */}
      <div className="card mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-secondary-700">Filter by Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input w-auto"
          />
        </div>
      </div>

      {/* Add Appointment Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content p-6">
            <div className="modal-header">
              <h3 className="modal-title">Book Appointment</h3>
            </div>
            <form onSubmit={bookAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Name *
                </label>
                <input
                  type="text"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.patientPhone}
                  onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.patientEmail}
                  onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Doctor *
                </label>
                <select
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">Select a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time *
                </label>
                <input
                  type="time"
                  value={formData.appointmentTime}
                  onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="input"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="input"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="walk_in">Walk-in</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input"
                  rows={3}
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn btn-primary flex-1">
                  Book Appointment
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointments List */}
      <div className="table-container">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">
                  Patient
                </th>
                <th className="table-header-cell">
                  Doctor
                </th>
                <th className="table-header-cell">
                  Date & Time
                </th>
                <th className="table-header-cell">
                  Status
                </th>
                <th className="table-header-cell">
                  Type
                </th>
                <th className="table-header-cell">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="table-body">
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="table-row">
                  <td className="table-cell">
                    <div>
                      <div className="text-sm font-medium text-secondary-900">
                        {appointment.patientName}
                      </div>
                      {appointment.patientPhone && (
                        <div className="text-sm text-secondary-500">{appointment.patientPhone}</div>
                      )}
                      {appointment.patientEmail && (
                        <div className="text-sm text-secondary-500">{appointment.patientEmail}</div>
                      )}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div>
                      <div className="text-sm font-medium text-secondary-900">
                        Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                      </div>
                      <div className="text-sm text-secondary-500">{appointment.doctor.specialization}</div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div>
                      <div className="text-sm font-medium text-secondary-900">
                        {new Date(appointment.appointmentDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-secondary-500">
                        {appointment.appointmentTime} ({appointment.duration} min)
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center">
                      {getStatusIcon(appointment.status)}
                      <span className={`ml-2 badge ${getStatusColor(appointment.status)}`}>
                        {appointment.status.replace('_', ' ').charAt(0).toUpperCase() + appointment.status.replace('_', ' ').slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${
                      appointment.type === 'walk_in' ? 'badge-warning' : 'badge-primary'
                    }`}>
                      {appointment.type.replace('_', ' ').charAt(0).toUpperCase() + appointment.type.replace('_', ' ').slice(1)}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      {appointment.status === 'booked' && (
                        <>
                          <button
                            onClick={() => updateStatus(appointment.id, 'in_progress')}
                            className="btn btn-sm btn-success"
                          >
                            Start
                          </button>
                          <button
                            onClick={() => updateStatus(appointment.id, 'cancelled')}
                            className="btn btn-sm btn-danger"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {appointment.status === 'in_progress' && (
                        <button
                          onClick={() => updateStatus(appointment.id, 'completed')}
                          className="btn btn-sm btn-success"
                        >
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => cancelAppointment(appointment.id)}
                        className="btn btn-sm btn-secondary"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {appointments.length === 0 && (
          <div className="text-center py-12 text-secondary-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-secondary-300" />
            <p className="text-lg font-medium">No appointments for this date</p>
            <p className="text-sm">Try selecting a different date or book a new appointment</p>
          </div>
        )}
      </div>
    </div>
  )
}
