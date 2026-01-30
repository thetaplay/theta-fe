'use client'

import { useEffect, useMemo, useState } from 'react'
import { PageLayout } from '@/components/layout/PageLayout'
import { supabase } from '@/lib/supabaseClient'
import AdminSubmitQuestionModal, { AdminQuestionSubmission } from '@/components/admin/AdminSubmitQuestionModal'
import { EventCard } from '@/components/EventCard'

type AdminEvent = {
  id: string
  title: string
  category: string
  date: string | null
  question: string | null
  impact: string | null
  icon: string | null
  status: 'ongoing' | 'completed' | 'draft' | null
  photo_url: string | null
}

const iconFromName = (name?: string | null) => {
  const { BoltFill, ChartLineUptrendXyaxis, DollarsignCircleFill } = require('@/components/sf-symbols')
  switch (name) {
    case 'BoltFill':
      return <BoltFill size={24} />
    case 'ChartLineUptrendXyaxis':
      return <ChartLineUptrendXyaxis size={24} />
    case 'DollarsignCircleFill':
      return <DollarsignCircleFill size={24} />
    default:
      return <BoltFill size={24} />
  }
}

const TABS = ['All', 'Ongoing', 'Completed'] as const

type Tab = (typeof TABS)[number]

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('All')
  const [events, setEvents] = useState<AdminEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openModal, setOpenModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('events')
        .select('id, title, category, date, question, impact, icon, status, photo_url')
        .order('created_at', { ascending: false })

      if (error) setError(error.message)
      else setEvents(data ?? [])
      setLoading(false)
    }
    fetchEvents()
  }, [])

  const filtered = useMemo(() => {
    if (tab === 'All') return events
    if (tab === 'Ongoing') return events.filter(e => e.status === 'ongoing')
    if (tab === 'Completed') return events.filter(e => e.status === 'completed')
    return events
  }, [events, tab])

  const handleSubmit = async (data: AdminQuestionSubmission) => {
    setSubmitting(true)
    try {
      // Upload photo to Supabase Storage
      let photoUrl: string | null = null
      if (data.photo) {
        const fileExt = data.photo.name.split('.').pop()
        const filePath = `events/${crypto.randomUUID()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(filePath, data.photo, { contentType: data.photo.type })
        if (uploadError) {
          console.error('Upload error:', uploadError)
          throw new Error(`Photo upload failed: ${uploadError.message}`)
        }
        const { data: publicData } = supabase.storage.from('event-images').getPublicUrl(filePath)
        photoUrl = publicData?.publicUrl ?? null
      }

      // Compose end date/time
      const endAt = new Date(`${data.endDate}T${data.endTime}:00`)
      const dateString = endAt.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

      const icon = data.category === 'Economic Events' || data.category === 'Business' ? 'ChartLineUptrendXyaxis' :
        data.category === 'Crypto Events' ? 'BoltFill' :
          data.category === 'Web3' ? 'BoltFill' :
            'ChartLineUptrendXyaxis'

      const status = endAt > new Date() ? 'ongoing' : 'completed'

      console.log('Inserting event:', {
        slug: data.slug,
        title: data.title,
        category: data.category,
        date: dateString,
        question: data.question,
        impact: data.impact,
        icon,
        why_it_matters: data.whyItMatters,
        status,
        photo_url: photoUrl,
        description: data.description,
        end_at: endAt.toISOString(),
      })

      const { error: insertError, data: insertedData } = await supabase
        .from('events')
        .insert({
          slug: data.slug,
          title: data.title,
          category: data.category,
          date: dateString,
          question: data.question,
          impact: data.impact,
          icon,
          why_it_matters: data.whyItMatters,
          status,
          photo_url: photoUrl,
          description: data.description,
          end_at: endAt.toISOString(),
        })
        .select()

      if (insertError) {
        console.error('Insert error:', insertError)
        throw new Error(`Failed to save event: ${insertError.message}`)
      }

      console.log('Event created successfully:', insertedData)

      // Refresh list
      const { data: refreshed } = await supabase
        .from('events')
        .select('id, title, category, date, question, impact, icon, status, photo_url')
        .order('created_at', { ascending: false })
      setEvents(refreshed ?? [])
      setOpenModal(false)
    } catch (err) {
      console.error('Submit error:', err)
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error occurred'}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageLayout
      title="Admin"
      rightContent={
        <button onClick={() => setOpenModal(true)} className="px-4 py-2 rounded-xl bg-primary text-white font-bold shadow-sm active:scale-95">
          Create Event
        </button>
      }
    >
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-2 rounded-xl border ${tab === t ? 'bg-primary text-white border-primary' : 'bg-card border-border text-foreground'} font-bold text-xs active:scale-95`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">Loading events...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 text-sm">Failed to load: {error}</p>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              icon={iconFromName(event.icon)}
              title={event.title}
              date={event.date ?? ''}
              impact={(event.impact ?? 'Medium') as 'Low' | 'Medium' | 'High'}
              category={event.category}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">No events</p>
          </div>
        )}
      </div>

      <AdminSubmitQuestionModal isOpen={openModal} onClose={() => setOpenModal(false)} onSubmit={handleSubmit} isLoading={submitting} />
    </PageLayout>
  )
}
