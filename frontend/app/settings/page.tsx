'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  Settings, 
  Edit, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle, 
  X,
  Search,
  Filter
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { User, Shield, Database, Info } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'system', name: 'System', icon: Database },
    { id: 'about', name: 'About', icon: Info },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and system preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {activeTab === 'profile' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.username}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{user?.role}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Change Password</label>
                    <p className="mt-1 text-sm text-gray-500">
                      Contact your administrator to change your password.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Two-Factor Authentication</label>
                    <p className="mt-1 text-sm text-gray-500">
                      Two-factor authentication is not currently enabled.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">System Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Version</label>
                    <p className="mt-1 text-sm text-gray-900">1.0.0</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Database</label>
                    <p className="mt-1 text-sm text-gray-900">MySQL</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Backend</label>
                    <p className="mt-1 text-sm text-gray-900">NestJS</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Frontend</label>
                    <p className="mt-1 text-sm text-gray-900">Next.js</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">About Front Desk System</h3>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    The Front Desk System is a comprehensive clinic management solution designed to streamline 
                    patient queue management, appointment scheduling, and doctor profile management.
                  </p>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Features</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Patient queue management with priority levels</li>
                      <li>• Appointment booking and scheduling</li>
                      <li>• Doctor profile and availability management</li>
                      <li>• Staff account management</li>
                      <li>• Real-time dashboard with statistics</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Technology Stack</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Backend: NestJS, TypeORM, MySQL</li>
                      <li>• Frontend: Next.js, TypeScript, Tailwind CSS</li>
                      <li>• Authentication: JWT, Passport</li>
                      <li>• Database: MySQL</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
