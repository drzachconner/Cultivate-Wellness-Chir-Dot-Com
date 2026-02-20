# Requirements: Milestone v1.1 — Admin Dashboard

## v1.1 Requirements

### Backend Multi-Project
- [x] **BACK-01**: Agent-backend supports multiple projects via project registry (projects.json)
- [x] **BACK-02**: Each project has its own REPO_PATH, SYSTEM_PROMPT, and config
- [x] **BACK-03**: CORS origins are configurable per project
- [x] **BACK-04**: Cultivate Wellness project is registered with correct repo path and system prompt

### Authentication
- [x] **AUTH-01**: User can access admin panel at /admin route
- [x] **AUTH-02**: User must enter password to access admin functionality
- [x] **AUTH-03**: Password is validated against agent-backend using Bearer token auth
- [x] **AUTH-04**: User can choose "Remember me" for persistent auth (localStorage vs sessionStorage)

### Admin UI Shell
- [ ] **UI-01**: Admin panel renders as draggable floating overlay on the site
- [ ] **UI-02**: Admin panel can be minimized, resized (compact/medium/large), and closed
- [ ] **UI-03**: Multiple admin panels can be open simultaneously
- [ ] **UI-04**: Admin panel works on mobile (fullscreen mode)
- [ ] **UI-05**: Public chatbot is hidden when admin panel is active

### Chat Interface
- [x] **CHAT-01**: User can send messages to Claude via streaming chat
- [ ] **CHAT-02**: User can see real-time tool status (reading files, editing, committing)
- [ ] **CHAT-03**: User can view and switch between conversation history
- [ ] **CHAT-04**: User can delete past conversations
- [ ] **CHAT-05**: User can use quick action buttons for common tasks

### Change Tracking
- [ ] **TRACK-01**: User can view recent file changes and git commits in change log panel
- [ ] **TRACK-02**: Deploy countdown shows after successful git push

### Configuration
- [x] **CONFIG-01**: Welcome message is customized for Dr. Zach / Cultivate Wellness
- [x] **CONFIG-02**: Quick actions are relevant to Cultivate Wellness site management
- [x] **CONFIG-03**: System prompt includes Cultivate Wellness tech stack, brand, and content conventions

## Future Requirements
- Form submission viewer (requires persistent storage of form submissions)
- Guide download analytics
- SEO performance dashboard
- Chatbot conversation viewer

## Out of Scope
- Multi-user auth (single password is sufficient)
- Role-based access control
- Direct content editing UI (Claude handles this via chat)
- Database migration (no database in current site)

## Traceability
| Requirement | Phase |
|-------------|-------|
| BACK-01..04 | Phase 1 |
| AUTH-01..04 | Phase 2 |
| UI-01..05 | Phase 2 |
| CHAT-01..05 | Phase 2 |
| TRACK-01..02 | Phase 2 |
| CONFIG-01..03 | Phase 1 |
