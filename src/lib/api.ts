const API_BASE = 'https://api.deepseek.com'
const DEFAULT_MODEL = 'deepseek-v4-pro'

export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

function getKey(): string {
  return localStorage.getItem('deepthink_api_key') || ''
}

async function makeRequest(
  messages: Message[],
  apiKey: string,
  stream: boolean,
  signal?: AbortSignal
) {
  return fetch(`${API_BASE}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages,
      temperature: 0.7,
      stream,
    }),
    signal,
  })
}

export async function callDeepSeekAPI(messages: Message[], apiKey?: string): Promise<string> {
  const key = apiKey || getKey()
  if (!key) throw new Error('请先设置 DeepSeek API Key')

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 60000)

  try {
    const res = await makeRequest(messages, key, false, controller.signal)
    clearTimeout(timeout)

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      if (res.status === 401) throw new Error('API Key 无效，请检查设置')
      if (res.status === 429) throw new Error('请求过于频繁，请稍后再试')
      throw new Error(err.error?.message || `请求失败 (${res.status})`)
    }

    const data = await res.json()
    return data.choices?.[0]?.message?.content || '（无返回内容）'
  } catch (e: unknown) {
    clearTimeout(timeout)
    if (e instanceof Error) {
      if (e.name === 'AbortError') throw new Error('请求超时，请检查网络连接')
      throw e
    }
    throw new Error('未知错误')
  }
}

export function streamDeepSeekAPI(
  messages: Message[],
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: string) => void,
  apiKey?: string
) {
  const key = apiKey || getKey()
  if (!key) { onError('请先设置 DeepSeek API Key'); return () => {} }

  const controller = new AbortController()

  makeRequest(messages, key, true, controller.signal)
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        if (res.status === 401) throw new Error('API Key 无效，请在设置中配置')
        if (res.status === 429) throw new Error('请求过于频繁，请稍后再试')
        throw new Error(err.error?.message || `请求失败 (${res.status})`)
      }
      const reader = res.body?.getReader()
      if (!reader) throw new Error('无法读取响应流')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''
        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || !trimmed.startsWith('data: ')) continue
          const jsonStr = trimmed.slice(6)
          if (jsonStr === '[DONE]') { onDone(); return }
          try {
            const chunk = JSON.parse(jsonStr)
            const delta = chunk.choices?.[0]?.delta?.content ?? chunk.choices?.[0]?.message?.content
            if (delta) onChunk(delta)
          } catch { /* ignore */ }
        }
      }
      onDone()
    })
    .catch((e) => { onError(e instanceof Error ? e.message : '未知错误') })

  return () => controller.abort()
}

export const callKimiAPI = callDeepSeekAPI
export const streamKimiAPI = streamDeepSeekAPI

export function getApiKey(): string | null {
  return localStorage.getItem('deepthink_api_key')
}

export function setApiKey(key: string) {
  localStorage.setItem('deepthink_api_key', key)
}

export function removeApiKey() {
  localStorage.removeItem('deepthink_api_key')
}
