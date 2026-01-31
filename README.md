# Chat UI (AIR-FE-CHAR_UI)

Frontend web para el chat RAG. Provee la interfaz de usuario para enviar preguntas y visualizar respuestas en tiempo real.

## Qué hace
- Interfaz de chat con historial y estados de respuesta.
- Conecta con la API RAG y SignalR para streaming/tiempo real.
- Gestiona modelos y servicios de comunicación en el cliente.

## Estructura
- `src/app/core/services/`: servicios de chat y SignalR.
- `src/app/features/chat/`: componentes y UI del chat.
- `src/environments/`: configuración por entorno.

## Tecnologías
- Angular
- TypeScript
- SignalR client
