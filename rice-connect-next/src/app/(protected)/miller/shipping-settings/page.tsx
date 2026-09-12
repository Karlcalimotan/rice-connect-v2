'use client'

import { useEffect, useState } from 'react'
// Supabase kept — API route uses MillerDeliverySetting (different fields), page uses shipping_settings
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import PrimaryButton from '@/components/ui/PrimaryButton'
import TextInput from '@/components/ui/TextInput'
import InputLabel from '@/components/ui/InputLabel'
import InputError from '@/components/ui/InputError'

type ShippingSetting = {
  id: number
  miller_id: string
  shipping_fee_per_kg: number | null
  minimum_order_kg: number | null
  free_shipping_above_kg: number | null
  shipping_municipalities: string[] | null
  estimated_delivery_days: number | null
}

export default function MillerShippingSettingsPage() {
  const { user } = useUser()
  const [settings, setSettings] = useState<ShippingSetting | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    shippingFeePerKg: '',
    minimumOrderKg: '',
    freeShippingAboveKg: '',
    estimatedDeliveryDays: '',
    shippingMunicipalities: '',
  })

  useEffect(() => {
    if (!user) return

    const fetchSettings = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('shipping_settings')
        .select('*')
        .eq('miller_id', user.id)
        .single()

      if (data) {
        setSettings(data)
        setForm({
          shippingFeePerKg: data.shipping_fee_per_kg?.toString() || '',
          minimumOrderKg: data.minimum_order_kg?.toString() || '',
          freeShippingAboveKg: data.free_shipping_above_kg?.toString() || '',
          estimatedDeliveryDays: data.estimated_delivery_days?.toString() || '',
          shippingMunicipalities: data.shipping_municipalities?.join(', ') || '',
        })
      }
      setLoading(false)
    }

    fetchSettings()
  }, [user])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    setSuccess(false)

    const supabase = createClient()

    const data = {
      miller_id: user.id,
      shipping_fee_per_kg: form.shippingFeePerKg ? parseFloat(form.shippingFeePerKg) : null,
      minimum_order_kg: form.minimumOrderKg ? parseFloat(form.minimumOrderKg) : null,
      free_shipping_above_kg: form.freeShippingAboveKg ? parseFloat(form.freeShippingAboveKg) : null,
      estimated_delivery_days: form.estimatedDeliveryDays ? parseInt(form.estimatedDeliveryDays) : null,
      shipping_municipalities: form.shippingMunicipalities
        ? form.shippingMunicipalities.split(',').map((s) => s.trim()).filter(Boolean)
        : null,
    }

    if (settings) {
      await supabase.from('shipping_settings').update(data).eq('id', settings.id)
    } else {
      await supabase.from('shipping_settings').insert(data)
    }

    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Shipping Settings</h1>
      <p className="mt-2 text-gray-600">Configure shipping fees and delivery options for your buyers</p>

      <div className="mt-6 max-w-xl space-y-4">
        <div>
          <InputLabel value="Shipping Fee per kg (₱)" />
          <TextInput
            type="number"
            step="0.01"
            min="0"
            value={form.shippingFeePerKg}
            onChange={(e) => setForm({ ...form, shippingFeePerKg: e.target.value })}
            className="mt-1 w-full"
            placeholder="e.g. 5.00"
          />
          <p className="mt-1 text-xs text-gray-400">Leave blank for free shipping on all orders</p>
        </div>

        <div>
          <InputLabel value="Minimum Order (kg)" />
          <TextInput
            type="number"
            step="1"
            min="0"
            value={form.minimumOrderKg}
            onChange={(e) => setForm({ ...form, minimumOrderKg: e.target.value })}
            className="mt-1 w-full"
            placeholder="e.g. 50"
          />
        </div>

        <div>
          <InputLabel value="Free Shipping Above (kg)" />
          <TextInput
            type="number"
            step="1"
            min="0"
            value={form.freeShippingAboveKg}
            onChange={(e) => setForm({ ...form, freeShippingAboveKg: e.target.value })}
            className="mt-1 w-full"
            placeholder="e.g. 200"
          />
          <p className="mt-1 text-xs text-gray-400">Orders above this weight ship free</p>
        </div>

        <div>
          <InputLabel value="Estimated Delivery (days)" />
          <TextInput
            type="number"
            min="1"
            value={form.estimatedDeliveryDays}
            onChange={(e) => setForm({ ...form, estimatedDeliveryDays: e.target.value })}
            className="mt-1 w-full"
            placeholder="e.g. 3"
          />
        </div>

        <div>
          <InputLabel value="Shipping Municipalities" />
          <TextInput
            value={form.shippingMunicipalities}
            onChange={(e) => setForm({ ...form, shippingMunicipalities: e.target.value })}
            className="mt-1 w-full"
            placeholder="e.g. Iloilo City, Miagao, Tigbauan"
          />
          <p className="mt-1 text-xs text-gray-400">Comma-separated list of municipalities you ship to</p>
        </div>

        <div className="flex items-center gap-4">
          <PrimaryButton onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </PrimaryButton>
          {success && (
            <p className="text-sm font-medium text-green-600">Settings saved!</p>
          )}
        </div>
      </div>
    </div>
  )
}
