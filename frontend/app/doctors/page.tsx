'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  Plus, 
  UserCheck, 
  MapPin, 
  Clock, 
  Edit, 
  Trash2,
  Search,
  Filter
} from 'lucide-react'

interface Doctor {
  id: number
  firstName: string
  lastName: string
  specialization: string
  gender: string
  location: string
  description?: string
  isAvailable: boolean
  availability?: any
}

const specializations = [
  'general',
  'cardiology',
  'dermatology',
  'orthopedics',
  'pediatrics',
  'neurology',
  'psychiatry',
  'surgery'
]

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    specialization: '',
    gender: '',
    location: '',
    description: '',
    isAvailable: true,
  })

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token')
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
      const response = await axios.get('http://localhost:3001/doctors', config)
      setDoctors(response.data)
    } catch (error) {
      toast.error('Failed to load doctors')
    } finally {
      setLoading(false)
    }
  }

  const addDoctor = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
      
      // Prepare the data for the backend
      const doctorData = {
        ...formData,
        specialization: formData.specialization.toLowerCase(),
        gender: formData.gender.toLowerCase()
      }
      
      await axios.post('http://localhost:3001/doctors', doctorData, config)
      toast.success('Doctor added successfully')
      setShowAddForm(false)
      setFormData({
        firstName: '',
        lastName: '',
        specialization: '',
        gender: '',
        location: '',
        description: '',
        isAvailable: true,
      })
      fetchDoctors()
    } catch (error: any) {
      console.error('Add doctor error:', error.response?.data || error.message)
      if (error.response?.data?.message) {
        toast.error(`Failed to add doctor: ${error.response.data.message}`)
      } else {
        toast.error('Failed to add doctor')
      }
    }
  }

  const updateDoctor = async (id: number, data: Partial<Doctor>) => {
    try {
      const token = localStorage.getItem('token')
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
      await axios.patch(`http://localhost:3001/doctors/${id}`, data, config)
      toast.success('Doctor updated successfully')
      fetchDoctors()
    } catch (error) {
      toast.error('Failed to update doctor')
    }
  }

  const deleteDoctor = async (id: number) => {
    if (!confirm('Are you sure you want to delete this doctor?')) return
    
    try {
      const token = localStorage.getItem('token')
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
      await axios.delete(`http://localhost:3001/doctors/${id}`, config)
      toast.success('Doctor deleted successfully')
      fetchDoctors()
    } catch (error) {
      toast.error('Failed to delete doctor')
    }
  }

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSpecialization = !selectedSpecialization || doctor.specialization === selectedSpecialization
    
    return matchesSearch && matchesSpecialization
  })

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
          <h1 className="page-title">Doctors</h1>
          <p className="page-subtitle">Manage doctor profiles and availability</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Doctor
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-secondary-700 mb-1">Search</label>
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search doctors..."
                className="search-input"
              />
            </div>
          </div>
          <div className="md:w-48">
            <label className="block text-sm font-medium text-secondary-700 mb-1">Specialization</label>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="input"
            >
              <option value="">All Specializations</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec.charAt(0).toUpperCase() + spec.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Add Doctor Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Doctor</h3>
            <form onSubmit={addDoctor} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="input"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization *
                </label>
                <select
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">Select specialization</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec.charAt(0).toUpperCase() + spec.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input"
                  rows={3}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-900">
                  Available
                </label>
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="btn btn-primary flex-1">
                  Add Doctor
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

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <UserCheck className="h-5 w-5 text-primary-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Dr. {doctor.firstName} {doctor.lastName}
                  </h3>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="font-medium">Specialization:</span>
                    <span className="ml-2 capitalize">{doctor.specialization}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Gender:</span>
                    <span className="ml-2 capitalize">{doctor.gender}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{doctor.location}</span>
                  </div>
                  {doctor.description && (
                    <div>
                      <span className="font-medium">Description:</span>
                      <p className="mt-1 text-gray-500">{doctor.description}</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    doctor.isAvailable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {doctor.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => updateDoctor(doctor.id, { isAvailable: !doctor.isAvailable })}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteDoctor(doctor.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No doctors found
        </div>
      )}
    </div>
  )
}
