export async function parseSSEStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  handlers: {
    onTextDelta: (text: string) => void;
    onToolStart: (tool: string, id: string, input: Record<string, unknown>) => void;
    onToolResult: (tool: string, id: string, output: string, isError: boolean) => void;
    onDone: (data: { conversationId?: string }) => void;
    onError: (message: string) => void;
  },
): Promise<void> {
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    let currentEvent = '';
    for (const line of lines) {
      if (line.startsWith('event: ')) {
        currentEvent = line.substring(7).trim();
      } else if (line.startsWith('data: ') && currentEvent) {
        try {
          const data = JSON.parse(line.substring(6));
          switch (currentEvent) {
            case 'text_delta':
              handlers.onTextDelta(data.text);
              break;
            case 'tool_start':
              handlers.onToolStart(data.tool, data.tool_use_id, data.input);
              break;
            case 'tool_result':
              handlers.onToolResult(data.tool, data.tool_use_id, data.output, data.is_error);
              break;
            case 'done':
              handlers.onDone({ conversationId: data.conversationId });
              break;
            case 'error':
              handlers.onError(data.message);
              break;
          }
        } catch {
          // skip malformed JSON
        }
        currentEvent = '';
      }
    }
  }
}
