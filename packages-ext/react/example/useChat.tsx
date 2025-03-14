import { useChat } from '../src'
import { useEffect, useRef } from 'react'

// Inline styles for the component
const styles = {
  assistantMessage: {
    alignSelf: 'flex-start' as const,
    backgroundColor: '#f0f0f0',
    marginRight: 'auto',
  },
  chatHeader: {
    backgroundColor: '#f0f2f5',
    borderBottom: '1px solid #ddd',
    padding: '10px 15px',
    textAlign: 'center' as const,
  },
  container: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column' as const,
    fontFamily: 'Arial, sans-serif',
    height: '90vh',
    overflow: 'hidden',
    width: '600px',
  },
  input: {
    border: '1px solid #ddd',
    borderRadius: '20px',
    flex: 1,
    fontSize: '14px',
    outline: 'none',
    padding: '12px',
  },
  inputContainer: {
    backgroundColor: '#f0f2f5',
    borderTop: '1px solid #ddd',
    display: 'flex',
    padding: '10px',
  },
  loadingIndicator: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    color: '#666',
    fontSize: '12px',
    padding: '5px 10px',
  },
  messageBox: {
    borderRadius: '18px',
    maxWidth: '80%',
    padding: '10px 15px',
    position: 'relative' as const,
    wordBreak: 'break-word' as const,
  },
  messageContent: {
    fontSize: '14px',
  },
  messagesContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column' as const,
    gap: '10px',
    overflowY: 'auto' as const,
    padding: '15px',
  },
  messageTime: {
    color: '#999',
    fontSize: '10px',
    marginTop: '2px',
    textAlign: 'right' as const,
  },
  sendButton: {
    backgroundColor: '#0084ff',
    border: 'none',
    borderRadius: '20px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    marginLeft: '10px',
    padding: '0 15px',
  },
  userMessage: {
    alignSelf: 'flex-end' as const,
    backgroundColor: '#dcf8c6',
    marginLeft: 'auto',
  },
  errorMessage: {
    color: '#ff3b30',
    fontSize: '12px',
    marginTop: '5px',
    padding: '0 5px',
  },
  errorUserMessage: {
    alignSelf: 'flex-end' as const,
    backgroundColor: '#ffdddd',
    borderColor: '#ff3b30',
    borderWidth: '1px',
    borderStyle: 'solid',
    marginLeft: 'auto',
  },
  resetButton: {
    backgroundColor: '#f0f2f5',
    border: '1px solid #ddd',
    borderRadius: '20px',
    color: '#666',
    cursor: 'pointer',
    fontSize: '12px',
    marginLeft: '10px',
    padding: '5px 10px',
  },
}

// Simple Chat Component implementation
export function ChatComponent() {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    handleSubmit,
    handleInputChange,
    input,
    messages,
    status,
    error,
    reset,
  } = useChat({
    id: 'simple-chat',
    preventDefault: true,
    initialMessages: [
      {
        role: 'system',
        content: 'anything you want',
      },
    ],
    baseURL: 'http://localhost:11434/v1/',
    maxSteps: 100,
    model: 'llama3.2',
  })

  // Focus input when status changes to idle
  useEffect(() => {
    if (status === 'idle' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [status]);

  return (
    <div style={styles.container}>
      <div style={styles.chatHeader}>
        <h2>useChat</h2>
      </div>

      <div style={styles.messagesContainer}>
        {messages.map(message => (
          <div
            key={message.id}
            style={{
              ...styles.messageBox,
              ...(message.role === 'user'
                ? (status === 'error' ? styles.errorUserMessage : styles.userMessage)
                : styles.assistantMessage),
            }}
          >
            {
              message.parts.map((part, index) => (
                <div key={index} style={styles.messageContent}>
                  {part.type === 'text' ? part.text : 'Unsupported message type'}
                </div>
              ))
            }
            {status === 'error' && (
              <div style={styles.errorMessage}>
                x
              </div>
            )}
          </div>
        ))}
        {status === 'loading' && (
          <div style={styles.loadingIndicator}>
            &#x6B63;&#x5728;&#x8F93;&#x5165;...
          </div>
        )}
        {error && (
          <div style={styles.errorMessage}>
            error: {error.message || '发生未知错误'}
          </div>
        )}
      </div>

      <form data-test-id="form" onSubmit={handleSubmit} style={styles.inputContainer}>
        <input
          data-test-id="input"
          onChange={handleInputChange}
          placeholder="say something..."
          style={styles.input}
          value={input}
          disabled={status !== 'idle'}
          ref={inputRef}
        />
        <button
          data-test-id="submit"
          disabled={status !== 'idle' || !input.trim()}
          style={styles.sendButton}
          type="submit"
        >
          Send
        </button>
        <button
          data-test-id="reset"
          onClick={(e) => {
            e.preventDefault();
            reset();
          }}
          style={styles.resetButton}
          type="button"
        >
          Reset
        </button>
      </form>
    </div>
  )
}

// Usage example
export default function ChatExample() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <ChatComponent />
    </div>
  )
}
