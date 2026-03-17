import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import * as kv from './kv_store.tsx'

const app = new Hono()

// Middleware
app.use('*', cors())
app.use('*', logger(console.log))

// Health check
app.get('/make-server-cdab8971/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Voice transcription (mock for now - in production would use Whisper API)
app.post('/make-server-cdab8971/voice/transcribe', async (c) => {
  try {
    const { audioData, language } = await c.req.json()
    
    // Mock transcription - in production, integrate with OpenAI Whisper or similar
    const mockTranscription = "I went to the hospital last Diwali for my diabetes checkup"
    
    return c.json({ 
      success: true, 
      transcription: mockTranscription,
      language: language || 'en',
      confidence: 0.95
    })
  } catch (error) {
    console.log('Voice transcription error:', error)
    return c.json({ success: false, error: String(error) }, 500)
  }
})

// AI Memory Structuring (mock for now - in production would use GPT-4 or similar)
app.post('/make-server-cdab8971/ai/structure', async (c) => {
  try {
    const { text, userId } = await c.req.json()
    
    // Mock AI structuring - in production, use OpenAI GPT-4 or similar
    const structured = {
      category: 'health',
      date: new Date('2023-10-24').toISOString(), // Last Diwali
      dateConfidence: 'inferred',
      people: [],
      location: 'hospital',
      importance: 'high',
      confidenceScore: 0.88,
      emotion: 'neutral',
      tags: ['diabetes', 'checkup', 'hospital'],
      summary: 'Hospital visit for diabetes checkup during Diwali',
      insights: 'Regular health monitoring pattern detected'
    }
    
    return c.json({ success: true, structured })
  } catch (error) {
    console.log('AI structuring error:', error)
    return c.json({ success: false, error: String(error) }, 500)
  }
})

// Create memory
app.post('/make-server-cdab8971/memory/create', async (c) => {
  try {
    const { userId, text, voiceUrl, structured } = await c.req.json()
    
    if (!userId || !text) {
      return c.json({ success: false, error: 'userId and text required' }, 400)
    }
    
    const memoryId = `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const memory = {
      id: memoryId,
      userId,
      text,
      voiceUrl,
      structured: structured || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(memoryId, memory)
    
    // Also add to user's memory list
    const userMemoriesKey = `user_memories_${userId}`
    const existingMemories = await kv.get(userMemoriesKey) || []
    await kv.set(userMemoriesKey, [...existingMemories, memoryId])
    
    return c.json({ success: true, memory })
  } catch (error) {
    console.log('Memory creation error:', error)
    return c.json({ success: false, error: String(error) }, 500)
  }
})

// Get memories for user
app.get('/make-server-cdab8971/memory/list', async (c) => {
  try {
    const userId = c.req.query('userId')
    const category = c.req.query('category')
    
    if (!userId) {
      return c.json({ success: false, error: 'userId required' }, 400)
    }
    
    const userMemoriesKey = `user_memories_${userId}`
    const memoryIds = await kv.get(userMemoriesKey) || []
    
    const memories = await kv.mget(memoryIds)
    
    // Filter by category if provided
    let filteredMemories = memories.filter(m => m !== null)
    if (category && category !== 'all') {
      filteredMemories = filteredMemories.filter(m => m.structured?.category === category)
    }
    
    // Sort by date (newest first)
    filteredMemories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    return c.json({ success: true, memories: filteredMemories })
  } catch (error) {
    console.log('Memory list error:', error)
    return c.json({ success: false, error: String(error) }, 500)
  }
})

// Delete memory
app.delete('/make-server-cdab8971/memory/:id', async (c) => {
  try {
    const memoryId = c.req.param('id')
    const userId = c.req.query('userId')
    
    if (!userId) {
      return c.json({ success: false, error: 'userId required' }, 400)
    }
    
    await kv.del(memoryId)
    
    // Remove from user's memory list
    const userMemoriesKey = `user_memories_${userId}`
    const existingMemories = await kv.get(userMemoriesKey) || []
    await kv.set(userMemoriesKey, existingMemories.filter(id => id !== memoryId))
    
    return c.json({ success: true })
  } catch (error) {
    console.log('Memory deletion error:', error)
    return c.json({ success: false, error: String(error) }, 500)
  }
})

// Document OCR (mock for now - in production would use Tesseract or cloud OCR)
app.post('/make-server-cdab8971/document/ocr', async (c) => {
  try {
    const { imageData, userId } = await c.req.json()
    
    // Mock OCR result
    const mockOCR = {
      text: "Aadhaar Card\nName: Rajesh Kumar\nDOB: 15/08/1975\nAadhaar Number: 1234 5678 9012",
      classification: 'identity',
      extractedData: {
        documentType: 'aadhaar',
        name: 'Rajesh Kumar',
        dob: '1975-08-15',
        number: '1234 5678 9012'
      },
      confidence: 0.92
    }
    
    const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const document = {
      id: documentId,
      userId,
      ...mockOCR,
      imageUrl: imageData, // In production, store in Supabase Storage
      createdAt: new Date().toISOString()
    }
    
    await kv.set(documentId, document)
    
    // Add to user's document list
    const userDocsKey = `user_documents_${userId}`
    const existingDocs = await kv.get(userDocsKey) || []
    await kv.set(userDocsKey, [...existingDocs, documentId])
    
    return c.json({ success: true, document })
  } catch (error) {
    console.log('OCR error:', error)
    return c.json({ success: false, error: String(error) }, 500)
  }
})

// Get documents
app.get('/make-server-cdab8971/document/list', async (c) => {
  try {
    const userId = c.req.query('userId')
    
    if (!userId) {
      return c.json({ success: false, error: 'userId required' }, 400)
    }
    
    const userDocsKey = `user_documents_${userId}`
    const docIds = await kv.get(userDocsKey) || []
    const documents = await kv.mget(docIds)
    
    return c.json({ 
      success: true, 
      documents: documents.filter(d => d !== null).sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    })
  } catch (error) {
    console.log('Document list error:', error)
    return c.json({ success: false, error: String(error) }, 500)
  }
})

// Health summary generation
app.post('/make-server-cdab8971/health/summary', async (c) => {
  try {
    const { userId } = await c.req.json()
    
    // Get all health-related memories
    const userMemoriesKey = `user_memories_${userId}`
    const memoryIds = await kv.get(userMemoriesKey) || []
    const memories = await kv.mget(memoryIds)
    
    const healthMemories = memories.filter(m => m?.structured?.category === 'health')
    
    // Mock health summary
    const summary = {
      conditions: ['Diabetes Type 2'],
      medications: ['Metformin 500mg'],
      allergies: ['Penicillin'],
      bloodGroup: 'O+',
      lastCheckup: healthMemories[0]?.structured?.date || new Date().toISOString(),
      upcomingReminders: [
        { type: 'medication', time: '08:00', description: 'Take Metformin' },
        { type: 'checkup', date: '2025-03-15', description: 'Diabetes follow-up' }
      ],
      riskAlerts: []
    }
    
    return c.json({ success: true, summary })
  } catch (error) {
    console.log('Health summary error:', error)
    return c.json({ success: false, error: String(error) }, 500)
  }
})

// Financial tracking
app.post('/make-server-cdab8971/finance/transaction', async (c) => {
  try {
    const { userId, type, amount, description, person } = await c.req.json()
    
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const transaction = {
      id: transactionId,
      userId,
      type, // 'income', 'expense', 'loan_given', 'loan_received'
      amount,
      description,
      person,
      date: new Date().toISOString()
    }
    
    await kv.set(transactionId, transaction)
    
    const userTransactionsKey = `user_transactions_${userId}`
    const existingTxns = await kv.get(userTransactionsKey) || []
    await kv.set(userTransactionsKey, [...existingTxns, transactionId])
    
    return c.json({ success: true, transaction })
  } catch (error) {
    console.log('Transaction error:', error)
    return c.json({ success: false, error: String(error) }, 500)
  }
})

app.get('/make-server-cdab8971/finance/list', async (c) => {
  try {
    const userId = c.req.query('userId')
    
    if (!userId) {
      return c.json({ success: false, error: 'userId required' }, 400)
    }
    
    const userTransactionsKey = `user_transactions_${userId}`
    const txnIds = await kv.get(userTransactionsKey) || []
    const transactions = await kv.mget(txnIds)
    
    return c.json({ 
      success: true, 
      transactions: transactions.filter(t => t !== null).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    })
  } catch (error) {
    console.log('Finance list error:', error)
    return c.json({ success: false, error: String(error) }, 500)
  }
})

// Government schemes detection
app.post('/make-server-cdab8971/schemes/detect', async (c) => {
  try {
    const { userId, age, occupation, income, healthConditions } = await c.req.json()
    
    // Mock scheme detection
    const schemes = [
      {
        name: 'Ayushman Bharat',
        description: 'Free health insurance up to ₹5 lakhs',
        eligibility: 'Low income families',
        eligible: income < 100000,
        howToApply: 'Visit nearest government hospital with Aadhaar'
      },
      {
        name: 'PM-KISAN',
        description: '₹6000 per year for farmers',
        eligibility: 'Small and marginal farmers',
        eligible: occupation === 'farmer',
        howToApply: 'Register at pmkisan.gov.in'
      }
    ]
    
    const eligibleSchemes = schemes.filter(s => s.eligible)
    
    return c.json({ success: true, schemes: eligibleSchemes })
  } catch (error) {
    console.log('Scheme detection error:', error)
    return c.json({ success: false, error: String(error) }, 500)
  }
})

// Crisis mode - get emergency data
app.get('/make-server-cdab8971/crisis/emergency', async (c) => {
  try {
    const userId = c.req.query('userId')
    
    if (!userId) {
      return c.json({ success: false, error: 'userId required' }, 400)
    }
    
    // Get health summary
    const healthSummaryResponse = await fetch(
      `${c.req.url.split('/crisis')[0]}/health/summary`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      }
    )
    const { summary: healthSummary } = await healthSummaryResponse.json()
    
    // Get identity documents
    const userDocsKey = `user_documents_${userId}`
    const docIds = await kv.get(userDocsKey) || []
    const documents = await kv.mget(docIds)
    const identityDocs = documents.filter(d => d?.classification === 'identity')
    
    const emergencyData = {
      healthSummary,
      identityDocs: identityDocs.map(d => ({
        type: d.extractedData?.documentType,
        name: d.extractedData?.name,
        number: d.extractedData?.number
      })),
      emergencyContacts: [
        { name: 'Family', phone: '+91 98765 43210', relation: 'Spouse' }
      ],
      qrData: `EMERGENCY:${userId}:${healthSummary.bloodGroup}:${healthSummary.allergies.join(',')}`
    }
    
    return c.json({ success: true, data: emergencyData })
  } catch (error) {
    console.log('Crisis mode error:', error)
    return c.json({ success: false, error: String(error) }, 500)
  }
})

Deno.serve(app.fetch)
