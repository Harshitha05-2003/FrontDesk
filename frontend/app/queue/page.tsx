'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  Plus, 
  Clock, 
  UserCheck, 
  CheckCircle, 
  X,
  AlertCircle,
  Crown,
  QueueList
} from 'lucide-react'
import PageHeader from '@/components/PageHeader'

interface QueueItem {
  id: number
  queueNumber: number
  patientName: string
  patientPhone?: string
  patientEmail?: string
  reason?: string
  status: 'waiting' | 'with_doctor' | 'completed' | 'cancelled'
  priority: 'normal' | 'urgent' | 'vip'
  checkInTime: string
  calledTime?: string
  completedTime?: string
  estimatedWaitTime?: number
}

export default function QueuePage() {
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    reason: '',
    priority: 'normal' as const,
  })

  useEffect(() => {
    fetchQueue()
  }, [])

  const fetchQueue = async () => {
    try {
      const token = localStorage.getItem('token')
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
      
      const response = await axios.get('http://localhost:3001/queue/active', config)
      setQueue(response.data)
    } catch (error) {
      toast.error('Failed to load queue')
    } finally {
      setLoading(false)
    }
  }

  const addToQueue = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
      await axios.post('http://localhost:3001/queue', formData, config)
      toast.success('Patient added to queue')
      setShowAddForm(false)
      setFormData({
        patientName: '',
        patientPhone: '',
        patientEmail: '',
        reason: '',
        priority: 'normal',
      })
      fetchQueue()
    } catch (error) {
      toast.error('Failed to add patient to queue')
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
      await axios.patch(`http://localhost:3001/queue/${id}/status`, { status }, config)
      toast.success('Status updated')
      fetchQueue()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const removeFromQueue = async (id: number) => {
    try {
      const token = localStorage.getItem('token')
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
      await axios.delete(`http://localhost:3001/queue/${id}`, config)
      toast.success('Patient removed from queue')
      fetchQueue()
    } catch (error) {
      toast.error('Failed to remove patient')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'with_doctor':
        return <UserCheck className="h-5 w-5 text-blue-500" />
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'cancelled':
        return <X className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'vip':
        return <Crown className="h-4 w-4 text-yellow-500" />
      case 'urgent':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800'
      case 'with_doctor':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
      <PageHeader title="Queue Management" subtitle="Manage patient queue and walk-in patients">
        <div className="hidden md:flex items-center gap-4 mr-2 text-secondary-600">
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            <span>Active: {queue.filter(q => q.status === 'waiting' || q.status === 'with_doctor').length}</span>
          </div>
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Urgent: {queue.filter(q => q.priority === 'urgent' && (q.status === 'waiting' || q.status === 'with_doctor')).length}</span>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Patient
        </button>
      </PageHeader>

      {/* Add Patient Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content p-6">
            <div className="modal-header flex items-center justify-between">
              <h3 className="modal-title">Add Patient to Queue</h3>
              <button onClick={() => setShowAddForm(false)} className="btn btn-sm btn-secondary">Close</button>
            </div>
            <form onSubmit={addToQueue} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
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
                <label className="block text-sm font-medium text-secondary-700 mb-1">
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
                <label className="block text-sm font-medium text-secondary-700 mb-1">
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
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Reason
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="input"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="input"
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="vip">VIP</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn btn-primary flex-1">
                  Add to Queue
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

      {/* Queue List */}
      <div className="table-container">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">
                  Queue #
                </th>
                <th className="table-header-cell">
                  Patient
                </th>
                <th className="table-header-cell">
                  Priority
                </th>
                <th className="table-header-cell">
                  Status
                </th>
                <th className="table-header-cell">
                  Check-in Time
                </th>
                <th className="table-header-cell">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="table-body">
              {queue.map((item) => (
                <tr key={item.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-primary-600">
                        #{item.queueNumber}
                      </span>
                      {getPriorityIcon(item.priority)}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div>
                      <div className="text-sm font-medium text-secondary-900">
                        {item.patientName}
                      </div>
                      {item.patientPhone && (
                        <div className="text-sm text-secondary-500">{item.patientPhone}</div>
                      )}
                      {item.reason && (
                        <div className="text-sm text-secondary-500">{item.reason}</div>
                      )}
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${
                      item.priority === 'vip' ? 'bg-yellow-100 text-yellow-800' :
                      item.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center">
                      {getStatusIcon(item.status)}
                      <span className={`ml-2 badge ${getStatusColor(item.status)}`}>
                        {item.status.replace('_', ' ').charAt(0).toUpperCase() + item.status.replace('_', ' ').slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell text-sm text-secondary-600">
                    {new Date(item.checkInTime).toLocaleTimeString()}
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      {item.status === 'waiting' && (
                        <>
                          <button
                            onClick={() => updateStatus(item.id, 'with_doctor')}
                            className="btn btn-sm btn-primary"
                          >
                            Call Patient
                          </button>
                          <button
                            onClick={() => updateStatus(item.id, 'cancelled')}
                            className="btn btn-sm btn-danger"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {item.status === 'with_doctor' && (
                        <button
                          onClick={() => updateStatus(item.id, 'completed')}
                          className="btn btn-sm btn-success"
                        >
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => removeFromQueue(item.id)}
                        className="btn btn-sm btn-secondary"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}}
            </tbody>
          </table>
        </div>
        {queue.length === 0 && (
          <div className="text-center py-12 text-secondary-500">
            <Clock className="h-12 w-12 mx-auto mb-4 text-secondary-300" />
            <p className="text-lg font-medium">No patients in queue</p>
            <p className="text-sm">Add a new patient to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
