export interface ChatApiConfig {
  endpoint: string
  modelName: string
}

export class ChatService {
  private config: ChatApiConfig

  constructor(config: ChatApiConfig) {
    this.config = config
  }

  async sendMessage(message: string): Promise<string> {
    try {
      const response = await fetch(this.config.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.config.modelName,
          prompt: message,
          stream: false,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.response || "No response received"
    } catch (error) {
      console.error("Chat API error:", error)
      throw error
    }
  }

  updateConfig(config: Partial<ChatApiConfig>): void {
    this.config = { ...this.config, ...config }
  }
}
