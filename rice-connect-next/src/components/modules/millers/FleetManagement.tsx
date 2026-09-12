'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import PrimaryButton from '@/components/ui/PrimaryButton'
import TextInput from '@/components/ui/TextInput'
import InputLabel from '@/components/ui/InputLabel'

type Driver = {
  id: string
  first_name: string
  last_name: string
  municipality: string
  contact: string | null
  is_verified_driver: boolean
}

export default function FleetManagement() {
  const { user } = useUser()
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [allDrivers, setAllDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!user) return

    const fetchFleet = async () => {
      const supabase = createClient()

      // Get assigned drivers
      const { data: fleetData } = await supabase
        .from('miller_driver')
        .select('driver:users!miller_driver_driver_id_fkey(id, first_name, last_name, municipality, contact, is_verified_driver)')
        .eq('miller_id', user.id)
        .eq('is_active', true)

      if (fleetData) {
        setDrivers(fleetData.map((f) => f.driver as unknown as Driver).filter(Boolean))
      }

      // Get all available drivers
      const { data: allDriverData } = await supabase
        .from('users')
        .select('id, first_name, last_name, municipality, contact, is_verified_driver')
        .eq('role', 'DRIVER')

      if (allDriverData) setAllDrivers(allDriverData)
      setLoading(false)
    }

    fetchFleet()
  }, [user])

  const handleAssignDriver = async (driverId: string) => {
    if (!user) return

    const supabase = createClient()
    const { error } = await supabase
      .from('miller_driver')
      .insert({
        miller_id: user.id,
        driver_id: driverId,
        is_active: true,
      })

    if (!error) {
      const driver = allDrivers.find((d) => d.id === driverId)
      if (driver) {
        setDrivers((prev) => [...prev, driver])
      }
    }
  }

  const handleRemoveDriver = async (driverId: string) => {
    if (!user) return

    const supabase = createClient()
    await supabase
      .from('miller_driver')
      .update({ is_active: false })
      .eq('miller_id', user.id)
      .eq('driver_id', driverId)

    setDrivers((prev) => prev.filter((d) => d.id !== driverId))
  }

  const availableDrivers = allDrivers.filter(
    (d) =>
      !drivers.some((fd) => fd.id === d.id) &&
      (d.first_name?.toLowerCase().includes(search.toLowerCase()) ||
        d.last_name?.toLowerCase().includes(search.toLowerCase()) ||
        d.municipality?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Fleet Management</h2>
        <PrimaryButton onClick={() => setShowAddModal(true)}>Add Driver</PrimaryButton>
      </div>

      <div className="mt-4">
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : drivers.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <p className="text-gray-500">No drivers in your fleet yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {drivers.map((driver) => (
              <div key={driver.id} className="flex items-center justify-between rounded-lg border bg-white p-3 shadow-sm">
                <div>
                  <p className="font-medium text-gray-900">{driver.first_name} {driver.last_name}</p>
                  <p className="text-xs text-gray-500">{driver.municipality}</p>
                  {driver.contact && <p className="text-xs text-gray-400">{driver.contact}</p>}
                </div>
                <div className="flex items-center gap-2">
                  {driver.is_verified_driver && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">Verified</span>
                  )}
                  <button
                    onClick={() => handleRemoveDriver(driver.id)}
                    className="text-xs font-medium text-red-600 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="text-lg font-semibold">Add Driver to Fleet</h2>
            <TextInput
              placeholder="Search drivers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mt-4 w-full"
            />
            <div className="mt-4 max-h-60 overflow-y-auto">
              {availableDrivers.length === 0 ? (
                <p className="text-sm text-gray-500">No available drivers found</p>
              ) : (
                <div className="space-y-2">
                  {availableDrivers.map((driver) => (
                    <div key={driver.id} className="flex items-center justify-between rounded border p-2">
                      <div>
                        <p className="text-sm font-medium">{driver.first_name} {driver.last_name}</p>
                        <p className="text-xs text-gray-500">{driver.municipality}</p>
                      </div>
                      <button
                        onClick={() => handleAssignDriver(driver.id)}
                        className="rounded bg-gray-900 px-3 py-1 text-xs font-semibold text-white hover:bg-gray-700"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => { setShowAddModal(false); setSearch('') }}
              className="mt-4 text-sm text-gray-600 hover:text-gray-900"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
