'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  Users, 
  UserCheck, 
  Calendar, 
  List,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import PageHeader from '@/components/PageHeader'

interface DashboardStats {
  queue: {
    waiting: number
    withDoctor: number
    completed: number
    total: number
  }
  appointments: {
    today: number
    upcoming: number
    completed: number
  }
  doctors: {
    total: number
    available: number
  }
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const [queueStats, appointments, doctors] = await Promise.all([
        axios.get('http://localhost:3001/queue/stats'),
        axios.get('http://localhost:3001/appointments'),
        axios.get('http://localhost:3001/doctors'),
      ])

      const today = new Date().toISOString().split('T')[0]
      const todayAppointments = appointments.data.filter((apt: any) => 
        apt.appointmentDate.startsWith(today)
      )

      setStats({
        queue: queueStats.data,
        appointments: {
          today: todayAppointments.length,
          upcoming: appointments.data.filter((apt: any) => apt.status === 'booked').length,
          completed: appointments.data.filter((apt: any) => apt.status === 'completed').length,
        },
        doctors: {
          total: doctors.data.length,
          available: doctors.data.filter((doc: any) => doc.isAvailable).length,
        },
      })
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
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
      <PageHeader title="Dashboard" subtitle="Welcome to the Front Desk System" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Queue Stats */}
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <List className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-secondary-600 truncate">Queue</dt>
                <dd className="text-lg font-semibold text-secondary-900">
                  {stats?.queue.waiting || 0} waiting
                </dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Appointments */}
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-secondary-600 truncate">Today's Appointments</dt>
                <dd className="text-lg font-semibold text-secondary-900">
                  {stats?.appointments.today || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Doctors */}
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserCheck className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-secondary-600 truncate">Available Doctors</dt>
                <dd className="text-lg font-semibold text-secondary-900">
                  {stats?.doctors.available || 0} / {stats?.doctors.total || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-secondary-600 truncate">Completed Today</dt>
                <dd className="text-lg font-semibold text-secondary-900">
                  {stats?.appointments.completed || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="space-y-3">
            <a
              href="/queue"
              className="flex items-center p-3 rounded-lg border border-secondary-200 hover:bg-secondary-50 transition-colors"
            >
              <List className="h-5 w-5 text-primary-600 mr-3" />
              <span className="text-sm font-medium text-secondary-900">Manage Queue</span>
            </a>
            <a
              href="/appointments"
              className="flex items-center p-3 rounded-lg border border-secondary-200 hover:bg-secondary-50 transition-colors"
            >
              <Calendar className="h-5 w-5 text-green-600 mr-3" />
              <span className="text-sm font-medium text-secondary-900">Book Appointment</span>
            </a>
            <a
              href="/doctors"
              className="flex items-center p-3 rounded-lg border border-secondary-200 hover:bg-secondary-50 transition-colors"
            >
              <UserCheck className="h-5 w-5 text-blue-600 mr-3" />
              <span className="text-sm font-medium text-secondary-900">Manage Doctors</span>
            </a>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-secondary-600">
              <Clock className="h-4 w-4 mr-2" />
              <span>Queue updated - {stats?.queue.waiting || 0} patients waiting</span>
            </div>
            <div className="flex items-center text-sm text-secondary-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{stats?.appointments.today || 0} appointments scheduled for today</span>
            </div>
            <div className="flex items-center text-sm text-secondary-600">
              <UserCheck className="h-4 w-4 mr-2" />
              <span>{stats?.doctors.available || 0} doctors available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
