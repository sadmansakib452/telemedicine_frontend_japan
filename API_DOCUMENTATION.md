# QuickMed Connect - Story-Based API Documentation

## 📖 Overview

Welcome to the **QuickMed Connect** API documentation! This is a comprehensive, story-driven guide that explains how to use the QuickMed Connect telemedicine platform API. We'll follow the journey of our characters as they interact with the platform, making it easy to understand when, why, and how to use each API endpoint.

---

## 🎭 Meet Our Characters

- **👩‍⚕️ Sarah (Patient)** - A patient who needs medical help and creates broadcasts to connect with doctors
- **👨‍⚕️ Sam (Doctor 1)** - A verified doctor who responds to patient broadcasts and creates prescriptions
- **👨‍⚕️ Parker (Doctor 2)** - Another verified doctor who also sees broadcasts but might be too late to respond
- **🏪 Daniel (Shop Owner 1)** - A verified medicine shop owner who receives prescriptions from doctors
- **🏪 Dollar (Shop Owner 2)** - Another verified shop owner who also receives prescriptions
- **👨‍💼 Admin** - The platform administrator who manages user verifications and monitors system activities

---

## 🏗️ Platform Architecture

### Chat-First Approach
**QuickMed Connect** is a **chat-first application** - there are **NO dashboards** for patients, doctors, or shop owners. The primary interface is the **conversation list**, where users see their conversations and interact with others.

### Key Features
- **Landing Page**: Patients can send messages directly from the landing page (creates broadcasts)
- **Inbox Button**: All users have an "Inbox" button in the navbar that leads to their conversation list
- **Conversation List**: The primary interface where users see all their conversations
- **Real-time Chat**: WebSocket-based real-time messaging
- **Broadcast System**: Patients create broadcasts that are sent to all verified doctors
- **Prescription Distribution**: Prescriptions are automatically distributed to all verified shop owners

---

## 📊 State Definitions

- **State 0**: Initial state (not registered)
- **State 1**: Registered but not authenticated
- **State 2**: Authenticated
- **State 3**: Broadcast created (waiting for doctor)
- **State 4**: Inbox loaded (empty, waiting for doctor)
- **State 5**: Doctors see broadcast
- **State 6**: Conversation created (doctor responded)
- **State 7**: Conversation loaded
- **State 8**: Messages exchanged
- **State 9**: Prescription created
- **State 10**: Shop owners receive prescription
- **State 11**: Admin monitors system

---

## 📚 Table of Contents

- [QuickMed Connect - Story-Based API Documentation](#quickmed-connect---story-based-api-documentation)
  - [📖 Overview](#-overview)
  - [🎭 Meet Our Characters](#-meet-our-characters)
  - [🏗️ Platform Architecture](#️-platform-architecture)
    - [Chat-First Approach](#chat-first-approach)
    - [Key Features](#key-features)
  - [📊 State Definitions](#-state-definitions)
  - [📚 Table of Contents](#-table-of-contents)
  - [🔐 Authentication](#-authentication)
  - [🌐 Base URL](#-base-url)
- [Chapter 1: The Beginning - Platform Discovery and Registration](#chapter-1-the-beginning---platform-discovery-and-registration)
  - [📖 Story Context](#-story-context)
  - [🎯 State Transition](#-state-transition)
  - [👤 User Journey: Sarah Registers as a Patient](#-user-journey-sarah-registers-as-a-patient)
    - [🎬 Scene 1: Sarah Visits the Landing Page](#-scene-1-sarah-visits-the-landing-page)
    - [🎬 Scene 2: Sarah Clicks "Register" Button](#-scene-2-sarah-clicks-register-button)
    - [🎬 Scene 3: Sarah Fills the Registration Form](#-scene-3-sarah-fills-the-registration-form)
    - [🎬 Scene 4: Sarah Submits the Registration Form](#-scene-4-sarah-submits-the-registration-form)
    - [🎬 Scene 5: Backend Processes Registration](#-scene-5-backend-processes-registration)
    - [🎬 Scene 6: Backend Returns Success Response](#-scene-6-backend-returns-success-response)
    - [🎬 Scene 7: Frontend Handles Success Response](#-scene-7-frontend-handles-success-response)
    - [🎬 Scene 8: Next Steps](#-scene-8-next-steps)
  - [🔄 Alternative Flows](#-alternative-flows)
    - [🎬 Scene 9: Sam (Doctor) Registers](#-scene-9-sam-doctor-registers)
    - [🎬 Scene 10: Daniel (Shop Owner) Registers](#-scene-10-daniel-shop-owner-registers)
  - [⚠️ Error Handling](#️-error-handling)
    - [🚫 Error 1: Email Already Registered](#-error-1-email-already-registered)
    - [🚫 Error 2: Invalid User Type](#-error-2-invalid-user-type)
    - [🚫 Error 3: Validation Error](#-error-3-validation-error)
  - [📝 API Documentation](#-api-documentation)
    - [`POST /auth/register`](#post-authregister)
  - [🎨 Frontend Implementation Guide](#-frontend-implementation-guide)
    - [Registration Form Component](#registration-form-component)
  - [✅ Summary](#-summary)
    - [What We Learned](#what-we-learned)
    - [Key Takeaways](#key-takeaways)
    - [Next Steps](#next-steps)
  - [🎯 Next Chapter](#-next-chapter)
  - [Chapter 2: First Steps - Authentication and Login](#chapter-2-first-steps---authentication-and-login)
  - [📖 Story Context](#-story-context-1)
  - [🎯 State Transition](#-state-transition-1)
  - [👤 User Journey: Sarah Logs In](#-user-journey-sarah-logs-in)
    - [🎬 Scene 1: Sarah Navigates to Login](#-scene-1-sarah-navigates-to-login)
    - [🎬 Scene 2: Sarah Enters Credentials](#-scene-2-sarah-enters-credentials)
    - [🎬 Scene 3: Sarah Submits Login Form](#-scene-3-sarah-submits-login-form)
    - [🎬 Scene 4: Backend Authenticates Sarah](#-scene-4-backend-authenticates-sarah)
    - [🎬 Scene 5: Frontend Stores Session](#-scene-5-frontend-stores-session)
    - [🎬 Scene 6: Redirect Based on Role](#-scene-6-redirect-based-on-role)
    - [🎬 Scene 7: WebSocket Ready](#-scene-7-websocket-ready)
  - [🔄 Alternative Journeys](#-alternative-journeys)
    - [🎬 Scene 8: Sam Attempts to Log In (Before Approval)](#-scene-8-sam-attempts-to-log-in-before-approval)
    - [🎬 Scene 9: Daniel Attempts to Log In (Before Approval)](#-scene-9-daniel-attempts-to-log-in-before-approval)
    - [🎬 Scene 10: Invalid Credentials](#-scene-10-invalid-credentials)
  - [🛡️ Security \& Session Considerations](#️-security--session-considerations)
  - [📝 API Documentation](#-api-documentation-1)
    - [`POST /auth/login`](#post-authlogin)
  - [🎨 Frontend Implementation Guide](#-frontend-implementation-guide-1)
    - [Login Form Component (React/TypeScript Example)](#login-form-component-reacttypescript-example)
    - [WebSocket Initialization](#websocket-initialization)
  - [✅ Summary](#-summary-1)
    - [What We Learned](#what-we-learned-1)
    - [Key Takeaways](#key-takeaways-1)
    - [Next Steps](#next-steps-1)
  - [🎯 Next Chapter](#-next-chapter-1)
- [Chapter 3: Landing Page - Patient Sends Message](#chapter-3-landing-page---patient-sends-message)
  - [📖 Story Context](#-story-context-2)
  - [🎯 State Transition](#-state-transition-2)
  - [👤 User Journey: Sarah Sends Her First Broadcast](#-user-journey-sarah-sends-her-first-broadcast)
    - [🎬 Scene 1: Sarah Lands on the Landing Page](#-scene-1-sarah-lands-on-the-landing-page)
    - [🎬 Scene 2: Sarah Types Her Medical Issue](#-scene-2-sarah-types-her-medical-issue)
    - [🎬 Scene 3: Sarah Clicks "Send" Button](#-scene-3-sarah-clicks-send-button)
    - [🎬 Scene 4: Backend Processes Broadcast Creation](#-scene-4-backend-processes-broadcast-creation)
    - [🎬 Scene 5: Backend Returns Success Response](#-scene-5-backend-returns-success-response)
    - [🎬 Scene 6: Frontend Handles Success Response](#-scene-6-frontend-handles-success-response)
    - [🎬 Scene 7: Real-Time Notification to Doctors](#-scene-7-real-time-notification-to-doctors)
    - [🎬 Scene 8: Next Steps](#-scene-8-next-steps-1)
  - [🔄 Alternative Flows](#-alternative-flows-1)
    - [🎬 Scene 9: Sarah Sends Another Broadcast](#-scene-9-sarah-sends-another-broadcast)
    - [🎬 Scene 10: Sarah Checks Her Inbox (Empty State)](#-scene-10-sarah-checks-her-inbox-empty-state)
  - [⚠️ Error Handling](#️-error-handling-1)
    - [🚫 Error 1: User Not a Patient](#-error-1-user-not-a-patient)
    - [🚫 Error 2: Message Validation Error](#-error-2-message-validation-error)
    - [🚫 Error 3: Unauthorized Access](#-error-3-unauthorized-access)
    - [🚫 Error 4: No Doctors Available](#-error-4-no-doctors-available)
  - [📝 API Documentation](#-api-documentation-2)
    - [`POST /chat/broadcast`](#post-chatbroadcast)
  - [🎨 Frontend Implementation Guide](#-frontend-implementation-guide-2)
    - [Landing Page Component (React/TypeScript Example)](#landing-page-component-reacttypescript-example)
    - [WebSocket Event Handling (Doctor Side)](#websocket-event-handling-doctor-side)
  - [✅ Summary](#-summary-2)
    - [What We Learned](#what-we-learned-2)
    - [Key Takeaways](#key-takeaways-2)
    - [Next Steps](#next-steps-2)
  - [🎯 Next Chapter](#-next-chapter-2)
- [Chapter 4: Patient Inbox - Conversation List (Initial State)](#chapter-4-patient-inbox---conversation-list-initial-state)
  - [📖 Story Context](#-story-context-3)
  - [🎯 State Transition](#-state-transition-3)
  - [👤 User Journey: Sarah Checks Her Inbox](#-user-journey-sarah-checks-her-inbox)
    - [🎬 Scene 1: Sarah Clicks "Inbox" Button](#-scene-1-sarah-clicks-inbox-button)
    - [🎬 Scene 2: Frontend Calls API to Load Conversations](#-scene-2-frontend-calls-api-to-load-conversations)
    - [🎬 Scene 3: Backend Processes Request](#-scene-3-backend-processes-request)
    - [🎬 Scene 4: Backend Returns Empty Response](#-scene-4-backend-returns-empty-response)
    - [🎬 Scene 5: Frontend Displays Empty State](#-scene-5-frontend-displays-empty-state)
    - [🎬 Scene 6: WebSocket Connection Setup](#-scene-6-websocket-connection-setup)
    - [🎬 Scene 7: Real-Time Notification Setup](#-scene-7-real-time-notification-setup)
    - [🎬 Scene 8: Next Steps](#-scene-8-next-steps-2)
  - [🔄 Alternative Flows](#-alternative-flows-2)
    - [🎬 Scene 9: Sarah Refreshes the Page](#-scene-9-sarah-refreshes-the-page)
    - [🎬 Scene 10: Sarah Navigates Away and Comes Back](#-scene-10-sarah-navigates-away-and-comes-back)
    - [🎬 Scene 11: Real-Time Update When Doctor Responds](#-scene-11-real-time-update-when-doctor-responds)
  - [⚠️ Error Handling](#️-error-handling-2)
    - [🚫 Error 1: User Not Authenticated](#-error-1-user-not-authenticated)
    - [🚫 Error 2: User ID Not Found](#-error-2-user-id-not-found)
    - [🚫 Error 3: Server Error](#-error-3-server-error)
  - [📝 API Documentation](#-api-documentation-3)
    - [`GET /chat/conversation`](#get-chatconversation)
  - [🎨 Frontend Implementation Guide](#-frontend-implementation-guide-3)
    - [Conversation List Page Component (React/TypeScript Example)](#conversation-list-page-component-reacttypescript-example)
    - [WebSocket Event Handling](#websocket-event-handling)
  - [✅ Summary](#-summary-3)
    - [What We Learned](#what-we-learned-3)
    - [Key Takeaways](#key-takeaways-3)
    - [Next Steps](#next-steps-3)
  - [🎯 Next Chapter](#-next-chapter-3)
- [Chapter 5: Doctor Broadcast Inbox - Viewing Broadcasts](#chapter-5-doctor-broadcast-inbox---viewing-broadcasts)
  - [📖 Story Context](#-story-context-4)
  - [🎯 State Transition](#-state-transition-4)
  - [👤 User Journey: Sam Views Broadcast Inbox](#-user-journey-sam-views-broadcast-inbox)
    - [🎬 Scene 1: Sam Logs In](#-scene-1-sam-logs-in)
    - [🎬 Scene 2: Sam Navigates to Broadcast Inbox](#-scene-2-sam-navigates-to-broadcast-inbox)
    - [🎬 Scene 3: Frontend Calls API to Load Open Broadcasts](#-scene-3-frontend-calls-api-to-load-open-broadcasts)
    - [🎬 Scene 4: Backend Processes Request](#-scene-4-backend-processes-request)
    - [🎬 Scene 5: Backend Returns Open Broadcasts](#-scene-5-backend-returns-open-broadcasts)
    - [🎬 Scene 6: Frontend Displays Broadcast Inbox](#-scene-6-frontend-displays-broadcast-inbox)
    - [🎬 Scene 7: Sam Views Broadcast Details](#-scene-7-sam-views-broadcast-details)
    - [🎬 Scene 8: WebSocket Connection Setup](#-scene-8-websocket-connection-setup)
    - [🎬 Scene 9: Real-Time Notification Setup](#-scene-9-real-time-notification-setup)
    - [🎬 Scene 10: Next Steps](#-scene-10-next-steps)
  - [🔄 Alternative Flows](#-alternative-flows-3)
    - [🎬 Scene 11: Parker Also Sees Sarah's Broadcast](#-scene-11-parker-also-sees-sarahs-broadcast)
    - [🎬 Scene 12: Real-Time Update When Another Doctor Responds](#-scene-12-real-time-update-when-another-doctor-responds)
    - [🎬 Scene 13: No Open Broadcasts](#-scene-13-no-open-broadcasts)
  - [⚠️ Error Handling](#️-error-handling-3)
    - [🚫 Error 1: User Not a Doctor](#-error-1-user-not-a-doctor)
    - [🚫 Error 2: Doctor Not Approved](#-error-2-doctor-not-approved)
    - [🚫 Error 3: Unauthorized Access](#-error-3-unauthorized-access-1)
    - [🚫 Error 4: Server Error](#-error-4-server-error)
  - [📝 API Documentation](#-api-documentation-4)
    - [`GET /chat/broadcast/inbox`](#get-chatbroadcastinbox)
    - [`GET /chat/broadcast/:id`](#get-chatbroadcastid)
  - [🎨 Frontend Implementation Guide](#-frontend-implementation-guide-4)
    - [Broadcast Inbox Page Component (React/TypeScript Example)](#broadcast-inbox-page-component-reacttypescript-example)
    - [WebSocket Event Handling](#websocket-event-handling-1)
  - [✅ Summary](#-summary-4)
    - [What We Learned](#what-we-learned-4)
    - [Key Takeaways](#key-takeaways-4)
    - [Next Steps](#next-steps-4)
  - [🎯 Next Chapter](#-next-chapter-4)
- [Chapter 6: Doctor Responds - Broadcast to Conversation](#chapter-6-doctor-responds---broadcast-to-conversation)
  - [📖 Story Context](#-story-context-5)
  - [🎯 State Transition](#-state-transition-5)
  - [👤 User Journey: Sam Responds to Sarah's Broadcast](#-user-journey-sam-responds-to-sarahs-broadcast)
    - [🎬 Scene 1: Sam Clicks "Respond" Button](#-scene-1-sam-clicks-respond-button)
    - [🎬 Scene 2: Frontend Calls API to Respond to Broadcast](#-scene-2-frontend-calls-api-to-respond-to-broadcast)
    - [🎬 Scene 3: Backend Processes Request - Validation](#-scene-3-backend-processes-request---validation)
    - [🎬 Scene 4: Backend Creates Conversation](#-scene-4-backend-creates-conversation)
    - [🎬 Scene 5: Backend Updates Broadcast Status](#-scene-5-backend-updates-broadcast-status)
    - [🎬 Scene 6: Backend Emits WebSocket Events](#-scene-6-backend-emits-websocket-events)
    - [🎬 Scene 7: Backend Returns Success Response](#-scene-7-backend-returns-success-response)
    - [🎬 Scene 8: Frontend Handles Success Response](#-scene-8-frontend-handles-success-response)
    - [🎬 Scene 9: Real-Time Notification to Sarah](#-scene-9-real-time-notification-to-sarah)
    - [🎬 Scene 10: Real-Time Notification to Other Doctors](#-scene-10-real-time-notification-to-other-doctors)
    - [🎬 Scene 11: Next Steps](#-scene-11-next-steps)
  - [🔄 Alternative Flows](#-alternative-flows-4)
    - [🎬 Scene 12: Parker Tries to Respond (Too Late)](#-scene-12-parker-tries-to-respond-too-late)
    - [🎬 Scene 13: Race Condition Protection](#-scene-13-race-condition-protection)
    - [🎬 Scene 14: Conversation Already Exists](#-scene-14-conversation-already-exists)
  - [⚠️ Error Handling](#️-error-handling-4)
    - [🚫 Error 1: Broadcast Not Found](#-error-1-broadcast-not-found)
    - [🚫 Error 2: Broadcast Already Assisted](#-error-2-broadcast-already-assisted)
    - [🚫 Error 3: Doctor Not Approved](#-error-3-doctor-not-approved)
    - [🚫 Error 4: User Not a Doctor](#-error-4-user-not-a-doctor)
    - [🚫 Error 5: Unauthorized Access](#-error-5-unauthorized-access)
  - [📝 API Documentation](#-api-documentation-5)
    - [`POST /chat/conversation/broadcast/:broadcastId/respond`](#post-chatconversationbroadcastbroadcastidrespond)
  - [🎨 Frontend Implementation Guide](#-frontend-implementation-guide-5)
    - [Respond to Broadcast Component (React/TypeScript Example)](#respond-to-broadcast-component-reacttypescript-example)
    - [WebSocket Event Handling](#websocket-event-handling-2)
  - [✅ Summary](#-summary-5)
    - [What We Learned](#what-we-learned-5)
    - [Key Takeaways](#key-takeaways-5)
    - [Next Steps](#next-steps-5)
  - [🎯 Next Chapter](#-next-chapter-5)
- [Chapter 7: Conversation List - Conversation List UI and Conversation Detail Page](#chapter-7-conversation-list---conversation-list-ui-and-conversation-detail-page)
  - [📖 Story Context](#-story-context-6)
  - [🎯 State Transition](#-state-transition-6)
  - [👤 User Journey: Sarah Views Conversation List and Opens Conversation](#-user-journey-sarah-views-conversation-list-and-opens-conversation)
    - [🎬 Scene 1: Sarah Receives Real-Time Notification](#-scene-1-sarah-receives-real-time-notification)
    - [🎬 Scene 2: Sarah Clicks "Inbox" Button](#-scene-2-sarah-clicks-inbox-button)
    - [🎬 Scene 3: Frontend Calls API to Load Conversations](#-scene-3-frontend-calls-api-to-load-conversations)
    - [🎬 Scene 4: Backend Returns Conversations](#-scene-4-backend-returns-conversations)
    - [🎬 Scene 5: Frontend Displays Conversation List](#-scene-5-frontend-displays-conversation-list)
    - [🎬 Scene 6: Sarah Clicks on Conversation](#-scene-6-sarah-clicks-on-conversation)
    - [🎬 Scene 7: Frontend Calls API to Load Conversation Details](#-scene-7-frontend-calls-api-to-load-conversation-details)
    - [🎬 Scene 8: Backend Returns Conversation Details](#-scene-8-backend-returns-conversation-details)
    - [🎬 Scene 9: Frontend Displays Conversation Detail Page](#-scene-9-frontend-displays-conversation-detail-page)
    - [🎬 Scene 10: Optional - Frontend Loads All Messages](#-scene-10-optional---frontend-loads-all-messages)
    - [🎬 Scene 11: WebSocket Connection Setup](#-scene-11-websocket-connection-setup)
    - [🎬 Scene 12: Real-Time Notification Setup](#-scene-12-real-time-notification-setup)
    - [🎬 Scene 13: Next Steps](#-scene-13-next-steps)
  - [🔄 Alternative Flows](#-alternative-flows-5)
    - [🎬 Scene 14: Sam Also Views Conversation Detail Page](#-scene-14-sam-also-views-conversation-detail-page)
    - [🎬 Scene 15: Conversation List Updates in Real-Time](#-scene-15-conversation-list-updates-in-real-time)
    - [🎬 Scene 16: Conversation Not Found](#-scene-16-conversation-not-found)
    - [🎬 Scene 17: Unauthorized Access](#-scene-17-unauthorized-access)
  - [⚠️ Error Handling](#️-error-handling-5)
    - [🚫 Error 1: Conversation Not Found](#-error-1-conversation-not-found)
    - [🚫 Error 2: Unauthorized Access](#-error-2-unauthorized-access)
    - [🚫 Error 3: User Not Authenticated](#-error-3-user-not-authenticated)
    - [🚫 Error 4: Server Error](#-error-4-server-error-1)
  - [📝 API Documentation](#-api-documentation-6)
    - [`GET /chat/conversation`](#get-chatconversation-1)
    - [`GET /chat/conversation/:id`](#get-chatconversationid)
    - [`GET /chat/message?conversation_id=:id&limit=20&cursor=:cursor`](#get-chatmessageconversation_ididlimit20cursorcursor)
  - [🎨 Frontend Implementation Guide](#-frontend-implementation-guide-6)
    - [Conversation List Page Component (React/TypeScript Example)](#conversation-list-page-component-reacttypescript-example-1)
    - [Conversation Detail Page Component (React/TypeScript Example)](#conversation-detail-page-component-reacttypescript-example)
  - [✅ Summary](#-summary-6)
    - [What We Learned](#what-we-learned-6)
    - [Key Takeaways](#key-takeaways-6)
    - [Next Steps](#next-steps-6)
  - [🎯 Next Chapter](#-next-chapter-6)
- [Chapter 8: Sending Messages - Real-Time Messaging and Conversation List Updates](#chapter-8-sending-messages---real-time-messaging-and-conversation-list-updates)
  - [📖 Story Context](#-story-context-7)
  - [🎯 State Transition](#-state-transition-7)
  - [👤 User Journey: Sam Sends Message to Sarah](#-user-journey-sam-sends-message-to-sarah)
    - [🎬 Scene 1: Sam Types and Sends Message](#-scene-1-sam-types-and-sends-message)
    - [🎬 Scene 2: Backend Processes Message](#-scene-2-backend-processes-message)
    - [🎬 Scene 3: Frontend Updates Message List (Sam's Side)](#-scene-3-frontend-updates-message-list-sams-side)
    - [🎬 Scene 4: Sarah Receives Message in Real-Time](#-scene-4-sarah-receives-message-in-real-time)
    - [🎬 Scene 5: Conversation List Updates in Real-Time](#-scene-5-conversation-list-updates-in-real-time)
  - [🔄 Alternative Flows](#-alternative-flows-6)
    - [🎬 Scene 6: Sarah Responds to Sam](#-scene-6-sarah-responds-to-sam)
    - [🎬 Scene 7: User Not Part of Conversation](#-scene-7-user-not-part-of-conversation)
  - [⚠️ Error Handling](#️-error-handling-6)
  - [📝 API Documentation](#-api-documentation-7)
    - [`POST /chat/message`](#post-chatmessage)
  - [🎨 Frontend Implementation Guide](#-frontend-implementation-guide-7)
    - [Send Message Component (React/TypeScript Example)](#send-message-component-reacttypescript-example)
  - [✅ Summary](#-summary-7)
    - [What We Learned](#what-we-learned-7)
    - [Key Takeaways](#key-takeaways-7)
    - [Next Steps](#next-steps-7)
  - [🎯 Next Chapter](#-next-chapter-7)
- [Chapter 9: Creating Prescriptions - Prescription Creation and Automatic Distribution](#chapter-9-creating-prescriptions---prescription-creation-and-automatic-distribution)
  - [📖 Story Context](#-story-context-8)
  - [🎯 State Transition](#-state-transition-8)
  - [👤 User Journey: Sam Creates Prescription for Sarah](#-user-journey-sam-creates-prescription-for-sarah)
    - [🎬 Scene 1: Sam Creates Prescription](#-scene-1-sam-creates-prescription)
    - [🎬 Scene 2: Backend Processes Prescription](#-scene-2-backend-processes-prescription)
    - [🎬 Scene 3: Prescription Distribution to Shop Owners](#-scene-3-prescription-distribution-to-shop-owners)
    - [🎬 Scene 4: Sarah Receives Prescription](#-scene-4-sarah-receives-prescription)
    - [🎬 Scene 5: Shop Owners Receive Prescription](#-scene-5-shop-owners-receive-prescription)
  - [🔄 Alternative Flows](#-alternative-flows-7)
    - [🎬 Scene 6: Shop Owner Conversation Reuse](#-scene-6-shop-owner-conversation-reuse)
    - [🎬 Scene 7: No Shop Owners Available](#-scene-7-no-shop-owners-available)
  - [⚠️ Error Handling](#️-error-handling-7)
  - [📝 API Documentation](#-api-documentation-8)
    - [`POST /chat/message` (Prescription)](#post-chatmessage-prescription)
  - [🎨 Frontend Implementation Guide](#-frontend-implementation-guide-8)
    - [Create Prescription Component (React/TypeScript Example)](#create-prescription-component-reacttypescript-example)
    - [WebSocket Event Handling (Shop Owner Side)](#websocket-event-handling-shop-owner-side)
  - [✅ Summary](#-summary-8)
    - [What We Learned](#what-we-learned-8)
    - [Key Takeaways](#key-takeaways-8)
    - [Next Steps](#next-steps-8)
  - [🎯 Next Chapter](#-next-chapter-8)
- [Chapter 10: Shop Owner Conversation List and Prescriptions](#chapter-10-shop-owner-conversation-list-and-prescriptions)
  - [📖 Story Context](#-story-context-9)
  - [🎯 State Transition](#-state-transition-9)
  - [👤 User Journey: Daniel Views Conversation List and Prescriptions](#-user-journey-daniel-views-conversation-list-and-prescriptions)
    - [🎬 Scene 1: Daniel Receives Real-Time Notification](#-scene-1-daniel-receives-real-time-notification)
    - [🎬 Scene 2: Daniel Clicks "Inbox" Button](#-scene-2-daniel-clicks-inbox-button)
    - [🎬 Scene 3: Daniel Views Conversation Detail Page](#-scene-3-daniel-views-conversation-detail-page)
    - [🎬 Scene 4: Daniel Views All Prescriptions](#-scene-4-daniel-views-all-prescriptions)
    - [🎬 Scene 5: Daniel Views Prescription Details](#-scene-5-daniel-views-prescription-details)
  - [🔄 Alternative Flows](#-alternative-flows-8)
    - [🎬 Scene 6: Dollar Also Receives Prescription](#-scene-6-dollar-also-receives-prescription)
    - [🎬 Scene 7: Multiple Prescriptions from Same Doctor](#-scene-7-multiple-prescriptions-from-same-doctor)
  - [⚠️ Error Handling](#️-error-handling-8)
  - [📝 API Documentation](#-api-documentation-9)
    - [`GET /chat/shop-owner/prescriptions`](#get-chatshop-ownerprescriptions)
    - [`GET /chat/shop-owner/prescriptions/:id`](#get-chatshop-ownerprescriptionsid)
    - [`GET /chat/shop-owner/conversations`](#get-chatshop-ownerconversations)
  - [🎨 Frontend Implementation Guide](#-frontend-implementation-guide-9)
    - [Shop Owner Conversation List (React/TypeScript Example)](#shop-owner-conversation-list-reacttypescript-example)
  - [✅ Summary](#-summary-9)
    - [What We Learned](#what-we-learned-9)
    - [Key Takeaways](#key-takeaways-9)
    - [Next Steps](#next-steps-9)
  - [🎯 Next Chapter](#-next-chapter-9)
- [Chapter 11: Admin Dashboard - System Monitoring and User Verification](#chapter-11-admin-dashboard---system-monitoring-and-user-verification)
  - [📖 Story Context](#-story-context-10)
  - [🎯 State Transition](#-state-transition-10)
  - [👤 User Journey: Admin Monitors System](#-user-journey-admin-monitors-system)
    - [🎬 Scene 1: Admin Views System Statistics](#-scene-1-admin-views-system-statistics)
    - [🎬 Scene 2: Admin Views Pending Verifications](#-scene-2-admin-views-pending-verifications)
    - [🎬 Scene 3: Admin Approves Doctor](#-scene-3-admin-approves-doctor)
    - [🎬 Scene 4: Admin Rejects Shop Owner](#-scene-4-admin-rejects-shop-owner)
    - [🎬 Scene 5: Admin Views All Conversations](#-scene-5-admin-views-all-conversations)
    - [🎬 Scene 6: Admin Views All Prescriptions](#-scene-6-admin-views-all-prescriptions)
    - [🎬 Scene 7: Admin Views All Broadcasts](#-scene-7-admin-views-all-broadcasts)
  - [🔄 Alternative Flows](#-alternative-flows-9)
    - [🎬 Scene 8: Admin Views All Users](#-scene-8-admin-views-all-users)
  - [⚠️ Error Handling](#️-error-handling-9)
  - [📝 API Documentation](#-api-documentation-10)
    - [`GET /admin/user/statistics`](#get-adminuserstatistics)
    - [`GET /admin/user/verifications/pending`](#get-adminuserverificationspending)
    - [`POST /admin/user/:id/approve`](#post-adminuseridapprove)
    - [`POST /admin/user/:id/reject`](#post-adminuseridreject)
    - [`GET /admin/user/conversations`](#get-adminuserconversations)
    - [`GET /admin/user/prescriptions`](#get-adminuserprescriptions)
    - [`GET /admin/user/broadcasts`](#get-adminuserbroadcasts)
    - [`GET /admin/user`](#get-adminuser)
  - [✅ Summary](#-summary-10)
    - [What We Learned](#what-we-learned-10)
    - [Key Takeaways](#key-takeaways-10)
    - [Next Steps](#next-steps-10)
  - [🎯 Next Chapter](#-next-chapter-10)
- [Chapter 12: Complete Flow - End-to-End Journey](#chapter-12-complete-flow---end-to-end-journey)
  - [📖 Overview](#-overview-1)
  - [🎯 Complete State Transition Flow](#-complete-state-transition-flow)
  - [🎭 Complete Journey with All Characters](#-complete-journey-with-all-characters)
    - [👤 Sarah (Patient) Journey](#-sarah-patient-journey)
    - [👨‍⚕️ Sam (Doctor 1) Journey](#️-sam-doctor-1-journey)
    - [👨‍⚕️ Parker (Doctor 2) Journey](#️-parker-doctor-2-journey)
    - [🏪 Daniel (Shop Owner 1) Journey](#-daniel-shop-owner-1-journey)
    - [🏪 Dollar (Shop Owner 2) Journey](#-dollar-shop-owner-2-journey)
    - [👨‍💼 Admin Journey](#-admin-journey)
  - [📊 Complete API Call Sequence](#-complete-api-call-sequence)
    - [Registration Phase](#registration-phase)
    - [Authentication Phase](#authentication-phase)
    - [Broadcast Phase](#broadcast-phase)
    - [Conversation Phase](#conversation-phase)
    - [Messaging Phase](#messaging-phase)
    - [Prescription Phase](#prescription-phase)
    - [Admin Monitoring Phase](#admin-monitoring-phase)
  - [🔌 Complete WebSocket Event Flow](#-complete-websocket-event-flow)
    - [Connection Events](#connection-events)
    - [Broadcast Events](#broadcast-events)
    - [Conversation Events](#conversation-events)
    - [Message Events](#message-events)
  - [🎯 Key System Features](#-key-system-features)
    - [1. Chat-First Architecture](#1-chat-first-architecture)
    - [2. Broadcast System](#2-broadcast-system)
    - [3. Conversation System](#3-conversation-system)
    - [4. Prescription System](#4-prescription-system)
    - [5. Admin System](#5-admin-system)
  - [🔐 Security \& Authorization](#-security--authorization)
    - [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
    - [Authentication \& Authorization](#authentication--authorization)
  - [✅ Complete System Summary](#-complete-system-summary)
    - [What We Built](#what-we-built)
    - [Key Technologies](#key-technologies)
    - [Key Features](#key-features-1)
  - [🎓 Best Practices](#-best-practices)
    - [Frontend Implementation](#frontend-implementation)
    - [Backend Implementation](#backend-implementation)
    - [Security](#security)
  - [🎯 Conclusion](#-conclusion)
    - [Key Achievements](#key-achievements)
    - [Next Steps](#next-steps-11)
  - [📚 Additional Resources](#-additional-resources)
    - [API Documentation](#api-documentation)
    - [Code Examples](#code-examples)
    - [Support](#support)
  - [🎉 Thank You!](#-thank-you)

---

## 🔐 Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🌐 Base URL

```
http://localhost:3000/api (or your server URL)
```

---

# Chapter 1: The Beginning - Platform Discovery and Registration

## 📖 Story Context

**Sarah** is a patient who needs medical help. She visits the **QuickMed Connect** platform for the first time and discovers that she can easily connect with doctors through the platform. She decides to register as a patient to get started.

---

## 🎯 State Transition

**State**: `0` (Not Registered) → `1` (Registered but not authenticated)

---

## 👤 User Journey: Sarah Registers as a Patient

### 🎬 Scene 1: Sarah Visits the Landing Page

**User Action**: Sarah opens the QuickMed Connect website and sees the landing page.

**Frontend Action**: 
- Landing page loads
- Registration button/modal is visible
- Sarah can see the platform overview and features

**What Happens**: Sarah is introduced to the platform and can choose to register.

---

### 🎬 Scene 2: Sarah Clicks "Register" Button

**User Action**: Sarah clicks the "Register" or "Sign Up" button on the landing page.

**Frontend Action**: 
- Registration form/modal appears
- Form fields are displayed:
  - Name (full name)
  - First Name
  - Last Name
  - Email
  - Password
  - Confirm Password
  - User Type (Patient, Doctor, Shop Owner) - **Sarah selects "Patient"**

**What Happens**: Registration form is displayed to Sarah.

---

### 🎬 Scene 3: Sarah Fills the Registration Form

**User Action**: Sarah fills in her details:
- **Name**: "Sarah Johnson"
- **First Name**: "Sarah"
- **Last Name**: "Johnson"
- **Email**: "sarah@example.com"
- **Password**: "password123"
- **Type**: "patient" (selected)

**Frontend Action**: 
- Frontend validates form fields (client-side validation)
- Checks if email is valid format
- Checks if password meets requirements (minimum length, etc.)
- Validates that user type is one of: "patient", "doctor", "shop_owner"
- **Important**: Frontend should prevent "admin" type selection (admin registration is not allowed)

**What Happens**: Form is validated on the frontend before submission.

---

### 🎬 Scene 4: Sarah Submits the Registration Form

**User Action**: Sarah clicks the "Register" or "Sign Up" button to submit the form.

**Frontend Action**: 
- Frontend sends API request to register Sarah
- Shows loading state (spinner, disabled button)
- Prepares request payload

**API Call**: `POST /auth/register`

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Sarah Johnson",
  "first_name": "Sarah",
  "last_name": "Johnson",
  "email": "sarah@example.com",
  "password": "password123",
  "type": "patient"
}
```

**What Happens**: Frontend sends registration request to the backend.

---

### 🎬 Scene 5: Backend Processes Registration

**Backend Flow**:

1. **Request Validation**:
   - Validates that all required fields are present
   - Validates email format
   - Validates password strength
   - **Validates user type**: Must be one of "patient", "doctor", "shop_owner"
   - **Rejects "admin" type**: Admin registration is not allowed through this endpoint

2. **Email Uniqueness Check**:
   - Checks if email already exists in the database
   - If email exists, returns error: "Email already registered"

3. **Password Hashing**:
   - Hashes the password using bcrypt or similar
   - Stores hashed password (never stores plain text password)

4. **User Creation**:
   - Creates user record in database:
     - `name`: "Sarah Johnson"
     - `first_name`: "Sarah"
     - `last_name`: "Johnson"
     - `email`: "sarah@example.com"
     - `password_hash`: "<hashed_password>"
     - `type`: "patient"
     - `approved_at`: `null` (patients don't need approval)
     - `status`: `1` (active)
     - `created_at`: Current timestamp
     - `updated_at`: Current timestamp

5. **Email Verification (Optional)**:
   - Generates verification token
   - Sends verification email to Sarah (if email verification is enabled)
   - Stores verification token in database

6. **Response Generation**:
   - Returns success response with user data (without password)

**What Happens**: Sarah's account is created in the database.

---

### 🎬 Scene 6: Backend Returns Success Response

**API Response**: `200 OK`

**Response Body**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "clxsarah123",
    "name": "Sarah Johnson",
    "first_name": "Sarah",
    "last_name": "Johnson",
    "email": "sarah@example.com",
    "type": "patient",
    "approved_at": null,
    "created_at": "2024-01-01T12:00:00Z"
  }
}
```

**What Happens**: Backend confirms that Sarah's registration was successful.

---

### 🎬 Scene 7: Frontend Handles Success Response

**Frontend Action**: 
- Receives success response
- Shows success message: "Registration successful! Please login to continue."
- Hides loading state
- Optionally redirects to login page
- Or shows login form directly

**What Happens**: Sarah sees that her registration was successful.

---

### 🎬 Scene 8: Next Steps

**State**: `1` (Registered but not authenticated)

**What Happens Next**: 
- Sarah needs to login to access the platform
- She can now use her email and password to login
- **Note**: Patients don't need admin approval, so Sarah can login immediately

**Next Chapter**: [Chapter 2: First Steps - Authentication and Login](#chapter-2-first-steps---authentication-and-login)

---

## 🔄 Alternative Flows

### 🎬 Scene 9: Sam (Doctor) Registers

**User Action**: Sam (Doctor) wants to register as a doctor.

**Frontend Action**: Same as Sarah's registration flow, but Sam selects "doctor" as user type.

**API Call**: `POST /auth/register`

**Request Body**:
```json
{
  "name": "Dr. Sam Smith",
  "first_name": "Sam",
  "last_name": "Smith",
  "email": "sam@example.com",
  "password": "password123",
  "type": "doctor"
}
```

**Backend Flow**:
- Same validation as patient registration
- Creates user record with `type: "doctor"`
- **Important**: Sets `approved_at: null` (doctors need admin approval)
- Returns success response

**API Response**: `200 OK`

**Response Body**:
```json
{
  "success": true,
  "message": "User registered successfully. Please wait for admin approval.",
  "data": {
    "id": "clxsam123",
    "name": "Dr. Sam Smith",
    "first_name": "Sam",
    "last_name": "Smith",
    "email": "sam@example.com",
    "type": "doctor",
    "approved_at": null,
    "created_at": "2024-01-01T12:00:00Z"
  }
}
```

**Frontend Action**: 
- Shows success message: "Registration successful! Your account is pending admin approval."
- Shows "Pending Approval" status
- Sam cannot login until admin approves his account

**What Happens Next**: 
- Admin needs to approve Sam's account
- Once approved, Sam can login and use the platform

---

### 🎬 Scene 10: Daniel (Shop Owner) Registers

**User Action**: Daniel (Shop Owner) wants to register as a shop owner.

**Frontend Action**: Same as Sarah's registration flow, but Daniel selects "shop_owner" as user type.

**API Call**: `POST /auth/register`

**Request Body**:
```json
{
  "name": "Daniel Pharmacy",
  "first_name": "Daniel",
  "last_name": "Pharmacy",
  "email": "daniel@example.com",
  "password": "password123",
  "type": "shop_owner"
}
```

**Backend Flow**:
- Same validation as patient registration
- Creates user record with `type: "shop_owner"`
- **Important**: Sets `approved_at: null` (shop owners need admin approval)
- Returns success response

**API Response**: `200 OK`

**Response Body**:
```json
{
  "success": true,
  "message": "User registered successfully. Please wait for admin approval.",
  "data": {
    "id": "clxdaniel123",
    "name": "Daniel Pharmacy",
    "first_name": "Daniel",
    "last_name": "Pharmacy",
    "email": "daniel@example.com",
    "type": "shop_owner",
    "approved_at": null,
    "created_at": "2024-01-01T12:00:00Z"
  }
}
```

**Frontend Action**: 
- Shows success message: "Registration successful! Your account is pending admin approval."
- Shows "Pending Approval" status
- Daniel cannot login until admin approves his account

**What Happens Next**: 
- Admin needs to approve Daniel's account
- Once approved, Daniel can login and use the platform

---

## ⚠️ Error Handling

### 🚫 Error 1: Email Already Registered

**Scenario**: Sarah tries to register with an email that already exists.

**API Response**: `409 Conflict`

**Response Body**:
```json
{
  "success": false,
  "message": "Email already registered"
}
```

**Frontend Action**: 
- Shows error message: "This email is already registered. Please use a different email or login."
- Highlights email field
- Allows Sarah to try again with a different email

---

### 🚫 Error 2: Invalid User Type

**Scenario**: Someone tries to register with `type: "admin"`.

**API Response**: `400 Bad Request`

**Response Body**:
```json
{
  "success": false,
  "message": "Invalid user type. Admin registration is not allowed."
}
```

**Frontend Action**: 
- Shows error message: "Admin registration is not allowed."
- Prevents form submission
- **Note**: Frontend should prevent "admin" type selection in the first place

---

### 🚫 Error 3: Validation Error

**Scenario**: Sarah submits the form with missing or invalid fields.

**API Response**: `400 Bad Request`

**Response Body**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

**Frontend Action**: 
- Shows error messages for each field
- Highlights invalid fields
- Allows Sarah to correct errors and try again

---

## 📝 API Documentation

### `POST /auth/register`

**Description**: Register a new user (patient, doctor, or shop_owner)

**Role**: Public (no authentication required)

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Sarah Johnson",
  "first_name": "Sarah",
  "last_name": "Johnson",
  "email": "sarah@example.com",
  "password": "password123",
  "type": "patient"
}
```

**Request Body Fields**:
- `name` (required, string): Full name of the user
- `first_name` (required, string): First name of the user
- `last_name` (required, string): Last name of the user
- `email` (required, string, email format): Email address of the user
- `password` (required, string, min 6 characters): Password for the user
- `type` (optional, string, enum: ["patient", "doctor", "shop_owner"]): User type (default: "patient")
  - **Note**: "admin" type is not allowed

**Success Response**: `200 OK`

**Response Body**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "clxsarah123",
    "name": "Sarah Johnson",
    "first_name": "Sarah",
    "last_name": "Johnson",
    "email": "sarah@example.com",
    "type": "patient",
    "approved_at": null,
    "created_at": "2024-01-01T12:00:00Z"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Validation error or invalid user type
- `409 Conflict`: Email already registered
- `500 Internal Server Error`: Server error

**Notes**:
- Patients don't need admin approval (`approved_at: null` is OK)
- Doctors and shop owners need admin approval (`approved_at: null` until approved)
- Admin registration is not allowed through this endpoint
- Password is hashed before storing in database
- Email verification is optional (if enabled, verification email is sent)

---

## 🎨 Frontend Implementation Guide

### Registration Form Component

```typescript
// Registration Form Component
interface RegistrationFormData {
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  type: 'patient' | 'doctor' | 'shop_owner';
}

const RegistrationForm = () => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    type: 'patient',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (!formData.email || !formData.password) {
      alert('Please fill in all required fields');
      return;
    }

    // Prevent admin type selection
    if (formData.type === 'admin') {
      alert('Admin registration is not allowed');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Show success message
        alert('Registration successful! Please login to continue.');
        // Redirect to login page
        window.location.href = '/login';
      } else {
        // Show error message
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Full Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="First Name"
        value={formData.first_name}
        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Last Name"
        value={formData.last_name}
        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
        minLength={6}
      />
      <select
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
      >
        <option value="patient">Patient</option>
        <option value="doctor">Doctor</option>
        <option value="shop_owner">Shop Owner</option>
        {/* Admin option is not available */}
      </select>
      <button type="submit">Register</button>
    </form>
  );
};
```

---

## ✅ Summary

### What We Learned

1. **Registration Flow**: Users can register as patients, doctors, or shop owners
2. **User Types**: Patients don't need approval; doctors and shop owners need admin approval
3. **Admin Registration**: Admin registration is not allowed through the public API
4. **Password Security**: Passwords are hashed before storing in database
5. **Email Validation**: Email must be unique and valid format
6. **Error Handling**: Proper error handling for validation errors and conflicts

### Key Takeaways

- ✅ Patients can register and login immediately
- ✅ Doctors and shop owners need admin approval before they can use the platform
- ✅ Admin registration is not allowed through the public API
- ✅ All user data is validated before creating account
- ✅ Passwords are securely hashed

### Next Steps

- **Sarah**: Can now login to the platform (Chapter 2)
- **Sam**: Needs to wait for admin approval (Chapter 11)
- **Daniel**: Needs to wait for admin approval (Chapter 11)

---

## 🎯 Next Chapter

**[Chapter 2: First Steps - Authentication and Login](#chapter-2-first-steps---authentication-and-login)**

In the next chapter, we'll follow Sarah as she logs into the platform and gains access to the landing page where she can send messages to doctors.

---

## Chapter 2: First Steps - Authentication and Login

## 📖 Story Context

After registering, **Sarah** needs to log in so she can send her first medical message. Logging in also prepares the real-time connection that powers the chat experience. Meanwhile, **Sam** and **Daniel** also try to log in—but because their accounts require admin approval, their experiences differ.

---

## 🎯 State Transition

**State**: `1` (Registered but not authenticated) → `2` (Authenticated)

---

## 👤 User Journey: Sarah Logs In

### 🎬 Scene 1: Sarah Navigates to Login

**User Action**: Sarah lands on the QuickMed Connect homepage and clicks the "Login" button in the navbar.

**Frontend Action**:
- Displays the login form modal/page with fields for email and password
- Provides a link back to registration if needed
- Shows a subtle reminder that patients can immediately start chatting after login

---

### 🎬 Scene 2: Sarah Enters Credentials

**User Action**: Sarah fills out the login form:
- **Email**: `sarah@example.com`
- **Password**: `password123`

**Frontend Action**:
- Validates input locally (non-empty, email format)
- Keeps the "Login" button disabled until inputs are valid

---

### 🎬 Scene 3: Sarah Submits Login Form

**User Action**: Sarah clicks "Login".

**Frontend Action**:
- Sends an API request to authenticate her account
- Shows a loading spinner and disables the button to prevent duplicate submissions

**API Call**: `POST /auth/login`

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "sarah@example.com",
  "password": "password123"
}
```

---

### 🎬 Scene 4: Backend Authenticates Sarah

**Backend Flow**:
1. **Validate Request**: Ensures both email and password are present.
2. **Find User**: Looks up Sarah by email.
3. **Verify Password**: Compares the provided password with the stored hash using bcrypt.
4. **Check Account Status**:
   - Patients can log in immediately (no approval check).
   - If the account was soft-deleted or deactivated, return `403 Forbidden`.
5. **Generate Tokens**:
   - Creates a JWT access token (containing `sub` / user ID and user type).
   - Optionally stores refresh tokens or session metadata (e.g., in Redis).
6. **Return Response**: Sends the token and user profile back to the frontend.

**API Response**: `200 OK`

**Response Body**:
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxsarah123",
    "name": "Sarah Johnson",
    "email": "sarah@example.com",
    "type": "patient"
  }
}
```

---

### 🎬 Scene 5: Frontend Stores Session

**Frontend Action**:
- Stores `access_token` in secure storage (e.g., `localStorage`, `sessionStorage`, or in-memory state)
- Updates global auth state (e.g., React context, Zustand, Redux)
- Configures default `Authorization` header for future API calls
- Initiates WebSocket connection with the token (required for real-time chat)

```typescript
const socket = io(process.env.API_URL, {
  auth: {
    token: accessToken,
  },
});
```

---

### 🎬 Scene 6: Redirect Based on Role

**Frontend Action**:
- For **patients** (Sarah): Redirects to the landing page where the broadcast text field is ready for use.
- For **doctors** (Sam) and **shop owners** (Daniel): Redirects to their role-specific inbox once approved.
- For **admin**: Redirects to admin dashboard (covered in Chapter 11).

**What Sarah Sees**: The landing page shows a friendly message—"How can we help today?"—with a large text area to send her first broadcast, and the navbar "Inbox" button is now active.

---

### 🎬 Scene 7: WebSocket Ready

**Frontend Action**:
- Listens for WebSocket events (`conversation`, `message`, `broadcast_updated`, etc.)
- Updates UI in real-time once conversations start

**Next State**: Sarah is now authenticated and ready to create broadcasts (covered in Chapter 3).

---

## 🔄 Alternative Journeys

### 🎬 Scene 8: Sam Attempts to Log In (Before Approval)

**User Action**: Sam (Doctor) tries to log in right after registering.

**Backend Flow**:
- Finds the user account.
- Detects that `approved_at` is `null` for a `doctor`.
- Returns an error indicating the account is pending approval.

**API Response**: `403 Forbidden`

**Response Body**:
```json
{
  "success": false,
  "message": "Your account is awaiting admin approval. Please try again later."
}
```

**Frontend Action**:
- Displays an inline message: "Thanks for registering! An admin will approve your account soon."
- Keeps the login form available in case Sam wants to try again later.

---

### 🎬 Scene 9: Daniel Attempts to Log In (Before Approval)

**User Action**: Daniel (Shop Owner) tries to log in before admin approval.

**Backend Flow**:
- Same as Sam, but targeted to `shop_owner` accounts.

**API Response**: `403 Forbidden`

**Response Body**:
```json
{
  "success": false,
  "message": "Your shop owner account is awaiting admin approval. Please try again later."
}
```

**Frontend Action**:
- Shows message: "We are verifying your pharmacy. You will receive an email when approval is complete."
- Optionally provides support contact info.

---

### 🎬 Scene 10: Invalid Credentials

**User Action**: Someone enters an incorrect password.

**API Response**: `401 Unauthorized`

**Response Body**:
```json
{
  "success": false,
  "message": "Invalid credentials."
}
```

**Frontend Action**:
- Shows message: "The email or password you entered is incorrect."
- Allows retry without clearing the email field.

---

## 🛡️ Security & Session Considerations

- **Password Storage**: Passwords are hashed using bcrypt before storage.
- **Token Lifetime**: Access tokens have a limited lifetime (e.g., 15 minutes or 1 hour). Optional refresh flow can be added.
- **Logout Flow**: Clearing stored token and disconnecting WebSocket ensures session cleanup.
- **Account Lockout**: (Optional) After multiple failed attempts, throttle login tries.

---

## 📝 API Documentation

### `POST /auth/login`

**Description**: Authenticate a registered user and return a JWT access token.

**Role**: Public (no authentication required)

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "sarah@example.com",
  "password": "password123"
}
```

**Success Response**: `200 OK`

**Response Body**:
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxsarah123",
    "name": "Sarah Johnson",
    "email": "sarah@example.com",
    "type": "patient"
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid email or password
- `403 Forbidden`: Account pending approval (doctors/shop owners) or deactivated
- `404 Not Found`: Email not found
- `500 Internal Server Error`: Unexpected server error

**Notes**:
- Doctors and shop owners must have `approved_at` set before successful login.
- Admin login follows the same flow but redirects to the admin dashboard.
- Tokens are required for all subsequent protected endpoints.

---

## 🎨 Frontend Implementation Guide

### Login Form Component (React/TypeScript Example)

```typescript
interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message || 'Login failed');
        setIsLoading(false);
        return;
      }

      // Persist token
      localStorage.setItem('access_token', data.access_token);
      setAuth({ user: data.user, token: data.access_token });

      // Redirect based on role
      switch (data.user.type) {
        case 'patient':
          router.push('/'); // Landing page with broadcast form
          break;
        case 'doctor':
          router.push('/inbox/broadcasts');
          break;
        case 'shop_owner':
          router.push('/inbox/conversations');
          break;
        case 'admin':
          router.push('/admin/dashboard');
          break;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Unable to login. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in…' : 'Login'}
      </button>
    </form>
  );
};
```

### WebSocket Initialization

```typescript
useEffect(() => {
  const token = localStorage.getItem('access_token');
  if (!token) return;

  const socket = io(process.env.API_URL, {
    auth: { token },
  });

  socket.on('connect', () => {
    console.log('Connected to chat server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from chat server');
  });

  return () => {
    socket.disconnect();
  };
}, []);
```

---

## ✅ Summary

### What We Learned

1. **Patients** (like Sarah) can log in immediately after registration.
2. **Doctors and shop owners** must wait for admin approval before logging in.
3. **JWT tokens** are returned upon successful login and must be included in subsequent requests.
4. **WebSocket connections** should be established right after login to enable real-time chat.
5. **Role-based redirects** ensure each user type lands on the correct starting page.

### Key Takeaways

- ✅ Successful login transitions the user to State 2 (authenticated).
- ✅ Tokens must be securely stored and attached to all API requests.
- ✅ Doctors/shop owners see a clear message if their accounts are pending approval.
- ✅ Login sets the stage for real-time communication via WebSocket.

### Next Steps

- **Sarah**: Ready to send her first broadcast from the landing page (Chapter 3).
- **Sam** and **Daniel**: Must wait for admin approval before continuing.
- **Admin**: Will handle approvals in Chapter 11.

---

## 🎯 Next Chapter

**[Chapter 3: Landing Page - Patient Sends Message](#chapter-3-landing-page---patient-sends-message)**

In the next chapter, we follow Sarah as she uses the landing page to send her first broadcast, triggering the real-time workflow that alerts doctors.

---

# Chapter 3: Landing Page - Patient Sends Message

## 📖 Story Context

After successfully logging in, **Sarah** is redirected to the **landing page** - the main entry point for patients. The landing page features a prominent text field where Sarah can describe her medical issue and send it to all available doctors. This is where the magic begins - one message from Sarah will reach all verified doctors in real-time!

---

## 🎯 State Transition

**State**: `2` (Authenticated) → `3` (Broadcast created, waiting for doctor)

---

## 👤 User Journey: Sarah Sends Her First Broadcast

### 🎬 Scene 1: Sarah Lands on the Landing Page

**User Action**: After logging in, Sarah is automatically redirected to the landing page.

**Frontend Action**: 
- Landing page loads with Sarah's authenticated session
- Displays the main text field for sending messages
- Shows a welcoming message: "How can we help you today?" or "Describe your medical issue"
- Navbar is visible with "Inbox" button (initially empty)
- WebSocket connection is already established from login

**What Sarah Sees**: 
- A clean, focused interface with a large text area
- Clear instructions on how to send her message
- The "Inbox" button in the navbar (she can check it later)
- No dashboard or complex navigation - just a simple message interface

**What Happens**: Sarah is ready to send her first broadcast.

---

### 🎬 Scene 2: Sarah Types Her Medical Issue

**User Action**: Sarah starts typing her medical concern in the text field:
- **Message**: "I have a severe headache and fever that started this morning. I also feel nauseous and tired."

**Frontend Action**: 
- Text field accepts input
- Character count (optional) may be displayed
- Send button becomes enabled when text is entered
- Frontend validates that message is not empty (client-side)

**What Happens**: Sarah prepares her message to send to doctors.

---

### 🎬 Scene 3: Sarah Clicks "Send" Button

**User Action**: Sarah clicks the "Send" or "Ask for Help" button.

**Frontend Action**: 
- Frontend validates message (not empty, minimum length, etc.)
- Shows loading state (spinner, disabled button)
- Disables text field during submission
- Prepares API request with message content
- Includes JWT token in Authorization header

**API Call**: `POST /chat/broadcast`

**Request Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body**:
```json
{
  "message": "I have a severe headache and fever that started this morning. I also feel nauseous and tired."
}
```

**What Happens**: Frontend sends broadcast creation request to backend.

---

### 🎬 Scene 4: Backend Processes Broadcast Creation

**Backend Flow**:

1. **Request Validation**:
   - Validates JWT token and extracts user ID (Sarah's ID)
   - Validates that message field is present and not empty
   - Validates message length (minimum and maximum if applicable)

2. **User Verification**:
   - Queries database to find Sarah's user record
   - Verifies that Sarah exists and is active
   - **Important**: Verifies that Sarah's `type` is `"patient"` (only patients can create broadcasts)
   - Returns error if user is not a patient

3. **Broadcast Creation**:
   - Creates broadcast record in database:
     - `patient_id`: Sarah's user ID
     - `message`: Sarah's message content
     - `status`: `"open"` (default status - waiting for doctor response)
     - `assisted_by`: `null` (no doctor has responded yet)
     - `conversation_id`: `null` (no conversation created yet)
     - `created_at`: Current timestamp
     - `updated_at`: Current timestamp

4. **Fetch Verified Doctors**:
   - Queries all verified doctors from database:
     - `type`: `"doctor"`
     - `approved_at`: Not null (only approved doctors)
     - `deleted_at`: Null (only active doctors)
   - Gets list of all doctor user IDs

5. **WebSocket Notification**:
   - For each verified doctor:
     - Emits WebSocket event `new_broadcast` to doctor's socket
     - Event includes full broadcast data with patient information
   - All doctors receive real-time notification about Sarah's broadcast

6. **Response Generation**:
   - Returns success response with broadcast data
   - Includes patient information (name, avatar URL)

**What Happens**: Sarah's broadcast is created and sent to all verified doctors in real-time.

---

### 🎬 Scene 5: Backend Returns Success Response

**API Response**: `200 OK`

**Response Body**:
```json
{
  "success": true,
  "message": "Broadcast created successfully and sent to all doctors",
  "data": {
    "id": "clxbroadcast123",
    "patient_id": "clxsarah123",
    "message": "I have a severe headache and fever that started this morning. I also feel nauseous and tired.",
    "status": "open",
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z",
    "patient": {
      "id": "clxsarah123",
      "name": "Sarah Johnson",
      "email": "sarah@example.com",
      "avatar_url": "https://example.com/avatars/sarah.jpg"
    }
  }
}
```

**What Happens**: Backend confirms that Sarah's broadcast was successfully created.

---

### 🎬 Scene 6: Frontend Handles Success Response

**Frontend Action**: 
- Receives success response from backend
- Shows success message: "Your message has been sent to all available doctors. A doctor will respond soon!"
- Clears text field (optional - some UIs keep the message)
- Updates UI to show "Waiting for doctor response" status
- Optionally shows broadcast status or timestamp
- Hides loading state
- Re-enables text field and send button

**What Sarah Sees**: 
- Success message confirming her broadcast was sent
- Clear indication that doctors have been notified
- Instructions to wait for a doctor response
- Option to check "Inbox" button in navbar (though it will be empty until doctor responds)

**What Happens**: Sarah knows her message has been sent and is waiting for a doctor to respond.

---

### 🎬 Scene 7: Real-Time Notification to Doctors

**WebSocket Event**: `new_broadcast`

**Event Data** (sent to each doctor):
```json
{
  "broadcast": {
    "id": "clxbroadcast123",
    "patient_id": "clxsarah123",
    "message": "I have a severe headache and fever that started this morning. I also feel nauseous and tired.",
    "status": "open",
    "created_at": "2024-01-01T12:00:00Z",
    "patient": {
      "id": "clxsarah123",
      "name": "Sarah Johnson",
      "email": "sarah@example.com",
      "avatar_url": "https://example.com/avatars/sarah.jpg"
    }
  }
}
```

**What Happens**: 
- **Sam** (Doctor 1) receives `new_broadcast` event in real-time
- **Parker** (Doctor 2) also receives `new_broadcast` event in real-time
- All other verified doctors receive the same event
- Doctors see Sarah's broadcast appear in their inbox immediately (covered in Chapter 5)

**Frontend Behavior (Doctor Side)**: 
- Doctors see notification badge on their inbox
- Broadcast appears in their broadcast inbox list
- Real-time update without page refresh

**What Happens**: All doctors are immediately notified about Sarah's broadcast.

---

### 🎬 Scene 8: Next Steps

**State**: `3` (Broadcast created, waiting for doctor)

**What Happens Next**: 
- Sarah's broadcast is now visible to all verified doctors
- Sarah can wait for a doctor to respond
- Sarah can click "Inbox" button to check her conversation list (will be empty until doctor responds)
- When a doctor responds, a conversation will be created (covered in Chapter 6)

**Next Chapter**: [Chapter 4: Patient Inbox - Conversation List (Initial State)](#chapter-4-patient-inbox---conversation-list-initial-state)

---

## 🔄 Alternative Flows

### 🎬 Scene 9: Sarah Sends Another Broadcast

**User Action**: Sarah wants to send another medical question while waiting for the first one.

**Frontend Action**: 
- Sarah can type another message in the text field
- Click "Send" again
- Another broadcast is created with status "open"

**API Call**: `POST /chat/broadcast` (same as before)

**What Happens**: 
- Multiple broadcasts can exist simultaneously
- Each broadcast is independent
- Each broadcast can be responded to by a different doctor (or the same doctor)

**Note**: Sarah can have multiple open broadcasts at the same time.

---

### 🎬 Scene 10: Sarah Checks Her Inbox (Empty State)

**User Action**: Sarah clicks "Inbox" button in navbar to check if any doctor has responded.

**Frontend Action**: 
- Loads conversation list page
- Calls API: `GET /chat/conversation`
- Receives empty array (no conversations yet)

**API Response**: `200 OK`

**Response Body**:
```json
{
  "success": true,
  "data": [],
  "count": 0
}
```

**Frontend Behavior**: 
- Shows empty state: "No conversations yet. A doctor will respond to your message soon."
- Shows "Waiting for doctor response" message
- Optionally shows list of Sarah's broadcasts with their status

**What Happens**: Sarah sees that no doctor has responded yet (covered in detail in Chapter 4).

---

## ⚠️ Error Handling

### 🚫 Error 1: User Not a Patient

**Scenario**: Someone tries to create a broadcast but their user type is not "patient".

**API Response**: `403 Forbidden`

**Response Body**:
```json
{
  "success": false,
  "message": "Only patients can create broadcasts"
}
```

**Frontend Action**: 
- Shows error message: "Only patients can send messages. Please login with a patient account."
- Prevents broadcast creation
- Optionally redirects to appropriate page based on user type

---

### 🚫 Error 2: Message Validation Error

**Scenario**: Sarah tries to send an empty message or message that's too short.

**API Response**: `400 Bad Request`

**Response Body**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "message",
      "message": "Message is required and must be at least 10 characters"
    }
  ]
}
```

**Frontend Action**: 
- Shows error message for validation errors
- Highlights text field
- Allows Sarah to correct the message and try again
- **Note**: Frontend should validate before sending (client-side validation)

---

### 🚫 Error 3: Unauthorized Access

**Scenario**: Sarah's JWT token is invalid or expired.

**API Response**: `401 Unauthorized`

**Response Body**:
```json
{
  "success": false,
  "message": "User not authenticated"
}
```

**Frontend Action**: 
- Shows error message: "Your session has expired. Please login again."
- Redirects to login page
- Clears stored token

---

### 🚫 Error 4: No Doctors Available

**Scenario**: Sarah sends a broadcast but there are no verified doctors in the system.

**Backend Flow**: 
- Broadcast is still created successfully
- No WebSocket events are emitted (no doctors to notify)
- Response indicates broadcast was created

**API Response**: `200 OK`

**Response Body**:
```json
{
  "success": true,
  "message": "Broadcast created successfully",
  "data": {
    "id": "clxbroadcast123",
    "message": "I have a severe headache and fever...",
    "status": "open",
    ...
  }
}
```

**Frontend Action**: 
- Shows success message
- Sarah's broadcast is created and will be visible when doctors are approved
- **Note**: This is a valid scenario - broadcast exists but no doctors are available yet

---

## 📝 API Documentation

### `POST /chat/broadcast`

**Description**: Create a new broadcast (medical issue message) that will be sent to all verified doctors

**Role**: `patient` (only patients can create broadcasts)

**Authentication**: Required (JWT token)

**Request Headers**:
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "message": "I have a severe headache and fever that started this morning. I also feel nauseous and tired."
}
```

**Request Body Fields**:
- `message` (required, string): The medical issue message to broadcast to doctors
  - Minimum length: 10 characters (configurable)
  - Maximum length: 5000 characters (configurable)

**Success Response**: `200 OK`

**Response Body**:
```json
{
  "success": true,
  "message": "Broadcast created successfully and sent to all doctors",
  "data": {
    "id": "clxbroadcast123",
    "patient_id": "clxsarah123",
    "message": "I have a severe headache and fever that started this morning. I also feel nauseous and tired.",
    "status": "open",
    "assisted_by": null,
    "conversation_id": null,
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z",
    "patient": {
      "id": "clxsarah123",
      "name": "Sarah Johnson",
      "email": "sarah@example.com",
      "avatar_url": "https://example.com/avatars/sarah.jpg"
    }
  }
}
```

**Response Fields**:
- `id`: Broadcast ID (unique identifier)
- `patient_id`: ID of the patient who created the broadcast
- `message`: The broadcast message content
- `status`: Broadcast status (`"open"` initially, changes to `"assisted"` when doctor responds)
- `assisted_by`: ID of the doctor who responded (null until doctor responds)
- `conversation_id`: ID of the conversation created when doctor responds (null until doctor responds)
- `created_at`: Timestamp when broadcast was created
- `updated_at`: Timestamp when broadcast was last updated
- `patient`: Patient information (name, email, avatar URL)

**Error Responses**:
- `400 Bad Request`: Validation error (empty message, invalid length, etc.)
- `401 Unauthorized`: User not authenticated (invalid or missing JWT token)
- `403 Forbidden`: User is not a patient (only patients can create broadcasts)
- `404 Not Found`: Patient not found
- `500 Internal Server Error`: Server error

**WebSocket Events**:
- `new_broadcast`: Emitted to all verified doctors when broadcast is created
  - Event data includes full broadcast object with patient information
  - All doctors receive this event in real-time

**Notes**:
- Only patients can create broadcasts
- Broadcast status is set to `"open"` initially
- Broadcast is sent to all verified doctors (those with `approved_at` not null)
- WebSocket events are emitted to all doctors immediately
- Broadcast can be responded to by any verified doctor (first come, first served)

---

## 🎨 Frontend Implementation Guide

### Landing Page Component (React/TypeScript Example)

```typescript
interface BroadcastFormData {
  message: string;
}

const LandingPage = () => {
  const [formData, setFormData] = useState<BroadcastFormData>({
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { user, token } = useAuthContext();
  const router = useRouter();

  // Only patients should see this page
  useEffect(() => {
    if (user?.type !== 'patient') {
      router.push('/inbox');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (!formData.message.trim()) {
      alert('Please enter your message');
      return;
    }

    if (formData.message.length < 10) {
      alert('Message must be at least 10 characters');
      return;
    }

    setIsLoading(true);
    setSuccessMessage('');

    try {
      const response = await fetch('/api/chat/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Show success message
        setSuccessMessage('Your message has been sent to all available doctors. A doctor will respond soon!');
        
        // Clear form (optional)
        setFormData({ message: '' });
        
        // Optionally redirect to inbox or show broadcast status
        // router.push('/inbox');
      } else {
        // Show error message
        alert(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Broadcast error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="landing-page">
      <header>
        <nav>
          <button onClick={() => router.push('/inbox')}>
            Inbox
          </button>
        </nav>
      </header>

      <main>
        <h1>How can we help you today?</h1>
        <p>Describe your medical issue and our doctors will respond soon.</p>

        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Describe your medical issue..."
            value={formData.message}
            onChange={(e) => setFormData({ message: e.target.value })}
            rows={5}
            disabled={isLoading}
            minLength={10}
            maxLength={5000}
            required
          />
          
          <div className="character-count">
            {formData.message.length} / 5000 characters
          </div>

          <button type="submit" disabled={isLoading || !formData.message.trim()}>
            {isLoading ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        <div className="info">
          <p>Your message will be sent to all available doctors.</p>
          <p>A doctor will respond to your message soon.</p>
        </div>
      </main>
    </div>
  );
};
```

### WebSocket Event Handling (Doctor Side)

```typescript
// This is handled on the doctor's side when they receive the broadcast
useEffect(() => {
  const socket = io(process.env.API_URL, {
    auth: { token: doctorToken },
  });

  socket.on('new_broadcast', (data: { broadcast: Broadcast }) => {
    // Update doctor's broadcast inbox
    setBroadcasts((prev) => [data.broadcast, ...prev]);
    
    // Show notification
    toast.info(`New broadcast from ${data.broadcast.patient.name}`);
    
    // Update notification badge
    setNotificationCount((prev) => prev + 1);
  });

  return () => {
    socket.disconnect();
  };
}, [doctorToken]);
```

---

## ✅ Summary

### What We Learned

1. **Landing Page**: Patients land on a simple page with a text field to send messages
2. **Broadcast Creation**: One message from a patient creates a broadcast that goes to all verified doctors
3. **Real-Time Notification**: All doctors receive WebSocket events immediately when a broadcast is created
4. **Broadcast Status**: Broadcasts start with status `"open"` and wait for a doctor to respond
5. **No Dashboard**: Patients don't have a dashboard - just a landing page and inbox
6. **Simple Interface**: The landing page is focused and easy to use - no complex navigation

### Key Takeaways

- ✅ Patients can send messages directly from the landing page
- ✅ Broadcasts are created with status `"open"` initially
- ✅ All verified doctors receive real-time WebSocket notifications
- ✅ Broadcasts are independent - patients can have multiple open broadcasts
- ✅ The landing page is the primary interface for patients (no dashboard)

### Next Steps

- **Sarah**: Her broadcast is now visible to all doctors (State 3)
- **Sarah**: Can check her inbox (will be empty until doctor responds) - Chapter 4
- **Doctors**: Will see Sarah's broadcast in their inbox - Chapter 5
- **Doctors**: Can respond to Sarah's broadcast - Chapter 6

---

## 🎯 Next Chapter

**[Chapter 4: Patient Inbox - Conversation List (Initial State)](#chapter-4-patient-inbox---conversation-list-initial-state)**

In the next chapter, we'll see what happens when Sarah clicks the "Inbox" button. Initially, the conversation list will be empty because no doctor has responded yet. We'll also explore how the conversation list updates in real-time when a doctor responds.

---

# Chapter 4: Patient Inbox - Conversation List (Initial State)

## 📖 Story Context

After sending her broadcast, **Sarah** is curious about whether any doctor has responded. She clicks the **"Inbox"** button in the navbar to check her conversation list. Since no doctor has responded yet, she sees an empty state - but she's prepared to receive real-time notifications when a doctor does respond!

---

## 🎯 State Transition

**State**: `3` (Broadcast created, waiting for doctor) → `4` (Inbox loaded, empty, waiting for doctor)

---

## 👤 User Journey: Sarah Checks Her Inbox

### 🎬 Scene 1: Sarah Clicks "Inbox" Button

**User Action**: Sarah clicks the "Inbox" button in the navbar (from landing page or any page).

**Frontend Action**: 
- Navigation to conversation list page
- Conversation list page starts loading
- Shows loading state (spinner or skeleton screen)
- Prepares to fetch conversations from API

**What Sarah Sees**: 
- Loading indicator while conversations are being fetched
- Navbar still visible with "Inbox" button active
- Back button or home button to return to landing page

**What Happens**: Frontend initiates the process to load Sarah's conversations.

---

### 🎬 Scene 2: Frontend Calls API to Load Conversations

**Frontend Action**: 
- Frontend extracts user ID from stored JWT token
- Prepares API request with authentication header
- Sends API request to fetch conversations

**API Call**: `GET /chat/conversation`

**Request Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body**: None (GET request)

**What Happens**: Frontend requests all conversations where Sarah is creator or participant.

---

### 🎬 Scene 3: Backend Processes Request

**Backend Flow**:

1. **Request Validation**:
   - Validates JWT token from Authorization header
   - Extracts user ID (Sarah's ID) from token
   - Verifies user is authenticated

2. **User Verification**:
   - Verifies that user exists and is active
   - No role check needed (all authenticated users can access their conversations)

3. **Query Conversations**:
   - Queries database for conversations where:
     - `creator_id = userId` OR `participant_id = userId`
     - `deleted_at IS NULL` (only non-deleted conversations)
   - Orders by `updated_at DESC` (most recently updated first)
   - Selects conversation fields:
     - `id`, `creator_id`, `participant_id`, `broadcast_id`, `type`, `status`, `assisted_by`, `created_at`, `updated_at`
     - Creator information (id, name, avatar)
     - Participant information (id, name, avatar)
     - Last message preview (most recent message)

4. **Process Results**:
   - Currently returns **empty array** (no conversations exist yet)
   - No conversations because no doctor has responded to Sarah's broadcast

5. **Add Avatar URLs**:
   - Processes avatar URLs for creator and participant (not applicable for empty array)
   - Converts relative paths to full URLs

6. **Response Generation**:
   - Returns success response with empty array
   - Includes count: 0

**What Happens**: Backend confirms that Sarah has no conversations yet.

---

### 🎬 Scene 4: Backend Returns Empty Response

**API Response**: `200 OK`

**Response Body**:
```json
{
  "success": true,
  "data": [],
  "count": 0
}
```

**What Happens**: Backend confirms that Sarah's conversation list is empty.

---

### 🎬 Scene 5: Frontend Displays Empty State

**Frontend Action**: 
- Receives empty array from API
- Hides loading state
- Displays empty state UI

**What Sarah Sees**: 
- **Empty State Message**: "No conversations yet. A doctor will respond to your message soon."
- **Optional**: Shows list of Sarah's broadcasts with their status (open, assisted, closed)
- **Optional**: Shows "Waiting for doctor response" indicator
- **Optional**: Shows button to go back to landing page or send another message
- **Clean Interface**: No conversation cards or chat previews

**Empty State UI Elements**:
- Empty state illustration or icon
- Helpful message explaining the situation
- Optional: List of broadcasts with status
- Optional: "Send Another Message" button
- Optional: "Go Back" button

**What Happens**: Sarah sees that no doctor has responded yet, but she understands the system is waiting for a doctor to respond.

---

### 🎬 Scene 6: WebSocket Connection Setup

**Frontend Action**: 
- WebSocket connection is already established from login (Chapter 2)
- Frontend listens for WebSocket events on conversation list page
- Sets up event listeners for:
  - `conversation` event (new conversation notification)
  - `broadcast_updated` event (broadcast status updates)
  - `message` event (new messages in conversations)

**WebSocket Events to Listen For**:
- `conversation`: Emitted when a new conversation is created (when doctor responds)
- `broadcast_updated`: Emitted when broadcast status changes
- `message`: Emitted when a new message is received in a conversation

**What Happens**: Frontend is ready to receive real-time notifications when a doctor responds.

---

### 🎬 Scene 7: Real-Time Notification Setup

**Frontend Action**: 
- Frontend sets up WebSocket event handlers
- Listens for `conversation` event (will be received when doctor responds)
- When `conversation` event is received:
  - Updates conversation list in real-time
  - Shows notification badge
  - Optionally plays notification sound
  - Optionally shows toast notification

**WebSocket Event Handler**:
```typescript
socket.on('conversation', (data: { conversation: Conversation }) => {
  // Update conversation list
  setConversations((prev) => [data.conversation, ...prev]);
  
  // Show notification
  toast.info('A doctor has responded to your message!');
  
  // Update notification badge
  setNotificationCount((prev) => prev + 1);
});
```

**What Happens**: Frontend is ready to update the conversation list in real-time when a doctor responds.

---

### 🎬 Scene 8: Next Steps

**State**: `4` (Inbox loaded, empty, waiting for doctor)

**What Happens Next**: 
- Sarah's conversation list is empty (no doctor has responded yet)
- Sarah can wait for a doctor to respond
- Sarah can go back to landing page to send another message
- When a doctor responds, a conversation will be created and Sarah will receive a real-time notification
- The conversation will appear in Sarah's inbox automatically (covered in Chapter 7)

**Next Chapter**: [Chapter 5: Doctor Broadcast Inbox - Viewing Broadcasts](#chapter-5-doctor-broadcast-inbox---viewing-broadcasts)

---

## 🔄 Alternative Flows

### 🎬 Scene 9: Sarah Refreshes the Page

**User Action**: Sarah refreshes the conversation list page.

**Frontend Action**: 
- Page reloads
- API call is made again: `GET /chat/conversation`
- Still returns empty array (no doctor has responded yet)
- Empty state is displayed again

**What Happens**: Sarah sees the same empty state after refresh.

---

### 🎬 Scene 10: Sarah Navigates Away and Comes Back

**User Action**: Sarah navigates to landing page, then clicks "Inbox" again.

**Frontend Action**: 
- Navigation to conversation list page
- API call: `GET /chat/conversation`
- Still returns empty array
- Empty state is displayed

**What Happens**: Sarah sees the same empty state when returning to inbox.

---

### 🎬 Scene 11: Real-Time Update When Doctor Responds

**User Action**: Sarah is on the conversation list page, and a doctor (Sam) responds to her broadcast.

**WebSocket Event**: `conversation`

**Event Data** (received by Sarah):
```json
{
  "conversation": {
    "id": "clxconv123",
    "creator_id": "clxsarah123",
    "participant_id": "clxsam123",
    "type": "patient_doctor",
    "status": "open",
    "broadcast_id": "clxbroadcast123",
    "assisted_by": "clxsam123",
    "created_at": "2024-01-01T12:05:00Z",
    "updated_at": "2024-01-01T12:05:00Z",
    "creator": {
      "id": "clxsarah123",
      "name": "Sarah Johnson",
      "avatar": "sarah.jpg"
    },
    "participant": {
      "id": "clxsam123",
      "name": "Dr. Sam Smith",
      "avatar": "sam.jpg"
    },
    "messages": []
  }
}
```

**Frontend Action**: 
- Receives `conversation` WebSocket event
- Updates conversation list in real-time
- Adds new conversation to the top of the list
- Shows notification: "Dr. Sam Smith has responded to your message!"
- Updates UI to show conversation card
- Optionally plays notification sound
- Updates notification badge

**What Sarah Sees**: 
- Conversation list is no longer empty
- New conversation with Dr. Sam Smith appears
- Notification badge shows new conversation
- Sarah can click on the conversation to start chatting (covered in Chapter 7)

**What Happens**: Sarah receives real-time notification when a doctor responds (covered in detail in Chapter 7).

---

## ⚠️ Error Handling

### 🚫 Error 1: User Not Authenticated

**Scenario**: Sarah's JWT token is invalid or expired.

**API Response**: `401 Unauthorized`

**Response Body**:
```json
{
  "success": false,
  "message": "User not authenticated"
}
```

**Frontend Action**: 
- Shows error message: "Your session has expired. Please login again."
- Redirects to login page
- Clears stored token

---

### 🚫 Error 2: User ID Not Found

**Scenario**: Backend cannot extract user ID from token.

**API Response**: `400 Bad Request`

**Response Body**:
```json
{
  "success": false,
  "message": "User ID is required"
}
```

**Frontend Action**: 
- Shows error message: "Unable to load conversations. Please try again."
- Optionally redirects to login page
- Logs error for debugging

---

### 🚫 Error 3: Server Error

**Scenario**: Database error or server issue.

**API Response**: `500 Internal Server Error`

**Response Body**:
```json
{
  "success": false,
  "message": "Failed to fetch conversations"
}
```

**Frontend Action**: 
- Shows error message: "Unable to load conversations. Please try again later."
- Shows retry button
- Allows user to retry the request

---

## 📝 API Documentation

### `GET /chat/conversation`

**Description**: Get all conversations for the authenticated user (where user is creator or participant)

**Role**: All authenticated users (patient, doctor, shop_owner, admin)

**Authentication**: Required (JWT token)

**Request Headers**:
```
Authorization: Bearer <your-jwt-token>
```

**Request Body**: None (GET request)

**Query Parameters**: None

**Success Response**: `200 OK`

**Response Body** (Empty - No conversations yet):
```json
{
  "success": true,
  "data": [],
  "count": 0
}
```

**Response Body** (With conversations - covered in Chapter 7):
```json
{
  "success": true,
  "data": [
    {
      "id": "clxconv123",
      "creator_id": "clxsarah123",
      "participant_id": "clxsam123",
      "broadcast_id": "clxbroadcast123",
      "type": "patient_doctor",
      "status": "open",
      "assisted_by": "clxsam123",
      "created_at": "2024-01-01T12:05:00Z",
      "updated_at": "2024-01-01T12:05:00Z",
      "creator": {
        "id": "clxsarah123",
        "name": "Sarah Johnson",
        "avatar": "sarah.jpg",
        "avatar_url": "https://example.com/avatars/sarah.jpg"
      },
      "participant": {
        "id": "clxsam123",
        "name": "Dr. Sam Smith",
        "avatar": "sam.jpg",
        "avatar_url": "https://example.com/avatars/sam.jpg"
      },
      "messages": [
        {
          "id": "clxmsg123",
          "message": "Hello Sarah, I see you have a headache and fever...",
          "message_type": "text",
          "created_at": "2024-01-01T12:05:00Z"
        }
      ]
    }
  ],
  "count": 1
}
```

**Response Fields**:
- `success`: Boolean indicating if request was successful
- `data`: Array of conversations (empty initially)
- `count`: Number of conversations (0 initially)

**Conversation Object Fields**:
- `id`: Conversation ID (unique identifier)
- `creator_id`: ID of the conversation creator
- `participant_id`: ID of the conversation participant
- `broadcast_id`: ID of the broadcast that created this conversation (if applicable)
- `type`: Conversation type (`"patient_doctor"` or `"doctor_shop_owner"`)
- `status`: Conversation status (`"open"`, `"closed"`, `"assisted"`)
- `assisted_by`: ID of the doctor who assisted (if applicable)
- `created_at`: Timestamp when conversation was created
- `updated_at`: Timestamp when conversation was last updated
- `creator`: Creator user information (id, name, avatar, avatar_url)
- `participant`: Participant user information (id, name, avatar, avatar_url)
- `messages`: Array of last message preview (most recent message, if any)

**Error Responses**:
- `400 Bad Request`: User ID is required
- `401 Unauthorized`: User not authenticated (invalid or missing JWT token)
- `500 Internal Server Error`: Server error

**WebSocket Events**:
- `conversation`: Emitted when a new conversation is created (when doctor responds to broadcast)
  - Event data includes full conversation object
  - Patient receives this event in real-time
  - Frontend updates conversation list automatically

**Notes**:
- Returns only conversations where user is creator or participant
- Conversations are filtered server-side (security)
- Returns empty array if no conversations exist
- Conversations are ordered by `updated_at` DESC (most recently updated first)
- Last message preview is included for each conversation
- Avatar URLs are automatically converted to full URLs

---

## 🎨 Frontend Implementation Guide

### Conversation List Page Component (React/TypeScript Example)

```typescript
interface Conversation {
  id: string;
  creator_id: string;
  participant_id: string;
  type: string;
  status: string;
  broadcast_id?: string;
  assisted_by?: string;
  created_at: string;
  updated_at: string;
  creator: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  participant: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  messages: Array<{
    id: string;
    message: string;
    message_type: string;
    created_at: string;
  }>;
}

const ConversationListPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuthContext();
  const router = useRouter();
  const socket = useSocket();

  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Listen for new conversation events
  useEffect(() => {
    if (!socket) return;

    socket.on('conversation', (data: { conversation: Conversation }) => {
      // Add new conversation to list
      setConversations((prev) => [data.conversation, ...prev]);
      
      // Show notification
      toast.info(`${data.conversation.participant.name} has responded to your message!`);
    });

    return () => {
      socket.off('conversation');
    };
  }, [socket]);

  const fetchConversations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat/conversation', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setConversations(data.data || []);
      } else {
        setError(data.message || 'Failed to load conversations');
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Unable to load conversations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConversationClick = (conversationId: string) => {
    router.push(`/chat/conversation/${conversationId}`);
  };

  if (isLoading) {
    return (
      <div className="conversation-list-loading">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="conversation-list-error">
        <p>{error}</p>
        <button onClick={fetchConversations}>Retry</button>
      </div>
    );
  }

  // Empty state
  if (conversations.length === 0) {
    return (
      <div className="conversation-list-empty">
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <h2>No conversations yet</h2>
          <p>A doctor will respond to your message soon.</p>
          <p>You'll receive a notification when a doctor responds.</p>
          <button onClick={() => router.push('/')}>
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  // Conversation list
  return (
    <div className="conversation-list">
      <header>
        <h1>Inbox</h1>
        <button onClick={() => router.push('/')}>
          Send Message
        </button>
      </header>

      <main>
        {conversations.map((conversation) => {
          const otherUser = 
            conversation.creator_id === user?.id
              ? conversation.participant
              : conversation.creator;

          const lastMessage = conversation.messages[0];

          return (
            <div
              key={conversation.id}
              className="conversation-card"
              onClick={() => handleConversationClick(conversation.id)}
            >
              <div className="conversation-avatar">
                <img
                  src={otherUser.avatar_url || '/default-avatar.png'}
                  alt={otherUser.name}
                />
              </div>
              <div className="conversation-info">
                <div className="conversation-header">
                  <h3>{otherUser.name}</h3>
                  <span className="conversation-time">
                    {formatTime(conversation.updated_at)}
                  </span>
                </div>
                <div className="conversation-preview">
                  {lastMessage ? (
                    <p>{lastMessage.message}</p>
                  ) : (
                    <p className="no-message">No messages yet</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
};
```

### WebSocket Event Handling

```typescript
// WebSocket hook for conversation events
const useConversationEvents = () => {
  const socket = useSocket();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (!socket) return;

    // Listen for new conversation
    socket.on('conversation', (data: { conversation: Conversation }) => {
      setConversations((prev) => {
        // Check if conversation already exists
        const exists = prev.find((c) => c.id === data.conversation.id);
        if (exists) {
          // Update existing conversation
          return prev.map((c) =>
            c.id === data.conversation.id ? data.conversation : c
          );
        }
        // Add new conversation to top
        return [data.conversation, ...prev];
      });

      // Show notification
      toast.info(`New conversation with ${data.conversation.participant.name}`);
    });

    // Listen for broadcast updates
    socket.on('broadcast_updated', (data: { broadcast: Broadcast }) => {
      // Update broadcast status if needed
      console.log('Broadcast updated:', data.broadcast);
    });

    return () => {
      socket.off('conversation');
      socket.off('broadcast_updated');
    };
  }, [socket]);

  return { conversations, setConversations };
};
```

---

## ✅ Summary

### What We Learned

1. **Inbox Button**: Patients can click "Inbox" button in navbar to view their conversation list
2. **Empty State**: Conversation list is initially empty until a doctor responds
3. **Server-Side Filtering**: Conversations are filtered server-side (only user's conversations are returned)
4. **Real-Time Updates**: WebSocket events update conversation list in real-time when doctor responds
5. **Chat-First Approach**: No dashboard - conversation list is the primary interface
6. **Security**: Users can only see their own conversations (filtered by creator_id or participant_id)

### Key Takeaways

- ✅ Conversation list is the primary interface for patients (no dashboard)
- ✅ Initially empty until doctor responds to broadcast
- ✅ Server-side filtering ensures users only see their own conversations
- ✅ Real-time WebSocket events update conversation list automatically
- ✅ Empty state provides clear feedback to users
- ✅ WebSocket connection is already established from login

### Next Steps

- **Sarah**: Her inbox is empty, waiting for a doctor to respond (State 4)
- **Doctors**: Will see Sarah's broadcast in their inbox (Chapter 5)
- **Doctors**: Can respond to Sarah's broadcast (Chapter 6)
- **Sarah**: Will receive real-time notification when doctor responds (Chapter 7)

---

## 🎯 Next Chapter

**[Chapter 5: Doctor Broadcast Inbox - Viewing Broadcasts](#chapter-5-doctor-broadcast-inbox---viewing-broadcasts)**

In the next chapter, we'll follow **Sam** (Doctor 1) as he logs in and sees Sarah's broadcast in his inbox. We'll explore how doctors view open broadcasts and prepare to respond to patients.

---

# Chapter 5: Doctor Broadcast Inbox - Viewing Broadcasts

## 📖 Story Context

After **Sarah** created her broadcast, all verified doctors in the system received real-time notifications. Now, **Sam** (Doctor 1) logs in and navigates to his **broadcast inbox** - a dedicated page where he can see all open patient broadcasts. He sees Sarah's broadcast and can respond to help her. Meanwhile, **Parker** (Doctor 2) also logs in and sees the same broadcast, creating a competition scenario where the first doctor to respond gets to assist the patient.

---

## 🎯 State Transition

**State**: `3` (Broadcast created) → `5` (Doctors see broadcast)

---

## 👤 User Journey: Sam Views Broadcast Inbox

### 🎬 Scene 1: Sam Logs In

**User Action**: Sam (Doctor) logs into the platform.

**Frontend Action**: 
- Sam enters his email and password
- Login API is called: `POST /auth/login`
- JWT token is received and stored
- WebSocket connection is established with token

**What Happens**: Sam is authenticated and ready to view broadcasts (covered in Chapter 2).

---

### 🎬 Scene 2: Sam Navigates to Broadcast Inbox

**User Action**: After logging in, Sam is redirected to the **broadcast inbox page** (or clicks "Broadcasts" or "Inbox" button in navbar).

**Frontend Action**: 
- Broadcast inbox page loads
- Shows loading state (spinner or skeleton screen)
- Prepares to fetch open broadcasts from API
- WebSocket connection is already established

**What Sam Sees**: 
- Loading indicator while broadcasts are being fetched
- Navbar with "Broadcasts" or "Inbox" button active
- Optionally: Navigation to conversation list (for doctors' own conversations)

**What Happens**: Frontend initiates the process to load open broadcasts for Sam.

---

### 🎬 Scene 3: Frontend Calls API to Load Open Broadcasts

**Frontend Action**: 
- Frontend extracts user ID from stored JWT token
- Prepares API request with authentication header
- Sends API request to fetch open broadcasts

**API Call**: `GET /chat/broadcast/inbox`

**Request Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body**: None (GET request)

**What Happens**: Frontend requests all open broadcasts that doctors can respond to.

---

### 🎬 Scene 4: Backend Processes Request

**Backend Flow**:

1. **Request Validation**:
   - Validates JWT token from Authorization header
   - Extracts user ID (Sam's ID) from token
   - Verifies user is authenticated

2. **Role Verification**:
   - **Important**: `@Roles(Role.DOCTOR)` guard checks if user is a doctor
   - Verifies that user's `type` is `"doctor"`
   - Returns error if user is not a doctor

3. **Doctor Verification** (Optional - can be added):
   - Verifies that doctor exists and is active
   - **Important**: Verifies that doctor is approved (`approved_at` is not null)
   - Returns error if doctor is not approved

4. **Query Open Broadcasts**:
   - Queries database for broadcasts where:
     - `status = "open"` (only open broadcasts - not yet assisted)
     - `deleted_at IS NULL` (only non-deleted broadcasts)
   - Orders by `created_at DESC` (most recent first)
   - Selects broadcast fields:
     - `id`, `patient_id`, `message`, `status`, `assisted_by`, `conversation_id`, `created_at`, `updated_at`
     - Patient information (id, name, email, avatar)

5. **Process Results**:
   - Returns list of all open broadcasts
   - Currently includes Sarah's broadcast (status: "open")
   - All verified doctors see the same broadcasts

6. **Add Avatar URLs**:
   - Processes avatar URLs for each patient
   - Converts relative paths to full URLs

7. **Response Generation**:
   - Returns success response with list of open broadcasts
   - Includes patient information for each broadcast

**What Happens**: Backend returns all open broadcasts to Sam.

---

### 🎬 Scene 5: Backend Returns Open Broadcasts

**API Response**: `200 OK`

**Response Body**:
```json
{
  "success": true,
  "data": [
    {
      "id": "clxbroadcast123",
      "patient_id": "clxsarah123",
      "message": "I have a severe headache and fever that started this morning. I also feel nauseous and tired.",
      "status": "open",
      "assisted_by": null,
      "conversation_id": null,
      "created_at": "2024-01-01T12:00:00Z",
      "updated_at": "2024-01-01T12:00:00Z",
      "patient": {
        "id": "clxsarah123",
        "name": "Sarah Johnson",
        "email": "sarah@example.com",
        "avatar": "sarah.jpg",
        "avatar_url": "https://example.com/avatars/sarah.jpg"
      }
    }
  ]
}
```

**What Happens**: Backend confirms that Sam can see Sarah's broadcast.

---

### 🎬 Scene 6: Frontend Displays Broadcast Inbox

**Frontend Action**: 
- Receives list of open broadcasts from API
- Hides loading state
- Displays broadcasts in inbox UI

**What Sam Sees**: 
- **Broadcast List**: List of all open patient broadcasts
- **Sarah's Broadcast**: 
  - Patient name: "Sarah Johnson"
  - Patient avatar: Profile picture
  - Message: "I have a severe headache and fever that started this morning. I also feel nauseous and tired."
  - Timestamp: "Just now" or relative time
  - Status: "Open" (waiting for doctor response)
  - "Respond" button: Action button to respond to the broadcast
- **Broadcast Cards**: Each broadcast displayed as a card with patient info and message
- **Real-Time Updates**: Broadcasts update in real-time when status changes

**Broadcast Inbox UI Elements**:
- Header: "Broadcast Inbox" or "Patient Broadcasts"
- Broadcast cards with patient info
- "Respond" button for each broadcast
- Timestamp for each broadcast
- Status indicator (open, assisted, closed)
- Optionally: Filter or search functionality

**What Happens**: Sam sees Sarah's broadcast and can respond to it.

---

### 🎬 Scene 7: Sam Views Broadcast Details

**User Action**: Sam clicks on Sarah's broadcast card to view more details.

**Frontend Action**: 
- Shows broadcast details modal or page
- Optionally calls API: `GET /chat/broadcast/:id` (to get full broadcast details)
- Displays full message and patient information

**API Call**: `GET /chat/broadcast/:id`

**Request Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response Body**:
```json
{
  "success": true,
  "data": {
    "id": "clxbroadcast123",
    "patient_id": "clxsarah123",
    "message": "I have a severe headache and fever that started this morning. I also feel nauseous and tired.",
    "status": "open",
    "assisted_by": null,
    "conversation_id": null,
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z",
    "patient": {
      "id": "clxsarah123",
      "name": "Sarah Johnson",
      "email": "sarah@example.com",
      "avatar_url": "https://example.com/avatars/sarah.jpg"
    }
  }
}
```

**What Sam Sees**: 
- Full broadcast message
- Patient information (name, avatar)
- Broadcast status (open)
- "Respond" button to start conversation with patient

**What Happens**: Sam has all the information he needs to respond to Sarah's broadcast.

---

### 🎬 Scene 8: WebSocket Connection Setup

**Frontend Action**: 
- WebSocket connection is already established from login (Chapter 2)
- Frontend listens for WebSocket events on broadcast inbox page
- Sets up event listeners for:
  - `new_broadcast` event (new broadcast notification)
  - `broadcast_updated` event (broadcast status updates)
  - `broadcast_assisted` event (broadcast assisted notification)

**WebSocket Events to Listen For**:
- `new_broadcast`: Emitted when a new broadcast is created (when patient sends message)
- `broadcast_updated`: Emitted when broadcast status changes (when another doctor responds)
- `broadcast_assisted`: Emitted when a broadcast is assisted (when doctor responds)

**What Happens**: Frontend is ready to receive real-time notifications about broadcasts.

---

### 🎬 Scene 9: Real-Time Notification Setup

**Frontend Action**: 
- Frontend sets up WebSocket event handlers
- Listens for `new_broadcast` event (will be received when new patient sends message)
- Listens for `broadcast_updated` event (will be received when broadcast status changes)
- When events are received:
  - Updates broadcast list in real-time
  - Shows notification badge
  - Optionally plays notification sound
  - Optionally shows toast notification

**WebSocket Event Handler**:
```typescript
socket.on('new_broadcast', (data: { broadcast: Broadcast }) => {
  // Add new broadcast to list
  setBroadcasts((prev) => [data.broadcast, ...prev]);
  
  // Show notification
  toast.info(`New broadcast from ${data.broadcast.patient.name}`);
});

socket.on('broadcast_updated', (data: { broadcast: Broadcast }) => {
  // Update broadcast status in list
  setBroadcasts((prev) =>
    prev.map((b) =>
      b.id === data.broadcast.id ? data.broadcast : b
    )
  );
  
  // If broadcast is now "assisted", remove from open list or show "Already assisted" badge
  if (data.broadcast.status === 'assisted') {
    toast.info(`Broadcast from ${data.broadcast.patient.name} has been assisted by another doctor`);
  }
});
```

**What Happens**: Frontend is ready to update the broadcast list in real-time.

---

### 🎬 Scene 10: Next Steps

**State**: `5` (Doctors see broadcast)

**What Happens Next**: 
- Sam sees Sarah's broadcast in his inbox
- Sam can click "Respond" button to respond to the broadcast (covered in Chapter 6)
- When Sam responds, the broadcast status will change to "assisted"
- Other doctors (like Parker) will see the broadcast status update in real-time
- Only one doctor can respond to a broadcast (first come, first served)

**Next Chapter**: [Chapter 6: Doctor Responds - Broadcast to Conversation](#chapter-6-doctor-responds---broadcast-to-conversation)

---

## 🔄 Alternative Flows

### 🎬 Scene 11: Parker Also Sees Sarah's Broadcast

**User Action**: Parker (Doctor 2) logs in and navigates to broadcast inbox.

**Frontend Action**: 
- Same as Sam's flow
- Parker also sees Sarah's broadcast in his inbox
- Parker sees the same broadcast that Sam sees

**API Call**: `GET /chat/broadcast/inbox`

**Response Body**: Same as Sam's response (both doctors see the same broadcasts)

**What Parker Sees**: 
- Sarah's broadcast in his inbox
- Same message and patient information
- "Respond" button to respond to the broadcast

**What Happens**: 
- Both Sam and Parker can see Sarah's broadcast
- Both can click "Respond" button
- **Important**: Only the first doctor to respond will succeed (race condition protection)
- The second doctor will see an error: "This broadcast has already been assisted by another doctor"

**Note**: This creates a competition scenario where doctors compete to respond first.

---

### 🎬 Scene 12: Real-Time Update When Another Doctor Responds

**User Action**: Parker is viewing the broadcast inbox, and Sam responds to Sarah's broadcast.

**WebSocket Event**: `broadcast_updated`

**Event Data** (received by Parker):
```json
{
  "broadcast": {
    "id": "clxbroadcast123",
    "patient_id": "clxsarah123",
    "message": "I have a severe headache and fever...",
    "status": "assisted",
    "assisted_by": "clxsam123",
    "conversation_id": "clxconv123",
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:05:00Z",
    "patient": {
      "id": "clxsarah123",
      "name": "Sarah Johnson",
      "avatar_url": "https://example.com/avatars/sarah.jpg"
    }
  }
}
```

**Frontend Action**: 
- Receives `broadcast_updated` WebSocket event
- Updates broadcast status in list to "assisted"
- Shows "Already assisted" badge or removes from open broadcasts list
- Disables "Respond" button
- Shows notification: "This broadcast has been assisted by another doctor"
- Optionally: Shows which doctor assisted (if permitted)

**What Parker Sees**: 
- Broadcast status changes to "assisted"
- "Respond" button is disabled or removed
- Notification that another doctor has responded
- Broadcast is removed from open broadcasts list (or marked as "assisted")

**What Happens**: Parker knows that another doctor has already responded to Sarah's broadcast.

---

### 🎬 Scene 13: No Open Broadcasts

**User Action**: Sam logs in, but there are no open broadcasts in the system.

**API Call**: `GET /chat/broadcast/inbox`

**Response Body**:
```json
{
  "success": true,
  "data": []
}
```

**Frontend Action**: 
- Receives empty array from API
- Displays empty state UI

**What Sam Sees**: 
- **Empty State Message**: "No open broadcasts at the moment. Patients' messages will appear here when they need help."
- **Empty State Illustration**: Optional illustration or icon
- **Waiting State**: Clear message that broadcasts will appear when patients send messages

**What Happens**: Sam sees that there are no open broadcasts currently.

---

## ⚠️ Error Handling

### 🚫 Error 1: User Not a Doctor

**Scenario**: Someone tries to access the broadcast inbox but their user type is not "doctor".

**API Response**: `403 Forbidden`

**Response Body**:
```json
{
  "success": false,
  "message": "You do not have permission to access this resource. Required role: doctor. Your role: patient"
}
```

**Frontend Action**: 
- Shows error message: "Only doctors can view broadcasts. Please login with a doctor account."
- Prevents access to broadcast inbox
- Optionally redirects to appropriate page based on user type

---

### 🚫 Error 2: Doctor Not Approved

**Scenario**: Sam tries to access the broadcast inbox but his account is not approved yet.

**Backend Flow**: 
- **Note**: The current implementation doesn't explicitly check `approved_at` in the service
- However, the `@Roles(Role.DOCTOR)` guard ensures only doctors can access
- **Recommended**: Add check for `approved_at` in the service or guard

**API Response**: `403 Forbidden` (if check is added)

**Response Body**:
```json
{
  "success": false,
  "message": "Your doctor account is not verified. Please wait for admin approval."
}
```

**Frontend Action**: 
- Shows error message: "Your account is pending admin approval. Please wait for approval to view broadcasts."
- Prevents access to broadcast inbox
- Shows "Pending Approval" status

---

### 🚫 Error 3: Unauthorized Access

**Scenario**: Sam's JWT token is invalid or expired.

**API Response**: `401 Unauthorized`

**Response Body**:
```json
{
  "success": false,
  "message": "User not authenticated"
}
```

**Frontend Action**: 
- Shows error message: "Your session has expired. Please login again."
- Redirects to login page
- Clears stored token

---

### 🚫 Error 4: Server Error

**Scenario**: Database error or server issue.

**API Response**: `500 Internal Server Error`

**Response Body**:
```json
{
  "success": false,
  "message": "Failed to fetch broadcasts"
}
```

**Frontend Action**: 
- Shows error message: "Unable to load broadcasts. Please try again later."
- Shows retry button
- Allows user to retry the request

---

## 📝 API Documentation

### `GET /chat/broadcast/inbox`

**Description**: Get all open broadcasts that doctors can respond to

**Role**: `doctor` (only doctors can access this endpoint)

**Authentication**: Required (JWT token)

**Request Headers**:
```
Authorization: Bearer <your-jwt-token>
```

**Request Body**: None (GET request)

**Query Parameters**: None

**Success Response**: `200 OK`

**Response Body**:
```json
{
  "success": true,
  "data": [
    {
      "id": "clxbroadcast123",
      "patient_id": "clxsarah123",
      "message": "I have a severe headache and fever that started this morning. I also feel nauseous and tired.",
      "status": "open",
      "assisted_by": null,
      "conversation_id": null,
      "created_at": "2024-01-01T12:00:00Z",
      "updated_at": "2024-01-01T12:00:00Z",
      "patient": {
        "id": "clxsarah123",
        "name": "Sarah Johnson",
        "email": "sarah@example.com",
        "avatar": "sarah.jpg",
        "avatar_url": "https://example.com/avatars/sarah.jpg"
      }
    }
  ]
}
```

**Response Fields**:
- `success`: Boolean indicating if request was successful
- `data`: Array of open broadcasts

**Broadcast Object Fields**:
- `id`: Broadcast ID (unique identifier)
- `patient_id`: ID of the patient who created the broadcast
- `message`: The broadcast message content
- `status`: Broadcast status (`"open"` initially, changes to `"assisted"` when doctor responds)
- `assisted_by`: ID of the doctor who responded (null until doctor responds)
- `conversation_id`: ID of the conversation created when doctor responds (null until doctor responds)
- `created_at`: Timestamp when broadcast was created
- `updated_at`: Timestamp when broadcast was last updated
- `patient`: Patient information (id, name, email, avatar, avatar_url)

**Error Responses**:
- `401 Unauthorized`: User not authenticated (invalid or missing JWT token)
- `403 Forbidden`: User is not a doctor (only doctors can view broadcasts)
- `500 Internal Server Error`: Server error

**WebSocket Events**:
- `new_broadcast`: Emitted to all doctors when a new broadcast is created
  - Event data includes full broadcast object with patient information
  - All doctors receive this event in real-time
- `broadcast_updated`: Emitted to all doctors when broadcast status changes
  - Event data includes updated broadcast object
  - All doctors receive this event in real-time
  - Broadcast status changes to "assisted" when a doctor responds

**Notes**:
- Only returns broadcasts with `status = "open"` (not yet assisted)
- All verified doctors see the same open broadcasts
- Broadcasts are ordered by `created_at` DESC (most recent first)
- Only deleted broadcasts are excluded (`deleted_at IS NULL`)
- Avatar URLs are automatically converted to full URLs
- **Important**: Only the first doctor to respond will succeed (race condition protection)

---

### `GET /chat/broadcast/:id`

**Description**: Get a single broadcast by ID (for viewing broadcast details)

**Role**: `patient`, `doctor`, `admin`

**Authentication**: Required (JWT token)

**Request Headers**:
```
Authorization: Bearer <your-jwt-token>
```

**Request Body**: None (GET request)

**URL Parameters**:
- `id`: Broadcast ID

**Success Response**: `200 OK`

**Response Body**:
```json
{
  "success": true,
  "data": {
    "id": "clxbroadcast123",
    "patient_id": "clxsarah123",
    "message": "I have a severe headache and fever that started this morning. I also feel nauseous and tired.",
    "status": "open",
    "assisted_by": null,
    "conversation_id": null,
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z",
    "patient": {
      "id": "clxsarah123",
      "name": "Sarah Johnson",
      "email": "sarah@example.com",
      "avatar_url": "https://example.com/avatars/sarah.jpg"
    }
  }
}
```

**Error Responses**:
- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: User is not authorized to view this broadcast (patients can only view their own broadcasts)
- `404 Not Found`: Broadcast not found
- `500 Internal Server Error`: Server error

**Notes**:
- Patients can only view their own broadcasts
- Doctors can view any broadcast
- Admin can view any broadcast

---

## 🎨 Frontend Implementation Guide

### Broadcast Inbox Page Component (React/TypeScript Example)

```typescript
interface Broadcast {
  id: string;
  patient_id: string;
  message: string;
  status: string;
  assisted_by?: string;
  conversation_id?: string;
  created_at: string;
  updated_at: string;
  patient: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
  };
}

const BroadcastInboxPage = () => {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuthContext();
  const router = useRouter();
  const socket = useSocket();

  // Fetch broadcasts on component mount
  useEffect(() => {
    fetchBroadcasts();
  }, []);

  // Listen for new broadcast events
  useEffect(() => {
    if (!socket) return;

    // Listen for new broadcasts
    socket.on('new_broadcast', (data: { broadcast: Broadcast }) => {
      // Add new broadcast to list
      setBroadcasts((prev) => [data.broadcast, ...prev]);
      
      // Show notification
      toast.info(`New broadcast from ${data.broadcast.patient.name}`);
    });

    // Listen for broadcast updates
    socket.on('broadcast_updated', (data: { broadcast: Broadcast }) => {
      // Update broadcast status in list
      setBroadcasts((prev) =>
        prev.map((b) =>
          b.id === data.broadcast.id ? data.broadcast : b
        )
      );

      // If broadcast is now "assisted", show notification
      if (data.broadcast.status === 'assisted') {
        toast.info(`Broadcast from ${data.broadcast.patient.name} has been assisted by another doctor`);
      }
    });

    return () => {
      socket.off('new_broadcast');
      socket.off('broadcast_updated');
    };
  }, [socket]);

  const fetchBroadcasts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat/broadcast/inbox', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setBroadcasts(data.data || []);
      } else {
        setError(data.message || 'Failed to load broadcasts');
      }
    } catch (error) {
      console.error('Error fetching broadcasts:', error);
      setError('Unable to load broadcasts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRespond = (broadcastId: string) => {
    router.push(`/chat/conversation/broadcast/${broadcastId}/respond`);
  };

  const handleViewDetails = async (broadcastId: string) => {
    try {
      const response = await fetch(`/api/chat/broadcast/${broadcastId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        // Show broadcast details modal or page
        console.log('Broadcast details:', data.data);
      }
    } catch (error) {
      console.error('Error fetching broadcast details:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="broadcast-inbox-loading">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="broadcast-inbox-error">
        <p>{error}</p>
        <button onClick={fetchBroadcasts}>Retry</button>
      </div>
    );
  }

  // Empty state
  if (broadcasts.length === 0) {
    return (
      <div className="broadcast-inbox-empty">
        <div className="empty-state">
          <div className="empty-icon">📬</div>
          <h2>No open broadcasts</h2>
          <p>Patients' messages will appear here when they need help.</p>
          <p>You'll receive a notification when a new broadcast is created.</p>
        </div>
      </div>
    );
  }

  // Broadcast list
  return (
    <div className="broadcast-inbox">
      <header>
        <h1>Broadcast Inbox</h1>
        <p>View and respond to patient broadcasts</p>
      </header>

      <main>
        {broadcasts.map((broadcast) => (
          <div key={broadcast.id} className="broadcast-card">
            <div className="broadcast-header">
              <div className="broadcast-avatar">
                <img
                  src={broadcast.patient.avatar_url || '/default-avatar.png'}
                  alt={broadcast.patient.name}
                />
              </div>
              <div className="broadcast-info">
                <h3>{broadcast.patient.name}</h3>
                <span className="broadcast-time">
                  {formatTime(broadcast.created_at)}
                </span>
              </div>
            </div>
            <div className="broadcast-message">
              <p>{broadcast.message}</p>
            </div>
            <div className="broadcast-actions">
              <button
                onClick={() => handleViewDetails(broadcast.id)}
                className="btn-secondary"
              >
                View Details
              </button>
              <button
                onClick={() => handleRespond(broadcast.id)}
                className="btn-primary"
                disabled={broadcast.status !== 'open'}
              >
                {broadcast.status === 'open' ? 'Respond' : 'Already Assisted'}
              </button>
            </div>
            {broadcast.status === 'assisted' && (
              <div className="broadcast-status">
                <span className="status-badge">Assisted</span>
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
};
```

### WebSocket Event Handling

```typescript
// WebSocket hook for broadcast events
const useBroadcastEvents = () => {
  const socket = useSocket();
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);

  useEffect(() => {
    if (!socket) return;

    // Listen for new broadcasts
    socket.on('new_broadcast', (data: { broadcast: Broadcast }) => {
      setBroadcasts((prev) => {
        // Check if broadcast already exists
        const exists = prev.find((b) => b.id === data.broadcast.id);
        if (exists) {
          return prev;
        }
        // Add new broadcast to top
        return [data.broadcast, ...prev];
      });

      // Show notification
      toast.info(`New broadcast from ${data.broadcast.patient.name}`);
    });

    // Listen for broadcast updates
    socket.on('broadcast_updated', (data: { broadcast: Broadcast }) => {
      setBroadcasts((prev) =>
        prev.map((b) =>
          b.id === data.broadcast.id ? data.broadcast : b
        )
      );

      // If broadcast is now "assisted", show notification
      if (data.broadcast.status === 'assisted') {
        toast.info(`Broadcast from ${data.broadcast.patient.name} has been assisted`);
      }
    });

    return () => {
      socket.off('new_broadcast');
      socket.off('broadcast_updated');
    };
  }, [socket]);

  return { broadcasts, setBroadcasts };
};
```

---

## ✅ Summary

### What We Learned

1. **Broadcast Inbox**: Doctors have a dedicated broadcast inbox page to view open patient broadcasts
2. **Open Broadcasts**: Only broadcasts with status `"open"` are shown to doctors
3. **Real-Time Updates**: All doctors receive WebSocket events when new broadcasts are created or updated
4. **Competition Scenario**: Multiple doctors can see the same broadcast, but only the first to respond succeeds
5. **No Dashboard**: Doctors don't have a dashboard - just broadcast inbox and conversation list
6. **Role-Based Access**: Only doctors can access the broadcast inbox endpoint

### Key Takeaways

- ✅ Broadcast inbox is the primary interface for doctors (no dashboard)
- ✅ All verified doctors see the same open broadcasts
- ✅ Real-time WebSocket events update broadcast list automatically
- ✅ Only the first doctor to respond succeeds (race condition protection)
- ✅ Broadcast status updates in real-time when a doctor responds
- ✅ Doctors can view broadcast details before responding

### Next Steps

- **Sam**: Sees Sarah's broadcast and can respond (State 5)
- **Parker**: Also sees Sarah's broadcast and can respond (State 5)
- **Sam**: Will respond to Sarah's broadcast (Chapter 6)
- **Parker**: Will try to respond but will be too late (Chapter 6)

---

## 🎯 Next Chapter

**[Chapter 6: Doctor Responds - Broadcast to Conversation](#chapter-6-doctor-responds---broadcast-to-conversation)**

In the next chapter, we'll follow **Sam** as he responds to Sarah's broadcast. This will create a private conversation between Sam and Sarah, update the broadcast status to "assisted", and notify all other doctors that the broadcast has been taken. We'll also see what happens when **Parker** tries to respond but is too late.

---

# Chapter 6: Doctor Responds - Broadcast to Conversation

## 📖 Story Context

**Sam** (Doctor 1) sees Sarah's broadcast in his inbox and decides to help her. He clicks the **"Respond"** button, which creates a private conversation between Sam and Sarah. The broadcast status immediately changes to "assisted", and all other doctors (including **Parker**) receive real-time notifications that the broadcast has been taken. Meanwhile, **Sarah** receives a notification that a doctor has responded to her message. When **Parker** tries to respond moments later, he gets an error message: "This broadcast has already been assisted by another doctor."

---

## 🎯 State Transition

**State**: `5` (Doctors see broadcast) → `6` (Conversation created, broadcast assisted)

---

## 👤 User Journey: Sam Responds to Sarah's Broadcast

### 🎬 Scene 1: Sam Clicks "Respond" Button

**User Action**: Sam clicks the "Respond" button on Sarah's broadcast card in the broadcast inbox.

**Frontend Action**: 
- Validates that broadcast status is "open"
- Shows confirmation dialog (optional): "Are you sure you want to respond to this broadcast?"
- Prepares API request with broadcast ID
- Sends API request to respond to broadcast

**What Sam Sees**: 
- "Respond" button on Sarah's broadcast card
- Optional: Confirmation dialog before responding
- Loading state while request is being processed

**What Happens**: Frontend initiates the process to create a conversation from the broadcast.

---

### 🎬 Scene 2: Frontend Calls API to Respond to Broadcast

**Frontend Action**: 
- Frontend extracts doctor ID (Sam's ID) from stored JWT token
- Prepares API request with authentication header
- Sends API request to respond to broadcast

**API Call**: `POST /chat/conversation/broadcast/:broadcastId/respond`

**Request Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body**: None (POST request with broadcast ID in URL)

**URL Parameters**:
- `broadcastId`: The ID of the broadcast (e.g., `clxbroadcast123`)

**What Happens**: Frontend requests the backend to create a conversation from the broadcast.

---

### 🎬 Scene 3: Backend Processes Request - Validation

**Backend Flow**:

1. **Request Validation**:
   - Validates JWT token from Authorization header
   - Extracts user ID (Sam's ID) from token
   - Verifies user is authenticated

2. **Role Verification**:
   - **Important**: `@Roles(Role.DOCTOR)` guard checks if user is a doctor
   - Verifies that user's `type` is `"doctor"`
   - Returns error if user is not a doctor

3. **Doctor Verification**:
   - Verifies that doctor exists and is active
   - **Important**: Verifies that doctor is approved (`approved_at` is not null)
   - Returns error if doctor is not approved

4. **Broadcast Validation**:
   - Queries database for broadcast by ID
   - Verifies that broadcast exists
   - Verifies that broadcast status is `"open"` (not yet assisted)
   - Verifies that broadcast is not deleted (`deleted_at IS NULL`)
   - Returns error if broadcast is already assisted or not found

5. **Patient Validation**:
   - Verifies that patient exists and is active
   - Verifies that patient's `type` is `"patient"`

**What Happens**: Backend validates that Sam can respond to Sarah's broadcast.

---

### 🎬 Scene 4: Backend Creates Conversation

**Backend Flow**:

1. **Check for Existing Conversation**:
   - Checks if broadcast already has a `conversation_id`
   - If conversation exists, returns existing conversation (prevents duplicate conversations)

2. **Create Conversation**:
   - Creates new conversation with:
     - `creator_id`: `broadcast.patient_id` (Sarah's ID)
     - `participant_id`: `doctorId` (Sam's ID)
     - `broadcast_id`: `broadcastId` (links conversation to broadcast)
     - `type`: `"patient_doctor"` (conversation type)
     - `status`: `"open"` (conversation status)
     - `assisted_by`: `doctorId` (Sam's ID - doctor who responded)
   - Conversation is created in database

3. **Query Conversation Details**:
   - Queries conversation with:
     - Creator information (id, name, avatar)
     - Participant information (id, name, avatar)
     - Broadcast ID and type
     - Status and timestamps

4. **Add Avatar URLs**:
   - Processes avatar URLs for creator and participant
   - Converts relative paths to full URLs

**What Happens**: Backend creates a private conversation between Sam and Sarah.

---

### 🎬 Scene 5: Backend Updates Broadcast Status

**Backend Flow**:

1. **Update Broadcast**:
   - Updates broadcast with:
     - `status`: `"assisted"` (broadcast is now assisted)
     - `assisted_by`: `doctorId` (Sam's ID)
     - `conversation_id`: `conversation.id` (links broadcast to conversation)
     - `updated_at`: Current timestamp
   - **Race Condition Protection**: Checks if broadcast is already assisted by another doctor
   - If already assisted, throws error: "This broadcast has already been assisted by another doctor"

2. **Query Updated Broadcast**:
   - Queries updated broadcast with patient information
   - Includes avatar URLs

**What Happens**: Backend updates the broadcast status to "assisted" and links it to the conversation.

---

### 🎬 Scene 6: Backend Emits WebSocket Events

**Backend Flow**:

1. **Emit `conversation` Event to Sarah (Patient)**:
   - Emits `conversation` event to Sarah's socket (if online)
   - Event data includes full conversation object
   - Sarah receives real-time notification that a doctor has responded

2. **Emit `conversation` Event to Sam (Doctor)**:
   - Emits `conversation` event to Sam's socket (if online)
   - Event data includes full conversation object
   - Sam receives real-time notification that conversation is created

3. **Emit `broadcast_assisted` Event to All Doctors**:
   - Emits `broadcast_assisted` event to all verified doctors
   - Event data includes broadcast ID and conversation object
   - All doctors receive real-time notification that broadcast has been assisted

4. **Emit `broadcast_updated` Event to All Doctors**:
   - Emits `broadcast_updated` event to all verified doctors
   - Event data includes updated broadcast object
   - All doctors receive real-time notification that broadcast status has changed

5. **Emit `broadcast_updated` Event to Sarah (Patient)**:
   - Emits `broadcast_updated` event to Sarah's socket (if online)
   - Event data includes updated broadcast object
   - Sarah receives real-time notification that broadcast status has changed

**What Happens**: All relevant users receive real-time notifications about the conversation creation and broadcast status update.

---

### 🎬 Scene 7: Backend Returns Success Response

**API Response**: `200 OK`

**Response Body**:
```json
{
  "success": true,
  "message": "Conversation created successfully",
  "data": {
    "id": "clxconv123",
    "creator_id": "clxsarah123",
    "participant_id": "clxsam123",
    "broadcast_id": "clxbroadcast123",
    "type": "patient_doctor",
    "status": "open",
    "assisted_by": "clxsam123",
    "created_at": "2024-01-01T12:05:00Z",
    "updated_at": "2024-01-01T12:05:00Z",
    "creator": {
      "id": "clxsarah123",
      "name": "Sarah Johnson",
      "avatar": "sarah.jpg",
      "avatar_url": "https://example.com/avatars/sarah.jpg"
    },
    "participant": {
      "id": "clxsam123",
      "name": "Dr. Sam Smith",
      "avatar": "sam.jpg",
      "avatar_url": "https://example.com/avatars/sam.jpg"
    },
    "messages": []
  }
}
```

**What Happens**: Backend confirms that conversation has been created successfully.

---

### 🎬 Scene 8: Frontend Handles Success Response

**Frontend Action**: 
- Receives success response from API
- Updates broadcast list (removes broadcast from open list or marks as "assisted")
- Shows success message: "You have successfully responded to the broadcast"
- Redirects to conversation page: `/chat/conversation/clxconv123`
- Optionally: Shows notification badge for new conversation

**What Sam Sees**: 
- Success message: "You have successfully responded to the broadcast"
- Redirected to conversation page with Sarah
- Conversation page shows empty message list (no messages yet)
- Ready to send first message to Sarah

**What Happens**: Sam is redirected to the conversation page and can start chatting with Sarah.

---

### 🎬 Scene 9: Real-Time Notification to Sarah

**WebSocket Event**: `conversation`

**Event Data** (received by Sarah):
```json
{
  "from": "clxsarah123",
  "data": {
    "id": "clxconv123",
    "creator_id": "clxsarah123",
    "participant_id": "clxsam123",
    "broadcast_id": "clxbroadcast123",
    "type": "patient_doctor",
    "status": "open",
    "assisted_by": "clxsam123",
    "created_at": "2024-01-01T12:05:00Z",
    "updated_at": "2024-01-01T12:05:00Z",
    "creator": {
      "id": "clxsarah123",
      "name": "Sarah Johnson",
      "avatar_url": "https://example.com/avatars/sarah.jpg"
    },
    "participant": {
      "id": "clxsam123",
      "name": "Dr. Sam Smith",
      "avatar_url": "https://example.com/avatars/sam.jpg"
    },
    "messages": []
  }
}
```

**Frontend Action** (Sarah's side): 
- Receives `conversation` WebSocket event
- Updates conversation list in real-time
- Adds new conversation to the top of the list
- Shows notification: "Dr. Sam Smith has responded to your message!"
- Updates notification badge
- Optionally: Plays notification sound
- Optionally: Shows toast notification

**What Sarah Sees**: 
- Conversation list is no longer empty
- New conversation with Dr. Sam Smith appears
- Notification badge shows new conversation
- Sarah can click on the conversation to start chatting (covered in Chapter 7)

**What Happens**: Sarah receives real-time notification that a doctor has responded to her broadcast.

---

### 🎬 Scene 10: Real-Time Notification to Other Doctors

**WebSocket Event**: `broadcast_updated`

**Event Data** (received by Parker and other doctors):
```json
{
  "broadcast": {
    "id": "clxbroadcast123",
    "patient_id": "clxsarah123",
    "message": "I have a severe headache and fever...",
    "status": "assisted",
    "assisted_by": "clxsam123",
    "conversation_id": "clxconv123",
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:05:00Z",
    "patient": {
      "id": "clxsarah123",
      "name": "Sarah Johnson",
      "avatar_url": "https://example.com/avatars/sarah.jpg"
    }
  }
}
```

**Frontend Action** (Parker's side): 
- Receives `broadcast_updated` WebSocket event
- Updates broadcast status in list to "assisted"
- Shows "Already assisted" badge or removes from open broadcasts list
- Disables "Respond" button
- Shows notification: "This broadcast has been assisted by another doctor"
- Optionally: Shows which doctor assisted (if permitted)

**What Parker Sees**: 
- Broadcast status changes to "assisted"
- "Respond" button is disabled or removed
- Notification that another doctor has responded
- Broadcast is removed from open broadcasts list (or marked as "assisted")

**What Happens**: Parker knows that another doctor has already responded to Sarah's broadcast.

---

### 🎬 Scene 11: Next Steps

**State**: `6` (Conversation created, broadcast assisted)

**What Happens Next**: 
- Sam is redirected to conversation page with Sarah
- Sarah receives real-time notification and sees conversation in her inbox
- Other doctors (like Parker) see that broadcast has been assisted
- Sam and Sarah can start chatting (covered in Chapter 8)
- Only one doctor can respond to a broadcast (first come, first served)

**Next Chapter**: [Chapter 7: Conversation List - Conversation List UI and Conversation Detail Page](#chapter-7-conversation-list---conversation-list-ui-and-conversation-detail-page)

---

## 🔄 Alternative Flows

### 🎬 Scene 12: Parker Tries to Respond (Too Late)

**User Action**: Parker clicks the "Respond" button on Sarah's broadcast, but Sam has already responded.

**Frontend Action**: 
- Parker clicks "Respond" button
- Frontend sends API request: `POST /chat/conversation/broadcast/:broadcastId/respond`

**API Call**: `POST /chat/conversation/broadcast/clxbroadcast123/respond`

**Backend Flow**:
1. Validates JWT token and doctor role
2. Queries broadcast from database
3. Checks broadcast status: `status = "assisted"` (already assisted)
4. Throws error: `409 Conflict`

**API Response**: `409 Conflict`

**Response Body**:
```json
{
  "success": false,
  "message": "This broadcast has already been assisted by another doctor"
}
```

**Frontend Action**: 
- Receives error response
- Shows error message: "This broadcast has already been assisted by another doctor"
- Disables "Respond" button
- Updates broadcast status to "assisted" in UI
- Optionally: Shows which doctor assisted (if permitted)

**What Parker Sees**: 
- Error message: "This broadcast has already been assisted by another doctor"
- "Respond" button is disabled
- Broadcast status shows "Assisted"
- Notification that another doctor has responded

**What Happens**: Parker cannot respond because the broadcast has already been assisted by Sam.

---

### 🎬 Scene 13: Race Condition Protection

**User Action**: Sam and Parker both click "Respond" button at the exact same time (simultaneous requests).

**Backend Flow**:
1. **Sam's Request**:
   - Queries broadcast: `status = "open"`
   - Creates conversation
   - Updates broadcast: `status = "assisted"`, `assisted_by = "clxsam123"`

2. **Parker's Request** (arrives milliseconds later):
   - Queries broadcast: `status = "open"` (before Sam's update completes)
   - Tries to create conversation
   - Tries to update broadcast: `status = "assisted"`, `assisted_by = "clxparker123"`
   - **Race Condition Protection**: Checks if broadcast is already assisted
   - Sees: `status = "assisted"`, `assisted_by = "clxsam123"` (different doctor)
   - Throws error: `409 Conflict`

**API Response** (Parker's request): `409 Conflict`

**Response Body**:
```json
{
  "success": false,
  "message": "This broadcast has already been assisted by another doctor"
}
```

**What Happens**: Race condition protection ensures only one doctor can respond, even if multiple doctors try simultaneously.

---

### 🎬 Scene 14: Conversation Already Exists

**User Action**: Sam tries to respond to a broadcast that already has a conversation.

**Backend Flow**:
1. Queries broadcast from database
2. Checks if broadcast has `conversation_id` (conversation already exists)
3. Queries existing conversation
4. Returns existing conversation (prevents duplicate conversations)

**API Response**: `200 OK`

**Response Body**:
```json
{
  "success": false,
  "message": "Conversation already exists for this broadcast",
  "data": {
    "id": "clxconv123",
    "creator_id": "clxsarah123",
    "participant_id": "clxsam123",
    "broadcast_id": "clxbroadcast123",
    "type": "patient_doctor",
    "status": "open",
    "assisted_by": "clxsam123",
    "created_at": "2024-01-01T12:05:00Z",
    "updated_at": "2024-01-01T12:05:00Z",
    "creator": {
      "id": "clxsarah123",
      "name": "Sarah Johnson",
      "avatar_url": "https://example.com/avatars/sarah.jpg"
    },
    "participant": {
      "id": "clxsam123",
      "name": "Dr. Sam Smith",
      "avatar_url": "https://example.com/avatars/sam.jpg"
    },
    "messages": []
  }
}
```

**Frontend Action**: 
- Receives existing conversation
- Redirects to existing conversation page
- Shows message: "Conversation already exists"

**What Happens**: Sam is redirected to the existing conversation instead of creating a duplicate.

---

## ⚠️ Error Handling

### 🚫 Error 1: Broadcast Not Found

**Scenario**: Sam tries to respond to a broadcast that doesn't exist.

**API Response**: `404 Not Found`

**Response Body**:
```json
{
  "success": false,
  "message": "Broadcast not found"
}
```

**Frontend Action**: 
- Shows error message: "Broadcast not found. It may have been deleted."
- Removes broadcast from list
- Redirects to broadcast inbox

---

### 🚫 Error 2: Broadcast Already Assisted

**Scenario**: Sam tries to respond to a broadcast that has already been assisted.

**API Response**: `409 Conflict`

**Response Body**:
```json
{
  "success": false,
  "message": "This broadcast has already been assisted by another doctor"
}
```

**Frontend Action**: 
- Shows error message: "This broadcast has already been assisted by another doctor"
- Disables "Respond" button
- Updates broadcast status to "assisted" in UI
- Optionally: Shows which doctor assisted

---

### 🚫 Error 3: Doctor Not Approved

**Scenario**: Sam tries to respond but his account is not approved yet.

**API Response**: `403 Forbidden`

**Response Body**:
```json
{
  "success": false,
  "message": "Doctor account is not verified. Please wait for admin approval."
}
```

**Frontend Action**: 
- Shows error message: "Your account is pending admin approval. Please wait for approval to respond to broadcasts."
- Prevents response to broadcast
- Shows "Pending Approval" status

---

### 🚫 Error 4: User Not a Doctor

**Scenario**: Someone tries to respond to a broadcast but their user type is not "doctor".

**API Response**: `403 Forbidden`

**Response Body**:
```json
{
  "success": false,
  "message": "Only doctors can respond to broadcasts"
}
```

**Frontend Action**: 
- Shows error message: "Only doctors can respond to broadcasts."
- Prevents response to broadcast
- Redirects to appropriate page based on user type

---

### 🚫 Error 5: Unauthorized Access

**Scenario**: Sam's JWT token is invalid or expired.

**API Response**: `401 Unauthorized`

**Response Body**:
```json
{
  "success": false,
  "message": "User not authenticated"
}
```

**Frontend Action**: 
- Shows error message: "Your session has expired. Please login again."
- Redirects to login page
- Clears stored token

---

## 📝 API Documentation

### `POST /chat/conversation/broadcast/:broadcastId/respond`

**Description**: Doctor responds to a patient broadcast, creating a private conversation

**Role**: `doctor` (only doctors can access this endpoint)

**Authentication**: Required (JWT token)

**Request Headers**:
```
Authorization: Bearer <your-jwt-token>
```

**Request Body**: None (POST request with broadcast ID in URL)

**URL Parameters**:
- `broadcastId`: The ID of the broadcast to respond to

**Success Response**: `200 OK`

**Response Body**:
```json
{
  "success": true,
  "message": "Conversation created successfully",
  "data": {
    "id": "clxconv123",
    "creator_id": "clxsarah123",
    "participant_id": "clxsam123",
    "broadcast_id": "clxbroadcast123",
    "type": "patient_doctor",
    "status": "open",
    "assisted_by": "clxsam123",
    "created_at": "2024-01-01T12:05:00Z",
    "updated_at": "2024-01-01T12:05:00Z",
    "creator": {
      "id": "clxsarah123",
      "name": "Sarah Johnson",
      "avatar": "sarah.jpg",
      "avatar_url": "https://example.com/avatars/sarah.jpg"
    },
    "participant": {
      "id": "clxsam123",
      "name": "Dr. Sam Smith",
      "avatar": "sam.jpg",
      "avatar_url": "https://example.com/avatars/sam.jpg"
    },
    "messages": []
  }
}
```

**Response Fields**:
- `success`: Boolean indicating if request was successful
- `message`: Success message
- `data`: Created conversation object

**Conversation Object Fields**:
- `id`: Conversation ID (unique identifier)
- `creator_id`: ID of the conversation creator (patient)
- `participant_id`: ID of the conversation participant (doctor)
- `broadcast_id`: ID of the broadcast that created this conversation
- `type`: Conversation type (`"patient_doctor"`)
- `status`: Conversation status (`"open"`)
- `assisted_by`: ID of the doctor who responded
- `created_at`: Timestamp when conversation was created
- `updated_at`: Timestamp when conversation was last updated
- `creator`: Creator user information (id, name, avatar, avatar_url)
- `participant`: Participant user information (id, name, avatar, avatar_url)
- `messages`: Array of messages (empty initially)

**Error Responses**:
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: User not authenticated (invalid or missing JWT token)
- `403 Forbidden`: User is not a doctor, or doctor account is not approved
- `404 Not Found`: Broadcast not found, or patient not found
- `409 Conflict`: Broadcast has already been assisted by another doctor
- `500 Internal Server Error`: Server error

**WebSocket Events**:
- `conversation`: Emitted to patient and doctor when conversation is created
  - Event data includes full conversation object
  - Patient and doctor receive this event in real-time
  - Frontend updates conversation list automatically
- `broadcast_assisted`: Emitted to all doctors when broadcast is assisted
  - Event data includes broadcast ID and conversation object
  - All doctors receive this event in real-time
- `broadcast_updated`: Emitted to all doctors and patient when broadcast status changes
  - Event data includes updated broadcast object
  - All doctors and patient receive this event in real-time
  - Broadcast status changes to "assisted" when doctor responds

**Notes**:
- Only one doctor can respond to a broadcast (first come, first served)
- Race condition protection ensures only one doctor can respond, even if multiple doctors try simultaneously
- Broadcast status changes to "assisted" when doctor responds
- Conversation is automatically linked to broadcast via `broadcast_id`
- Patient is creator, doctor is participant
- Doctor is marked as `assisted_by` in conversation
- All verified doctors receive real-time notifications when broadcast is assisted
- Patient receives real-time notification when doctor responds

---

## 🎨 Frontend Implementation Guide

### Respond to Broadcast Component (React/TypeScript Example)

```typescript
interface Broadcast {
  id: string;
  patient_id: string;
  message: string;
  status: string;
  assisted_by?: string;
  conversation_id?: string;
  created_at: string;
  updated_at: string;
  patient: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
  };
}

interface Conversation {
  id: string;
  creator_id: string;
  participant_id: string;
  broadcast_id?: string;
  type: string;
  status: string;
  assisted_by?: string;
  created_at: string;
  updated_at: string;
  creator: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  participant: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  messages: Array<{
    id: string;
    message: string;
    message_type: string;
    created_at: string;
  }>;
}

const RespondToBroadcastButton = ({ broadcast }: { broadcast: Broadcast }) => {
  const [isResponding, setIsResponding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuthContext();
  const router = useRouter();
  const socket = useSocket();

  const handleRespond = async () => {
    setIsResponding(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/chat/conversation/broadcast/${broadcast.id}/respond`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        // Success: Conversation created
        toast.success('You have successfully responded to the broadcast');
        
        // Redirect to conversation page
        router.push(`/chat/conversation/${data.data.id}`);
      } else {
        // Error: Broadcast already assisted or other error
        setError(data.message || 'Failed to respond to broadcast');
        toast.error(data.message || 'Failed to respond to broadcast');
      }
    } catch (error) {
      console.error('Error responding to broadcast:', error);
      setError('Unable to respond to broadcast. Please try again.');
      toast.error('Unable to respond to broadcast. Please try again.');
    } finally {
      setIsResponding(false);
    }
  };

  // Listen for broadcast updates
  useEffect(() => {
    if (!socket) return;

    socket.on('broadcast_updated', (data: { broadcast: Broadcast }) => {
      if (data.broadcast.id === broadcast.id) {
        // Broadcast has been updated (assisted by another doctor)
        if (data.broadcast.status === 'assisted') {
          setError('This broadcast has already been assisted by another doctor');
          toast.info('This broadcast has already been assisted by another doctor');
        }
      }
    });

    return () => {
      socket.off('broadcast_updated');
    };
  }, [socket, broadcast.id]);

  return (
    <div className="respond-to-broadcast">
      <button
        onClick={handleRespond}
        disabled={isResponding || broadcast.status !== 'open'}
        className="btn-primary"
      >
        {isResponding ? 'Responding...' : 'Respond'}
      </button>
      {error && <p className="error-message">{error}</p>}
      {broadcast.status === 'assisted' && (
        <p className="status-message">Already assisted</p>
      )}
    </div>
  );
};
```

### WebSocket Event Handling

```typescript
// WebSocket hook for broadcast and conversation events
const useBroadcastResponseEvents = () => {
  const socket = useSocket();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);

  useEffect(() => {
    if (!socket) return;

    // Listen for new conversation (when doctor responds)
    socket.on('conversation', (data: { conversation: Conversation }) => {
      setConversations((prev) => {
        // Check if conversation already exists
        const exists = prev.find((c) => c.id === data.conversation.id);
        if (exists) {
          return prev;
        }
        // Add new conversation to top
        return [data.conversation, ...prev];
      });

      // Show notification
      toast.info(`New conversation with ${data.conversation.participant.name}`);
    });

    // Listen for broadcast updates
    socket.on('broadcast_updated', (data: { broadcast: Broadcast }) => {
      setBroadcasts((prev) =>
        prev.map((b) =>
          b.id === data.broadcast.id ? data.broadcast : b
        )
      );

      // If broadcast is now "assisted", show notification
      if (data.broadcast.status === 'assisted') {
        toast.info(`Broadcast from ${data.broadcast.patient.name} has been assisted`);
      }
    });

    // Listen for broadcast assisted event
    socket.on('broadcast_assisted', (data: { broadcast_id: string; conversation: Conversation }) => {
      // Update broadcast status
      setBroadcasts((prev) =>
        prev.map((b) =>
          b.id === data.broadcast_id
            ? { ...b, status: 'assisted', conversation_id: data.conversation.id }
            : b
        )
      );

      // Show notification
      toast.info('A broadcast has been assisted by another doctor');
    });

    return () => {
      socket.off('conversation');
      socket.off('broadcast_updated');
      socket.off('broadcast_assisted');
    };
  }, [socket]);

  return { conversations, setConversations, broadcasts, setBroadcasts };
};
```

---

## ✅ Summary

### What We Learned

1. **Respond to Broadcast**: Doctors can respond to patient broadcasts, creating private conversations
2. **Conversation Creation**: Responding to a broadcast automatically creates a conversation between doctor and patient
3. **Broadcast Status Update**: Broadcast status changes to "assisted" when doctor responds
4. **Race Condition Protection**: Only one doctor can respond to a broadcast (first come, first served)
5. **Real-Time Notifications**: All users receive real-time notifications when broadcast is assisted
6. **Patient Notification**: Patient receives real-time notification when doctor responds
7. **Doctor Notification**: Other doctors receive real-time notifications when broadcast is assisted

### Key Takeaways

- ✅ Only one doctor can respond to a broadcast (first come, first served)
- ✅ Race condition protection ensures only one doctor can respond, even if multiple doctors try simultaneously
- ✅ Conversation is automatically created when doctor responds to broadcast
- ✅ Broadcast status changes to "assisted" when doctor responds
- ✅ Patient receives real-time notification when doctor responds
- ✅ Other doctors receive real-time notifications when broadcast is assisted
- ✅ Conversation is automatically linked to broadcast via `broadcast_id`

### Next Steps

- **Sam**: Has successfully responded to Sarah's broadcast (State 6)
- **Sarah**: Receives real-time notification and sees conversation in her inbox (State 6)
- **Parker**: Sees that broadcast has been assisted and cannot respond (State 6)
- **Sam and Sarah**: Can start chatting in their private conversation (Chapter 8)

---

## 🎯 Next Chapter

**[Chapter 7: Conversation List - Conversation List UI and Conversation Detail Page](#chapter-7-conversation-list---conversation-list-ui-and-conversation-detail-page)**

In the next chapter, we'll see how **Sarah** views her conversation list after receiving a notification, and how she opens the conversation with **Sam** to start chatting. We'll also explore the conversation detail page and how messages are displayed.

---

# Chapter 7: Conversation List - Conversation List UI and Conversation Detail Page

## 📖 Story Context

After **Sam** responded to her broadcast, **Sarah** received a real-time notification that a doctor has responded to her message. Now, she opens her **conversation list** and sees the new conversation with **Dr. Sam Smith**. She clicks on the conversation to view the conversation detail page, where she can see the conversation information and prepare to chat with Sam. Meanwhile, **Sam** is also viewing the same conversation detail page, ready to send his first message.

---

## 🎯 State Transition

**State**: `6` (Conversation created, broadcast assisted) → `7` (Conversation list loaded, conversation detail page ready)

---

## 👤 User Journey: Sarah Views Conversation List and Opens Conversation

### 🎬 Scene 1: Sarah Receives Real-Time Notification

**User Action**: Sarah is on the landing page or inbox page when she receives a real-time notification.

**WebSocket Event**: `conversation` (from Chapter 6)

**Event Data** (received by Sarah):
```json
{
  "from": "clxsarah123",
  "data": {
    "id": "clxconv123",
    "creator_id": "clxsarah123",
    "participant_id": "clxsam123",
    "broadcast_id": "clxbroadcast123",
    "type": "patient_doctor",
    "status": "open",
    "assisted_by": "clxsam123",
    "created_at": "2024-01-01T12:05:00Z",
    "updated_at": "2024-01-01T12:05:00Z",
    "creator": {
      "id": "clxsarah123",
      "name": "Sarah Johnson",
      "avatar_url": "https://example.com/avatars/sarah.jpg"
    },
    "participant": {
      "id": "clxsam123",
      "name": "Dr. Sam Smith",
      "avatar_url": "https://example.com/avatars/sam.jpg"
    },
    "messages": []
  }
}
```

**Frontend Action**: 
- Receives `conversation` WebSocket event
- Updates conversation list in real-time
- Adds new conversation to the top of the list
- Shows notification: "Dr. Sam Smith has responded to your message!"
- Updates notification badge
- Optionally: Plays notification sound
- Optionally: Shows toast notification

**What Sarah Sees**: 
- Notification: "Dr. Sam Smith has responded to your message!"
- Notification badge shows new conversation
- Conversation list updates automatically (if already open)

**What Happens**: Sarah receives real-time notification that a doctor has responded to her broadcast.

---

### 🎬 Scene 2: Sarah Clicks "Inbox" Button

**User Action**: Sarah clicks the "Inbox" button in the navbar to view her conversation list.

**Frontend Action**: 
- Navigation to conversation list page
- Conversation list page starts loading
- Shows loading state (spinner or skeleton screen)
- Prepares to fetch conversations from API

**What Sarah Sees**: 
- Loading indicator while conversations are being fetched
- Navbar with "Inbox" button active
- Back button or home button to return to landing page

**What Happens**: Frontend initiates the process to load Sarah's conversations.

---

### 🎬 Scene 3: Frontend Calls API to Load Conversations

**Frontend Action**: 
- Frontend extracts user ID from stored JWT token
- Prepares API request with authentication header
- Sends API request to fetch conversations

**API Call**: `GET /chat/conversation`

**Request Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body**: None (GET request)

**What Happens**: Frontend requests all conversations where Sarah is creator or participant.

---

### 🎬 Scene 4: Backend Returns Conversations

**Backend Flow**:

1. **Request Validation**:
   - Validates JWT token from Authorization header
   - Extracts user ID (Sarah's ID) from token
   - Verifies user is authenticated

2. **Query Conversations**:
   - Queries database for conversations where:
     - `creator_id = userId` OR `participant_id = userId`
     - `deleted_at IS NULL` (only non-deleted conversations)
   - Orders by `updated_at DESC` (most recently updated first)
   - Selects conversation fields:
     - `id`, `creator_id`, `participant_id`, `broadcast_id`, `type`, `status`, `assisted_by`, `created_at`, `updated_at`
     - Creator information (id, name, avatar)
     - Participant information (id, name, avatar)
     - Last message preview (most recent message, if any)

3. **Process Results**:
   - Returns list of conversations
   - Currently includes conversation with Sam (status: "open")
   - Conversation has no messages yet (empty messages array)

4. **Add Avatar URLs**:
   - Processes avatar URLs for creator and participant
   - Converts relative paths to full URLs

**API Response**: `200 OK`

**Response Body**:
```json
{
  "success": true,
  "data": [
    {
      "id": "clxconv123",
      "creator_id": "clxsarah123",
      "participant_id": "clxsam123",
      "broadcast_id": "clxbroadcast123",
      "type": "patient_doctor",
      "status": "open",
      "assisted_by": "clxsam123",
      "created_at": "2024-01-01T12:05:00Z",
      "updated_at": "2024-01-01T12:05:00Z",
      "creator": {
        "id": "clxsarah123",
        "name": "Sarah Johnson",
        "avatar": "sarah.jpg",
        "avatar_url": "https://example.com/avatars/sarah.jpg"
      },
      "participant": {
        "id": "clxsam123",
        "name": "Dr. Sam Smith",
        "avatar": "sam.jpg",
        "avatar_url": "https://example.com/avatars/sam.jpg"
      },
      "messages": []
    }
  ],
  "count": 1
}
```

**What Happens**: Backend returns Sarah's conversation with Sam.

---

### 🎬 Scene 5: Frontend Displays Conversation List

**Frontend Action**: 
- Receives list of conversations from API
- Hides loading state
- Displays conversations in list UI

**What Sarah Sees**: 
- **Conversation List**: List of all conversations
- **Conversation with Sam**: 
  - Doctor name: "Dr. Sam Smith"
  - Doctor avatar: Profile picture
  - Last message: "No messages yet" (empty state)
  - Timestamp: "Just now" or relative time
  - Status: "Open" (active conversation)
  - Notification badge: Shows new conversation indicator
- **Conversation Cards**: Each conversation displayed as a card with participant info and last message preview

**Conversation List UI Elements**:
- Header: "Inbox" or "Conversations"
- Conversation cards with participant info
- Last message preview (or "No messages yet")
- Timestamp for each conversation
- Status indicator (open, closed, assisted)
- Notification badge for new conversations
- Optionally: Search or filter functionality

**What Happens**: Sarah sees her conversation with Sam and can click on it to open the conversation detail page.

---

### 🎬 Scene 6: Sarah Clicks on Conversation

**User Action**: Sarah clicks on the conversation card with Dr. Sam Smith.

**Frontend Action**: 
- Navigation to conversation detail page: `/chat/conversation/clxconv123`
- Conversation detail page starts loading
- Shows loading state (spinner or skeleton screen)
- Prepares to fetch conversation details and messages from API

**What Sarah Sees**: 
- Loading indicator while conversation details are being fetched
- Navbar with "Inbox" button and back button
- Conversation header (loading state)

**What Happens**: Frontend initiates the process to load conversation details and messages.

---

### 🎬 Scene 7: Frontend Calls API to Load Conversation Details

**Frontend Action**: 
- Frontend extracts user ID from stored JWT token
- Prepares API request with authentication header
- Sends API request to fetch conversation details

**API Call**: `GET /chat/conversation/:id`

**Request Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body**: None (GET request)

**URL Parameters**:
- `id`: The ID of the conversation (e.g., `clxconv123`)

**What Happens**: Frontend requests conversation details and last 10 messages.

---

### 🎬 Scene 8: Backend Returns Conversation Details

**Backend Flow**:

1. **Request Validation**:
   - Validates JWT token from Authorization header
   - Extracts user ID (Sarah's ID) from token
   - Verifies user is authenticated

2. **Query Conversation**:
   - Queries database for conversation by ID
   - Verifies that conversation exists
   - Verifies that conversation is not deleted (`deleted_at IS NULL`)

3. **Authorization Check**:
   - Verifies that user is authorized to access this conversation
   - User must be either `creator_id` or `participant_id`
   - Returns error if user is not authorized

4. **Query Conversation Details**:
   - Selects conversation fields:
     - `id`, `creator_id`, `participant_id`, `broadcast_id`, `type`, `status`, `assisted_by`, `created_at`, `updated_at`
     - Creator information (id, name, avatar)
     - Participant information (id, name, avatar)
     - Last 10 messages (ordered by `created_at DESC`, most recent first)
     - Message fields: `id`, `message`, `message_type`, `created_at`

5. **Process Results**:
   - Returns conversation details
   - Currently includes no messages (empty messages array)
   - Conversation is ready for messages

6. **Add Avatar URLs**:
   - Processes avatar URLs for creator and participant
   - Converts relative paths to full URLs

**API Response**: `200 OK`

**Response Body**:
```json
{
  "success": true,
  "data": {
    "id": "clxconv123",
    "creator_id": "clxsarah123",
    "participant_id": "clxsam123",
    "broadcast_id": "clxbroadcast123",
    "type": "patient_doctor",
    "status": "open",
    "assisted_by": "clxsam123",
    "created_at": "2024-01-01T12:05:00Z",
    "updated_at": "2024-01-01T12:05:00Z",
    "creator": {
      "id": "clxsarah123",
      "name": "Sarah Johnson",
      "avatar": "sarah.jpg",
      "avatar_url": "https://example.com/avatars/sarah.jpg"
    },
    "participant": {
      "id": "clxsam123",
      "name": "Dr. Sam Smith",
      "avatar": "sam.jpg",
      "avatar_url": "https://example.com/avatars/sam.jpg"
    },
    "messages": []
  }
}
```

**What Happens**: Backend returns conversation details with no messages yet.

---

### 🎬 Scene 9: Frontend Displays Conversation Detail Page

**Frontend Action**: 
- Receives conversation details from API
- Hides loading state
- Displays conversation detail page UI
- Optionally: Calls API to load all messages: `GET /chat/message?conversation_id=clxconv123`

**What Sarah Sees**: 
- **Conversation Header**: 
  - Doctor name: "Dr. Sam Smith"
  - Doctor avatar: Profile picture
  - Conversation status: "Open"
  - Back button to return to conversation list
- **Message List**: 
  - Empty state: "No messages yet. Start the conversation!"
  - Message input area ready for typing
  - Send button ready
- **Message Input**: 
  - Text input field
  - Send button
  - Ready to send first message

**Conversation Detail Page UI Elements**:
- Header: Participant name and avatar
- Message list: Shows messages (empty initially)
- Message input: Text input and send button
- Empty state: "No messages yet" message
- Loading state: While fetching messages
- Real-time updates: WebSocket events for new messages

**What Happens**: Sarah sees the conversation detail page and is ready to start chatting with Sam.

---

### 🎬 Scene 10: Optional - Frontend Loads All Messages

**Frontend Action**: 
- Frontend optionally calls API to load all messages for pagination
- Prepares API request with conversation ID and pagination parameters

**API Call**: `GET /chat/message?conversation_id=clxconv123&limit=20`

**Request Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters**:
- `conversation_id`: The ID of the conversation (e.g., `clxconv123`)
- `limit`: Number of messages to fetch (default: 20)
- `cursor`: Cursor for pagination (optional)

**Backend Flow**:

1. **Request Validation**:
   - Validates JWT token from Authorization header
   - Extracts user ID (Sarah's ID) from token
   - Verifies user is authenticated

2. **Conversation Validation**:
   - Verifies that conversation exists
   - Verifies that user is authorized to access this conversation
   - User must be either `creator_id` or `participant_id`

3. **Query Messages**:
   - Queries database for messages where:
     - `conversation_id = conversationId`
     - `deleted_at IS NULL` (only non-deleted messages)
   - Orders by `created_at ASC` (oldest first, for chronological display)
   - Applies pagination (limit, cursor)
   - Selects message fields:
     - `id`, `message`, `message_type`, `medicine_details`, `patient_name`, `created_at`, `updated_at`, `status`
     - Sender information (id, name, avatar)
     - Receiver information (id, name, avatar)
     - Attachment information (if any)

4. **Process Results**:
   - Returns list of messages
   - Currently includes no messages (empty array)
   - Messages are ready to be displayed

5. **Add Avatar URLs**:
   - Processes avatar URLs for sender and receiver
   - Converts relative paths to full URLs

**API Response**: `200 OK`

**Response Body**:
```json
{
  "success": true,
  "data": []
}
```

**What Happens**: Backend returns empty messages array (no messages yet).

---

### 🎬 Scene 11: WebSocket Connection Setup

**Frontend Action**: 
- WebSocket connection is already established from login (Chapter 2)
- Frontend listens for WebSocket events on conversation detail page
- Sets up event listeners for:
  - `message` event (new message notification)
  - `conversation` event (conversation updates)
  - `joinRoom` event (join conversation room for real-time updates)

**WebSocket Events to Listen For**:
- `message`: Emitted when a new message is received in the conversation
- `conversation`: Emitted when conversation is updated
- `joinRoom`: Join conversation room for real-time updates (optional)

**What Happens**: Frontend is ready to receive real-time notifications about new messages.

---

### 🎬 Scene 12: Real-Time Notification Setup

**Frontend Action**: 
- Frontend sets up WebSocket event handlers
- Listens for `message` event (will be received when new message is sent)
- When `message` event is received:
  - Updates message list in real-time
  - Shows notification badge
  - Optionally plays notification sound
  - Optionally shows toast notification
  - Scrolls to bottom of message list

**WebSocket Event Handler**:
```typescript
socket.on('message', (data: { from: string; data: Message }) => {
  // Update message list
  setMessages((prev) => [...prev, data.data]);
  
  // Show notification (if not from current user)
  if (data.from !== currentUserId) {
    toast.info(`New message from ${data.data.sender.name}`);
  }
  
  // Scroll to bottom
  scrollToBottom();
});
```

**What Happens**: Frontend is ready to update the message list in real-time when new messages are received.

---

### 🎬 Scene 13: Next Steps

**State**: `7` (Conversation list loaded, conversation detail page ready)

**What Happens Next**: 
- Sarah is ready to send her first message to Sam (covered in Chapter 8)
- Sam is also ready to send his first message to Sarah (covered in Chapter 8)
- Messages will appear in real-time when sent
- Conversation list will update when new messages are sent

**Next Chapter**: [Chapter 8: Sending Messages - Real-Time Messaging and Conversation List Updates](#chapter-8-sending-messages---real-time-messaging-and-conversation-list-updates)

---

## 🔄 Alternative Flows

### 🎬 Scene 14: Sam Also Views Conversation Detail Page

**User Action**: Sam is redirected to conversation detail page after responding to broadcast (from Chapter 6).

**Frontend Action**: 
- Same as Sarah's flow
- Sam sees conversation detail page with Sarah
- Conversation has no messages yet (empty state)

**API Call**: `GET /chat/conversation/clxconv123`

**Response Body**: Same as Sarah's response (both users see the same conversation)

**What Sam Sees**: 
- Conversation header with Sarah's name and avatar
- Empty message list: "No messages yet. Start the conversation!"
- Message input ready to send first message

**What Happens**: Sam is ready to send his first message to Sarah.

---

### 🎬 Scene 15: Conversation List Updates in Real-Time

**User Action**: Sarah is viewing conversation list, and a new message is sent in the conversation with Sam.

**WebSocket Event**: `message`

**Event Data** (received by Sarah):
```json
{
  "from": "clxsam123",
  "data": {
    "id": "clxmsg123",
    "message": "Hello Sarah, I see you have a headache and fever...",
    "message_type": "text",
    "created_at": "2024-01-01T12:10:00Z",
    "sender": {
      "id": "clxsam123",
      "name": "Dr. Sam Smith",
      "avatar_url": "https://example.com/avatars/sam.jpg"
    },
    "receiver": {
      "id": "clxsarah123",
      "name": "Sarah Johnson",
      "avatar_url": "https://example.com/avatars/sarah.jpg"
    }
  }
}
```

**Frontend Action**: 
- Receives `message` WebSocket event
- Updates conversation list in real-time
- Updates last message preview for conversation with Sam
- Updates timestamp for conversation
- Moves conversation to top of list (most recently updated)
- Updates notification badge
- Optionally: Shows toast notification

**What Sarah Sees**: 
- Conversation list updates automatically
- Conversation with Sam shows last message: "Hello Sarah, I see you have a headache and fever..."
- Conversation moves to top of list
- Notification badge shows new message

**What Happens**: Conversation list updates in real-time when new messages are received.

---

### 🎬 Scene 16: Conversation Not Found

**User Action**: Sarah tries to access a conversation that doesn't exist or has been deleted.

**API Call**: `GET /chat/conversation/invalid_id`

**Backend Flow**:
1. Queries database for conversation by ID
2. Conversation not found or deleted
3. Returns error: `404 Not Found`

**API Response**: `404 Not Found`

**Response Body**:
```json
{
  "success": false,
  "message": "Conversation not found"
}
```

**Frontend Action**: 
- Shows error message: "Conversation not found. It may have been deleted."
- Redirects to conversation list
- Removes conversation from list if it exists

**What Happens**: Sarah cannot access a conversation that doesn't exist or has been deleted.

---

### 🎬 Scene 17: Unauthorized Access

**User Action**: Sarah tries to access a conversation that belongs to another user.

**API Call**: `GET /chat/conversation/other_user_conversation_id`

**Backend Flow**:
1. Queries database for conversation by ID
2. Verifies that user is authorized to access this conversation
3. User is not `creator_id` or `participant_id`
4. Returns error: `403 Forbidden`

**API Response**: `403 Forbidden`

**Response Body**:
```json
{
  "success": false,
  "message": "You are not authorized to access this conversation"
}
```

**Frontend Action**: 
- Shows error message: "You are not authorized to access this conversation"
- Redirects to conversation list
- Prevents access to conversation

**What Happens**: Sarah cannot access conversations that don't belong to her.

---

## ⚠️ Error Handling

### 🚫 Error 1: Conversation Not Found

**Scenario**: Sarah tries to access a conversation that doesn't exist.

**API Response**: `404 Not Found`

**Response Body**:
```json
{
  "success": false,
  "message": "Conversation not found"
}
```

**Frontend Action**: 
- Shows error message: "Conversation not found. It may have been deleted."
- Redirects to conversation list
- Removes conversation from list if it exists

---

### 🚫 Error 2: Unauthorized Access

**Scenario**: Sarah tries to access a conversation that belongs to another user.

**API Response**: `403 Forbidden`

**Response Body**:
```json
{
  "success": false,
  "message": "You are not authorized to access this conversation"
}
```

**Frontend Action**: 
- Shows error message: "You are not authorized to access this conversation"
- Redirects to conversation list
- Prevents access to conversation

---

### 🚫 Error 3: User Not Authenticated

**Scenario**: Sarah's JWT token is invalid or expired.

**API Response**: `401 Unauthorized`

**Response Body**:
```json
{
  "success": false,
  "message": "User not authenticated"
}
```

**Frontend Action**: 
- Shows error message: "Your session has expired. Please login again."
- Redirects to login page
- Clears stored token

---

### 🚫 Error 4: Server Error

**Scenario**: Database error or server issue.

**API Response**: `500 Internal Server Error`

**Response Body**:
```json
{
  "success": false,
  "message": "Failed to fetch conversation"
}
```

**Frontend Action**: 
- Shows error message: "Unable to load conversation. Please try again later."
- Shows retry button
- Allows user to retry the request

---

## 📝 API Documentation

### `GET /chat/conversation`

**Description**: Get all conversations for the authenticated user (where user is creator or participant)

**Role**: All authenticated users (patient, doctor, shop_owner, admin)

**Authentication**: Required (JWT token)

**Request Headers**:
```
Authorization: Bearer <your-jwt-token>
```

**Request Body**: None (GET request)

**Query Parameters**: None

**Success Response**: `200 OK`

**Response Body**:
```json
{
  "success": true,
  "data": [
    {
      "id": "clxconv123",
      "creator_id": "clxsarah123",
      "participant_id": "clxsam123",
      "broadcast_id": "clxbroadcast123",
      "type": "patient_doctor",
      "status": "open",
      "assisted_by": "clxsam123",
      "created_at": "2024-01-01T12:05:00Z",
      "updated_at": "2024-01-01T12:05:00Z",
      "creator": {
        "id": "clxsarah123",
        "name": "Sarah Johnson",
        "avatar": "sarah.jpg",
        "avatar_url": "https://example.com/avatars/sarah.jpg"
      },
      "participant": {
        "id": "clxsam123",
        "name": "Dr. Sam Smith",
        "avatar": "sam.jpg",
        "avatar_url": "https://example.com/avatars/sam.jpg"
      },
      "messages": [
        {
          "id": "clxmsg123",
          "message": "Hello Sarah, I see you have a headache and fever...",
          "message_type": "text",
          "created_at": "2024-01-01T12:10:00Z"
        }
      ]
    }
  ],
  "count": 1
}
```

**Response Fields**:
- `success`: Boolean indicating if request was successful
- `data`: Array of conversations
- `count`: Number of conversations

**Conversation Object Fields**:
- `id`: Conversation ID (unique identifier)
- `creator_id`: ID of the conversation creator
- `participant_id`: ID of the conversation participant
- `broadcast_id`: ID of the broadcast that created this conversation (if applicable)
- `type`: Conversation type (`"patient_doctor"` or `"doctor_shop_owner"`)
- `status`: Conversation status (`"open"`, `"closed"`, `"assisted"`)
- `assisted_by`: ID of the doctor who assisted (if applicable)
- `created_at`: Timestamp when conversation was created
- `updated_at`: Timestamp when conversation was last updated
- `creator`: Creator user information (id, name, avatar, avatar_url)
- `participant`: Participant user information (id, name, avatar, avatar_url)
- `messages`: Array of last message preview (most recent message, if any)

**Error Responses**:
- `400 Bad Request`: User ID is required
- `401 Unauthorized`: User not authenticated (invalid or missing JWT token)
- `500 Internal Server Error`: Server error

**WebSocket Events**:
- `conversation`: Emitted when a new conversation is created
  - Event data includes full conversation object
  - Users receive this event in real-time
  - Frontend updates conversation list automatically

**Notes**:
- Returns only conversations where user is creator or participant
- Conversations are filtered server-side (security)
- Returns empty array if no conversations exist
- Conversations are ordered by `updated_at` DESC (most recently updated first)
- Last message preview is included for each conversation
- Avatar URLs are automatically converted to full URLs

---

### `GET /chat/conversation/:id`

**Description**: Get a single conversation by ID with last 10 messages

**Role**: All authenticated users (patient, doctor, shop_owner, admin)

**Authentication**: Required (JWT token)

**Request Headers**:
```
Authorization: Bearer <your-jwt-token>
```

**Request Body**: None (GET request)

**URL Parameters**:
- `id`: Conversation ID

**Success Response**: `200 OK`

**Response Body**:
```json
{
  "success": true,
  "data": {
    "id": "clxconv123",
    "creator_id": "clxsarah123",
    "participant_id": "clxsam123",
    "broadcast_id": "clxbroadcast123",
    "type": "patient_doctor",
    "status": "open",
    "assisted_by": "clxsam123",
    "created_at": "2024-01-01T12:05:00Z",
    "updated_at": "2024-01-01T12:05:00Z",
    "creator": {
      "id": "clxsarah123",
      "name": "Sarah Johnson",
      "avatar": "sarah.jpg",
      "avatar_url": "https://example.com/avatars/sarah.jpg"
    },
    "participant": {
      "id": "clxsam123",
      "name": "Dr. Sam Smith",
      "avatar": "sam.jpg",
      "avatar_url": "https://example.com/avatars/sam.jpg"
    },
    "messages": [
      {
        "id": "clxmsg123",
        "message": "Hello Sarah, I see you have a headache and fever...",
        "message_type": "text",
        "created_at": "2024-01-01T12:10:00Z"
      }
    ]
  }
}
```

**Response Fields**:
- `success`: Boolean indicating if request was successful
- `data`: Conversation object with last 10 messages

**Conversation Object Fields**:
- `id`: Conversation ID (unique identifier)
- `creator_id`: ID of the conversation creator
- `participant_id`: ID of the conversation participant
- `broadcast_id`: ID of the broadcast that created this conversation (if applicable)
- `type`: Conversation type (`"patient_doctor"` or `"doctor_shop_owner"`)
- `status`: Conversation status (`"open"`, `"closed"`, `"assisted"`)
- `assisted_by`: ID of the doctor who assisted (if applicable)
- `created_at`: Timestamp when conversation was created
- `updated_at`: Timestamp when conversation was last updated
- `creator`: Creator user information (id, name, avatar, avatar_url)
- `participant`: Participant user information (id, name, avatar, avatar_url)
- `messages`: Array of last 10 messages (ordered by `created_at` DESC, most recent first)

**Error Responses**:
- `400 Bad Request`: User ID is required
- `401 Unauthorized`: User not authenticated (invalid or missing JWT token)
- `403 Forbidden`: User is not authorized to access this conversation
- `404 Not Found`: Conversation not found
- `500 Internal Server Error`: Server error

**WebSocket Events**:
- `message`: Emitted when a new message is received in the conversation
  - Event data includes full message object
  - Users receive this event in real-time
  - Frontend updates message list automatically

**Notes**:
- Returns only conversations where user is creator or participant
- Users can only access their own conversations (authorization check)
- Returns last 10 messages (most recent first)
- For full message history, use `GET /chat/message?conversation_id=:id`
- Avatar URLs are automatically converted to full URLs
- Messages are ordered by `created_at` DESC (most recent first) in response

---

### `GET /chat/message?conversation_id=:id&limit=20&cursor=:cursor`

**Description**: Get all messages in a conversation with pagination

**Role**: All authenticated users (patient, doctor, shop_owner, admin)

**Authentication**: Required (JWT token)

**Request Headers**:
```
Authorization: Bearer <your-jwt-token>
```

**Request Body**: None (GET request)

**Query Parameters**:
- `conversation_id`: Conversation ID (required)
- `limit`: Number of messages to fetch (default: 20, optional)
- `cursor`: Cursor for pagination (optional)

**Success Response**: `200 OK`

**Response Body**:
```json
{
  "success": true,
  "data": [
    {
      "id": "clxmsg123",
      "message": "Hello Sarah, I see you have a headache and fever...",
      "message_type": "text",
      "medicine_details": null,
      "patient_name": null,
      "created_at": "2024-01-01T12:10:00Z",
      "updated_at": "2024-01-01T12:10:00Z",
      "status": "SENT",
      "sender": {
        "id": "clxsam123",
        "name": "Dr. Sam Smith",
        "avatar": "sam.jpg",
        "avatar_url": "https://example.com/avatars/sam.jpg"
      },
      "receiver": {
        "id": "clxsarah123",
        "name": "Sarah Johnson",
        "avatar": "sarah.jpg",
        "avatar_url": "https://example.com/avatars/sarah.jpg"
      },
      "attachment": null
    }
  ]
}
```

**Response Fields**:
- `success`: Boolean indicating if request was successful
- `data`: Array of messages

**Message Object Fields**:
- `id`: Message ID (unique identifier)
- `message`: Message text content
- `message_type`: Message type (`"text"` or `"prescription"`)
- `medicine_details`: Prescription medicine details (for prescription messages)
- `patient_name`: Patient name (for prescription messages)
- `created_at`: Timestamp when message was created
- `updated_at`: Timestamp when message was last updated
- `status`: Message status (`"SENT"`, `"DELIVERED"`, `"READ"`)
- `sender`: Sender user information (id, name, avatar, avatar_url)
- `receiver`: Receiver user information (id, name, avatar, avatar_url)
- `attachment`: Attachment information (if any)

**Error Responses**:
- `400 Bad Request`: Conversation ID is required
- `401 Unauthorized`: User not authenticated (invalid or missing JWT token)
- `403 Forbidden`: User is not authorized to access this conversation
- `404 Not Found`: Conversation not found
- `500 Internal Server Error`: Server error

**WebSocket Events**:
- `message`: Emitted when a new message is received in the conversation
  - Event data includes full message object
  - Users receive this event in real-time
  - Frontend updates message list automatically

**Notes**:
- Returns only messages from conversations where user is creator or participant
- Messages are ordered by `created_at` ASC (oldest first, for chronological display)
- Supports pagination with `limit` and `cursor` parameters
- Returns empty array if no messages exist
- Avatar URLs are automatically converted to full URLs
- Attachment URLs are automatically converted to full URLs

---

## 🎨 Frontend Implementation Guide

### Conversation List Page Component (React/TypeScript Example)

```typescript
interface Conversation {
  id: string;
  creator_id: string;
  participant_id: string;
  type: string;
  status: string;
  broadcast_id?: string;
  assisted_by?: string;
  created_at: string;
  updated_at: string;
  creator: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  participant: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  messages: Array<{
    id: string;
    message: string;
    message_type: string;
    created_at: string;
  }>;
}

const ConversationListPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuthContext();
  const router = useRouter();
  const socket = useSocket();

  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Listen for new conversation events
  useEffect(() => {
    if (!socket) return;

    socket.on('conversation', (data: { conversation: Conversation }) => {
      // Add new conversation to list
      setConversations((prev) => {
        const exists = prev.find((c) => c.id === data.conversation.id);
        if (exists) {
          return prev.map((c) =>
            c.id === data.conversation.id ? data.conversation : c
          );
        }
        return [data.conversation, ...prev];
      });
      
      // Show notification
      toast.info(`${data.conversation.participant.name} has responded to your message!`);
    });

    // Listen for message events (update last message preview)
    socket.on('message', (data: { from: string; data: any }) => {
      // Update conversation list with new message
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === data.data.conversation_id) {
            return {
              ...c,
              messages: [data.data],
              updated_at: new Date().toISOString(),
            };
          }
          return c;
        })
      );
    });

    return () => {
      socket.off('conversation');
      socket.off('message');
    };
  }, [socket]);

  const fetchConversations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat/conversation', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setConversations(data.data || []);
      } else {
        setError(data.message || 'Failed to load conversations');
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Unable to load conversations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConversationClick = (conversationId: string) => {
    router.push(`/chat/conversation/${conversationId}`);
  };

  if (isLoading) {
    return (
      <div className="conversation-list-loading">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="conversation-list-error">
        <p>{error}</p>
        <button onClick={fetchConversations}>Retry</button>
      </div>
    );
  }

  // Empty state
  if (conversations.length === 0) {
    return (
      <div className="conversation-list-empty">
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <h2>No conversations yet</h2>
          <p>A doctor will respond to your message soon.</p>
          <p>You'll receive a notification when a doctor responds.</p>
          <button onClick={() => router.push('/')}>
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  // Conversation list
  return (
    <div className="conversation-list">
      <header>
        <h1>Inbox</h1>
        <button onClick={() => router.push('/')}>
          Send Message
        </button>
      </header>

      <main>
        {conversations.map((conversation) => {
          const otherUser = 
            conversation.creator_id === user?.id
              ? conversation.participant
              : conversation.creator;

          const lastMessage = conversation.messages[0];

          return (
            <div
              key={conversation.id}
              className="conversation-card"
              onClick={() => handleConversationClick(conversation.id)}
            >
              <div className="conversation-avatar">
                <img
                  src={otherUser.avatar_url || '/default-avatar.png'}
                  alt={otherUser.name}
                />
              </div>
              <div className="conversation-info">
                <div className="conversation-header">
                  <h3>{otherUser.name}</h3>
                  <span className="conversation-time">
                    {formatTime(conversation.updated_at)}
                  </span>
                </div>
                <div className="conversation-preview">
                  {lastMessage ? (
                    <p>{lastMessage.message}</p>
                  ) : (
                    <p className="no-message">No messages yet</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
};
```

### Conversation Detail Page Component (React/TypeScript Example)

```typescript
interface Message {
  id: string;
  message: string;
  message_type: string;
  medicine_details?: string;
  patient_name?: string;
  created_at: string;
  updated_at: string;
  status: string;
  sender: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  receiver: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  attachment?: {
    id: string;
    name: string;
    type: string;
    size: number;
    file_url: string;
  };
}

interface Conversation {
  id: string;
  creator_id: string;
  participant_id: string;
  type: string;
  status: string;
  broadcast_id?: string;
  assisted_by?: string;
  created_at: string;
  updated_at: string;
  creator: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  participant: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  messages: Message[];
}

const ConversationDetailPage = ({ conversationId }: { conversationId: string }) => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const { user, token } = useAuthContext();
  const router = useRouter();
  const socket = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversation details on component mount
  useEffect(() => {
    fetchConversation();
    fetchMessages();
  }, [conversationId]);

  // Listen for new message events
  useEffect(() => {
    if (!socket) return;

    socket.on('message', (data: { from: string; data: Message }) => {
      // Add new message to list
      if (data.data.conversation_id === conversationId) {
        setMessages((prev) => [...prev, data.data]);
        
        // Scroll to bottom
        scrollToBottom();
        
        // Show notification (if not from current user)
        if (data.from !== user?.id) {
          toast.info(`New message from ${data.data.sender.name}`);
        }
      }
    });

    return () => {
      socket.off('message');
    };
  }, [socket, conversationId, user?.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/chat/conversation/${conversationId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setConversation(data.data);
        // Set initial messages from conversation (last 10)
        if (data.data.messages) {
          setMessages(data.data.messages.reverse()); // Reverse to show oldest first
        }
      } else {
        setError(data.message || 'Failed to load conversation');
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
      setError('Unable to load conversation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `/api/chat/message?conversation_id=${conversationId}&limit=20`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        setMessages(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiver_id: conversation?.creator_id === user?.id
            ? conversation.participant_id
            : conversation?.creator_id,
          conversation_id: conversationId,
          message: newMessage,
          message_type: 'text',
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Clear input
        setNewMessage('');
        
        // Add message to list (optimistic update)
        setMessages((prev) => [...prev, data.data]);
        
        // Scroll to bottom
        scrollToBottom();
      } else {
        toast.error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Unable to send message. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="conversation-detail-loading">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="conversation-detail-error">
        <p>{error}</p>
        <button onClick={() => router.push('/chat/conversation')}>
          Back to Conversations
        </button>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="conversation-detail-error">
        <p>Conversation not found</p>
        <button onClick={() => router.push('/chat/conversation')}>
          Back to Conversations
        </button>
      </div>
    );
  }

  const otherUser = 
    conversation.creator_id === user?.id
      ? conversation.participant
      : conversation.creator;

  return (
    <div className="conversation-detail">
      <header className="conversation-header">
        <button onClick={() => router.push('/chat/conversation')}>
          Back
        </button>
        <div className="conversation-header-info">
          <img
            src={otherUser.avatar_url || '/default-avatar.png'}
            alt={otherUser.name}
            className="conversation-header-avatar"
          />
          <h2>{otherUser.name}</h2>
        </div>
      </header>

      <main className="message-list">
        {messages.length === 0 ? (
          <div className="empty-state">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isSender = message.sender.id === user?.id;
            return (
              <div
                key={message.id}
                className={`message ${isSender ? 'message-sent' : 'message-received'}`}
              >
                <div className="message-content">
                  <p>{message.message}</p>
                  <span className="message-time">
                    {formatTime(message.created_at)}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </footer>
    </div>
  );
};
```

---

## ✅ Summary

### What We Learned

1. **Conversation List**: Users can view all their conversations in a list
2. **Conversation Detail Page**: Users can open a conversation to view messages and chat
3. **Real-Time Updates**: Conversation list and message list update in real-time via WebSocket
4. **Last Message Preview**: Conversation list shows last message preview for each conversation
5. **Empty State**: Conversation detail page shows empty state when no messages exist
6. **Authorization**: Users can only access conversations where they are creator or participant
7. **Pagination**: Messages support pagination for loading message history

### Key Takeaways

- ✅ Conversation list is the primary interface for users (no dashboard)
- ✅ Conversation list updates in real-time when new messages are received
- ✅ Conversation detail page shows messages and allows sending messages
- ✅ Users can only access their own conversations (authorization check)
- ✅ Messages are ordered chronologically (oldest first) for display
- ✅ Last message preview is included in conversation list
- ✅ Empty state provides clear feedback when no messages exist

### Next Steps

- **Sarah**: Has opened conversation with Sam and is ready to send messages (State 7)
- **Sam**: Has opened conversation with Sarah and is ready to send messages (State 7)
- **Sarah and Sam**: Will start chatting in their private conversation (Chapter 8)
- **Messages**: Will appear in real-time when sent (Chapter 8)

---

## 🎯 Next Chapter

**[Chapter 8: Sending Messages - Real-Time Messaging and Conversation List Updates](#chapter-8-sending-messages---real-time-messaging-and-conversation-list-updates)**

In the next chapter, we'll see how **Sam** sends his first message to **Sarah**, and how **Sarah** receives it in real-time. We'll also explore how messages are sent, delivered, and displayed in the conversation detail page, and how the conversation list updates in real-time.

---

# Chapter 8: Sending Messages - Real-Time Messaging and Conversation List Updates

## 📖 Story Context

**Sam** is ready to help **Sarah** with her medical issue. He types his first message in the conversation detail page and sends it. **Sarah** receives the message in real-time via WebSocket, and it appears instantly in her conversation detail page. The conversation list also updates automatically, showing the last message preview and moving the conversation to the top.

---

## 🎯 State Transition

**State**: `7` (Conversation detail page ready) → `8` (Messages exchanged)

---

## 👤 User Journey: Sam Sends Message to Sarah

### 🎬 Scene 1: Sam Types and Sends Message

**User Action**: Sam types a message in the conversation detail page and clicks "Send".

**Frontend Action**: 
- Validates message content
- Prepares API request with message data
- Sends API request: `POST /chat/message`

**API Call**: `POST /chat/message`

**Request Body**:
```json
{
  "receiver_id": "clxsarah123",
  "conversation_id": "clxconv123",
  "message": "Hello Sarah, I see you have a headache and fever. Can you tell me more about your symptoms?",
  "message_type": "text"
}
```

---

### 🎬 Scene 2: Backend Processes Message

**Backend Flow**:
1. Validates JWT token and user authentication
2. Validates sender exists and is part of conversation
3. Validates receiver exists and is part of conversation
4. Validates message content (required for text messages)
5. Creates message record in database
6. Updates conversation `updated_at` timestamp
7. Emits WebSocket events:
   - `message` event to conversation room
   - `message` event to receiver's personal socket (if online)

**API Response**: `200 OK`

**Response Body**:
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "id": "clxmsg123",
    "message": "Hello Sarah, I see you have a headache and fever...",
    "message_type": "text",
    "created_at": "2024-01-01T12:10:00Z",
    "sender": {
      "id": "clxsam123",
      "name": "Dr. Sam Smith",
      "avatar_url": "https://example.com/avatars/sam.jpg"
    },
    "receiver": {
      "id": "clxsarah123",
      "name": "Sarah Johnson",
      "avatar_url": "https://example.com/avatars/sarah.jpg"
    }
  }
}
```

---

### 🎬 Scene 3: Frontend Updates Message List (Sam's Side)

**Frontend Action**: 
- Receives success response
- Adds message to message list immediately (optimistic update)
- Scrolls to bottom of message list
- Shows message as "sent"

**What Sam Sees**: 
- Message appears in conversation immediately
- Message shows as "sent" status
- Conversation list updates (if open) with last message preview

---

### 🎬 Scene 4: Sarah Receives Message in Real-Time

**WebSocket Event**: `message`

**Event Data** (received by Sarah):
```json
{
  "from": "clxsam123",
  "data": {
    "id": "clxmsg123",
    "message": "Hello Sarah, I see you have a headache and fever...",
    "message_type": "text",
    "created_at": "2024-01-01T12:10:00Z",
    "sender": {
      "id": "clxsam123",
      "name": "Dr. Sam Smith",
      "avatar_url": "https://example.com/avatars/sam.jpg"
    },
    "receiver": {
      "id": "clxsarah123",
      "name": "Sarah Johnson",
      "avatar_url": "https://example.com/avatars/sarah.jpg"
    }
  }
}
```

**Frontend Action** (Sarah's side): 
- Receives `message` WebSocket event
- Adds message to message list in real-time
- Scrolls to bottom of message list
- Shows notification: "New message from Dr. Sam Smith"
- Updates conversation list with last message preview
- Moves conversation to top of list

**What Sarah Sees**: 
- Message appears in conversation in real-time
- Notification shows new message
- Conversation list updates automatically

---

### 🎬 Scene 5: Conversation List Updates in Real-Time

**Frontend Action**: 
- Conversation list receives `message` WebSocket event
- Updates last message preview for conversation
- Updates timestamp for conversation
- Moves conversation to top of list (most recently updated first)
- Updates notification badge

**What Happens**: Conversation list updates automatically when new messages are received.

---

## 🔄 Alternative Flows

### 🎬 Scene 6: Sarah Responds to Sam

**User Action**: Sarah types a response and sends it.

**Frontend Action**: 
- Same flow as Sam's message
- Sarah's message is sent via `POST /chat/message`
- Sam receives message in real-time via WebSocket
- Conversation continues

---

### 🎬 Scene 7: User Not Part of Conversation

**Scenario**: Someone tries to send a message to a conversation they're not part of.

**API Response**: `403 Forbidden`

**Response Body**:
```json
{
  "success": false,
  "message": "You are not authorized to send messages in this conversation"
}
```

---

## ⚠️ Error Handling

- **400 Bad Request**: Message content is required for text messages
- **401 Unauthorized**: User not authenticated
- **403 Forbidden**: User is not authorized to send messages in this conversation
- **404 Not Found**: Conversation not found, or receiver not found
- **500 Internal Server Error**: Server error

---

## 📝 API Documentation

### `POST /chat/message`

**Description**: Send a text message or prescription message

**Role**: All authenticated users (patient, doctor, shop_owner, admin)

**Authentication**: Required (JWT token)

**Request Body**:
```json
{
  "receiver_id": "clxsarah123",
  "conversation_id": "clxconv123",
  "message": "Hello Sarah, I see you have a headache and fever...",
  "message_type": "text"
}
```

**Success Response**: `200 OK`

**Response Body**:
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "id": "clxmsg123",
    "message": "Hello Sarah, I see you have a headache and fever...",
    "message_type": "text",
    "created_at": "2024-01-01T12:10:00Z",
    "sender": {
      "id": "clxsam123",
      "name": "Dr. Sam Smith",
      "avatar_url": "https://example.com/avatars/sam.jpg"
    },
    "receiver": {
      "id": "clxsarah123",
      "name": "Sarah Johnson",
      "avatar_url": "https://example.com/avatars/sarah.jpg"
    }
  }
}
```

**WebSocket Events**:
- `message`: Emitted to conversation room and receiver's socket when message is sent
  - Event data includes full message object
  - Receiver receives this event in real-time
  - Frontend updates message list automatically

**Notes**:
- Only users who are part of the conversation can send messages
- Messages update conversation `updated_at` timestamp
- WebSocket events are emitted for real-time delivery
- Conversation list updates automatically when new messages are received

---

## 🎨 Frontend Implementation Guide

### Send Message Component (React/TypeScript Example)

```typescript
const handleSendMessage = async () => {
  if (!newMessage.trim()) return;

  try {
    const response = await fetch('/api/chat/message', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        receiver_id: otherUser.id,
        conversation_id: conversationId,
        message: newMessage,
        message_type: 'text',
      }),
    });

    const data = await response.json();

    if (data.success) {
      // Clear input
      setNewMessage('');
      
      // Add message to list (optimistic update)
      setMessages((prev) => [...prev, data.data]);
      
      // Scroll to bottom
      scrollToBottom();
    }
  } catch (error) {
    toast.error('Unable to send message. Please try again.');
  }
};

// Listen for new messages
useEffect(() => {
  if (!socket) return;

  socket.on('message', (data: { from: string; data: Message }) => {
    if (data.data.conversation_id === conversationId) {
      setMessages((prev) => [...prev, data.data]);
      scrollToBottom();
    }
  });

  return () => {
    socket.off('message');
  };
}, [socket, conversationId]);
```

---

## ✅ Summary

### What We Learned

1. **Message Sending**: Users can send text messages in conversations
2. **Real-Time Delivery**: Messages are delivered in real-time via WebSocket
3. **Conversation Updates**: Conversation `updated_at` timestamp is updated when messages are sent
4. **Conversation List Updates**: Conversation list updates automatically with last message preview
5. **Authorization**: Only users who are part of the conversation can send messages

### Key Takeaways

- ✅ Messages are sent via `POST /chat/message` API
- ✅ WebSocket events deliver messages in real-time
- ✅ Conversation list updates automatically when new messages are received
- ✅ Messages update conversation `updated_at` timestamp
- ✅ Only users who are part of the conversation can send messages

### Next Steps

- **Sam and Sarah**: Continue chatting in their private conversation
- **Sam**: Will create a prescription for Sarah (Chapter 9)
- **Prescription**: Will be automatically distributed to all shop owners (Chapter 9)

---

## 🎯 Next Chapter

**[Chapter 9: Creating Prescriptions - Prescription Creation and Automatic Distribution](#chapter-9-creating-prescriptions---prescription-creation-and-automatic-distribution)**

In the next chapter, we'll see how **Sam** creates a prescription for **Sarah**, and how the prescription is automatically distributed to all verified shop owners in the system.

---

# Chapter 9: Creating Prescriptions - Prescription Creation and Automatic Distribution

## 📖 Story Context

After chatting with **Sarah**, **Sam** decides to prescribe medicine for her. He creates a prescription message with patient name and medicine details, and sends it to Sarah. **Behind the scenes**, the prescription is automatically distributed to all verified shop owners (**Daniel** and **Dollar**). Each shop owner receives the prescription in their conversation list, ready to fulfill the order.

---

## 🎯 State Transition

**State**: `8` (Messages exchanged) → `9` (Prescription created and distributed)

---

## 👤 User Journey: Sam Creates Prescription for Sarah

### 🎬 Scene 1: Sam Creates Prescription

**User Action**: Sam clicks "Create Prescription" button in the conversation detail page.

**Frontend Action**: 
- Shows prescription form with fields:
  - Patient name: "Sarah Johnson"
  - Medicine details: Text input
  - Optional message: Text input
- Sam fills the form and clicks "Send Prescription"

**API Call**: `POST /chat/message`

**Request Body**:
```json
{
  "receiver_id": "clxsarah123",
  "conversation_id": "clxconv123",
  "message": "Prescription",
  "message_type": "prescription",
  "medicine_details": "Paracetamol 500mg - 2 tablets, 3 times daily for 5 days. Take after meals.",
  "patient_name": "Sarah Johnson"
}
```

---

### 🎬 Scene 2: Backend Processes Prescription

**Backend Flow**:
1. Validates JWT token and user authentication
2. Validates sender is a doctor and is approved
3. Validates prescription fields (medicine_details, patient_name)
4. Validates conversation exists and sender is part of it
5. Creates prescription message in patient-doctor conversation
6. Updates conversation `updated_at` timestamp
7. Emits WebSocket events to patient
8. **Distributes prescription to all verified shop owners** (automatic)

---

### 🎬 Scene 3: Prescription Distribution to Shop Owners

**Backend Flow** (Automatic):

1. **Find All Verified Shop Owners**:
   - Queries all users where:
     - `type = "shop_owner"`
     - `approved_at IS NOT NULL` (only verified shop owners)
     - `deleted_at IS NULL` (only active shop owners)

2. **For Each Shop Owner**:
   - **Find or Create Doctor-Shop Owner Conversation**:
     - Searches for existing `doctor_shop_owner` conversation
     - If exists: Reuses the conversation
     - If not exists: Creates new conversation with:
       - `creator_id`: doctorId (Sam)
       - `participant_id`: shopOwnerId (Daniel/Dollar)
       - `type`: `"doctor_shop_owner"`
       - `status`: `"open"`
   - **Create Prescription Message**:
     - Creates prescription message in doctor-shop_owner conversation
     - Same medicine_details and patient_name as patient prescription
     - Message type: `"prescription"`
   - **Update Conversation**:
     - Updates conversation `updated_at` timestamp
   - **Emit WebSocket Events**:
     - `message` event to conversation room
     - `message` event to shop owner's personal socket (if online)
     - `new_prescription` event to shop owner (notification)
     - `new_conversation` event (if new conversation was created)

3. **Log Results**:
   - Logs number of shop owners who received the prescription

---

### 🎬 Scene 4: Sarah Receives Prescription

**WebSocket Event**: `message`

**Event Data** (received by Sarah):
```json
{
  "from": "clxsam123",
  "data": {
    "id": "clxmsg456",
    "message": "Prescription",
    "message_type": "prescription",
    "medicine_details": "Paracetamol 500mg - 2 tablets, 3 times daily for 5 days. Take after meals.",
    "patient_name": "Sarah Johnson",
    "created_at": "2024-01-01T12:15:00Z",
    "sender": {
      "id": "clxsam123",
      "name": "Dr. Sam Smith",
      "avatar_url": "https://example.com/avatars/sam.jpg"
    }
  }
}
```

**Frontend Action** (Sarah's side): 
- Receives `message` WebSocket event
- Displays prescription message in conversation
- Shows medicine details and patient name
- Updates conversation list with prescription preview

**What Sarah Sees**: 
- Prescription message in conversation
- Medicine details: "Paracetamol 500mg - 2 tablets, 3 times daily for 5 days. Take after meals."
- Patient name: "Sarah Johnson"
- Can view prescription details

---

### 🎬 Scene 5: Shop Owners Receive Prescription

**WebSocket Events** (received by Daniel and Dollar):

1. **`new_prescription` Event**:
```json
{
  "prescription": {
    "id": "clxmsg789",
    "message": "Prescription",
    "message_type": "prescription",
    "medicine_details": "Paracetamol 500mg - 2 tablets, 3 times daily for 5 days. Take after meals.",
    "patient_name": "Sarah Johnson",
    "created_at": "2024-01-01T12:15:00Z",
    "sender": {
      "id": "clxsam123",
      "name": "Dr. Sam Smith",
      "avatar_url": "https://example.com/avatars/sam.jpg"
    }
  },
  "doctor": {
    "id": "clxsam123",
    "name": "Dr. Sam Smith"
  }
}
```

2. **`message` Event**:
```json
{
  "from": "clxsam123",
  "data": {
    "id": "clxmsg789",
    "message": "Prescription",
    "message_type": "prescription",
    "medicine_details": "Paracetamol 500mg - 2 tablets, 3 times daily for 5 days. Take after meals.",
    "patient_name": "Sarah Johnson",
    "created_at": "2024-01-01T12:15:00Z",
    "sender": {
      "id": "clxsam123",
      "name": "Dr. Sam Smith",
      "avatar_url": "https://example.com/avatars/sam.jpg"
    }
  }
}
```

**Frontend Action** (Daniel's and Dollar's side): 
- Receives `new_prescription` WebSocket event
- Shows notification: "New prescription from Dr. Sam Smith"
- Receives `message` WebSocket event
- Updates conversation list with prescription message
- Creates or updates doctor-shop_owner conversation
- Moves conversation to top of list

**What Daniel and Dollar See**: 
- Notification: "New prescription from Dr. Sam Smith"
- Conversation with Dr. Sam Smith appears in their conversation list
- Prescription message with medicine details and patient name
- Can view prescription details

---

## 🔄 Alternative Flows

### 🎬 Scene 6: Shop Owner Conversation Reuse

**Scenario**: Sam sends another prescription for a different patient (e.g., Patient Y).

**Backend Flow**:
- Searches for existing `doctor_shop_owner` conversation between Sam and Daniel
- Finds existing conversation (created when Sarah's prescription was sent)
- Reuses the same conversation (doesn't create a new one)
- Adds new prescription message to the existing conversation

**What Happens**: Same doctor-shop_owner conversation is reused for multiple prescriptions from the same doctor.

---

### 🎬 Scene 7: No Shop Owners Available

**Scenario**: Sam sends a prescription, but no verified shop owners exist in the system.

**Backend Flow**:
- Queries for verified shop owners
- Finds no shop owners (empty array)
- Logs: "No verified shop owners found to distribute prescription"
- Returns successfully (prescription still sent to patient)

**What Happens**: Prescription is sent to patient, but not distributed to shop owners.

---

## ⚠️ Error Handling

- **400 Bad Request**: Medicine details or patient name is required for prescription messages
- **401 Unauthorized**: User not authenticated
- **403 Forbidden**: User is not a doctor, or doctor account is not approved
- **404 Not Found**: Conversation not found, or receiver not found
- **500 Internal Server Error**: Server error (prescription distribution errors are logged but don't fail the main message creation)

---

## 📝 API Documentation

### `POST /chat/message` (Prescription)

**Description**: Send a prescription message (Doctor only)

**Role**: `doctor` (only doctors can create prescription messages)

**Authentication**: Required (JWT token)

**Request Body**:
```json
{
  "receiver_id": "clxsarah123",
  "conversation_id": "clxconv123",
  "message": "Prescription",
  "message_type": "prescription",
  "medicine_details": "Paracetamol 500mg - 2 tablets, 3 times daily for 5 days. Take after meals.",
  "patient_name": "Sarah Johnson"
}
```

**Success Response**: `200 OK`

**Response Body**:
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "id": "clxmsg456",
    "message": "Prescription",
    "message_type": "prescription",
    "medicine_details": "Paracetamol 500mg - 2 tablets, 3 times daily for 5 days. Take after meals.",
    "patient_name": "Sarah Johnson",
    "created_at": "2024-01-01T12:15:00Z",
    "sender": {
      "id": "clxsam123",
      "name": "Dr. Sam Smith",
      "avatar_url": "https://example.com/avatars/sam.jpg"
    },
    "receiver": {
      "id": "clxsarah123",
      "name": "Sarah Johnson",
      "avatar_url": "https://example.com/avatars/sarah.jpg"
    }
  }
}
```

**WebSocket Events**:
- `message`: Emitted to patient and shop owners when prescription is sent
  - Event data includes full prescription message object
  - Patient and shop owners receive this event in real-time
- `new_prescription`: Emitted to shop owners when prescription is distributed
  - Event data includes prescription and doctor information
  - Shop owners receive this event in real-time
- `new_conversation`: Emitted to shop owners when new doctor-shop_owner conversation is created
  - Event data includes conversation object
  - Shop owners receive this event in real-time

**Notes**:
- Only doctors can create prescription messages
- Prescription is automatically distributed to all verified shop owners
- Each shop owner gets a doctor-shop_owner conversation (reused if exists)
- Prescription distribution errors are logged but don't fail the main message creation
- Patient receives prescription in their patient-doctor conversation
- Shop owners receive prescription in their doctor-shop_owner conversation

---

## 🎨 Frontend Implementation Guide

### Create Prescription Component (React/TypeScript Example)

```typescript
const CreatePrescriptionForm = ({ conversationId, patientId, patientName }: { 
  conversationId: string; 
  patientId: string; 
  patientName: string; 
}) => {
  const [medicineDetails, setMedicineDetails] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { token } = useAuthContext();

  const handleSendPrescription = async () => {
    if (!medicineDetails.trim()) {
      toast.error('Medicine details are required');
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiver_id: patientId,
          conversation_id: conversationId,
          message: message || 'Prescription',
          message_type: 'prescription',
          medicine_details: medicineDetails,
          patient_name: patientName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Prescription sent successfully');
        setMedicineDetails('');
        setMessage('');
      } else {
        toast.error(data.message || 'Failed to send prescription');
      }
    } catch (error) {
      toast.error('Unable to send prescription. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="prescription-form">
      <h3>Create Prescription</h3>
      <div className="form-group">
        <label>Patient Name</label>
        <input type="text" value={patientName} disabled />
      </div>
      <div className="form-group">
        <label>Medicine Details *</label>
        <textarea
          value={medicineDetails}
          onChange={(e) => setMedicineDetails(e.target.value)}
          placeholder="Paracetamol 500mg - 2 tablets, 3 times daily for 5 days. Take after meals."
          rows={5}
        />
      </div>
      <div className="form-group">
        <label>Optional Message</label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Prescription"
        />
      </div>
      <button onClick={handleSendPrescription} disabled={isSending}>
        {isSending ? 'Sending...' : 'Send Prescription'}
      </button>
    </div>
  );
};
```

### WebSocket Event Handling (Shop Owner Side)

```typescript
// Listen for new prescription events
useEffect(() => {
  if (!socket) return;

  socket.on('new_prescription', (data: { prescription: Message; doctor: { id: string; name: string } }) => {
    // Show notification
    toast.info(`New prescription from ${data.doctor.name}`);
    
    // Update conversation list
    // Conversation will appear in list automatically
  });

  socket.on('message', (data: { from: string; data: Message }) => {
    if (data.data.message_type === 'prescription') {
      // Update conversation list with prescription
      updateConversationList(data.data);
    }
  });

  return () => {
    socket.off('new_prescription');
    socket.off('message');
  };
}, [socket]);
```

---

## ✅ Summary

### What We Learned

1. **Prescription Creation**: Doctors can create prescription messages with medicine details and patient name
2. **Automatic Distribution**: Prescriptions are automatically distributed to all verified shop owners
3. **Conversation Reuse**: Same doctor-shop_owner conversation is reused for multiple prescriptions from the same doctor
4. **Real-Time Notifications**: Shop owners receive real-time notifications when prescriptions are distributed
5. **Authorization**: Only approved doctors can create prescription messages

### Key Takeaways

- ✅ Only doctors can create prescription messages
- ✅ Prescriptions are automatically distributed to all verified shop owners
- ✅ Each shop owner gets a doctor-shop_owner conversation (reused if exists)
- ✅ Shop owners receive real-time notifications via WebSocket
- ✅ Patient receives prescription in their patient-doctor conversation
- ✅ Prescription distribution errors don't fail the main message creation

### Next Steps

- **Sarah**: Receives prescription and can view medicine details (State 9)
- **Daniel and Dollar**: Receive prescription in their conversation list (State 9)
- **Shop Owners**: Can view prescriptions in their conversation list (Chapter 10)

---

## 🎯 Next Chapter

**[Chapter 10: Shop Owner Conversation List and Prescriptions - No Dashboard, Conversation List is Primary](#chapter-10-shop-owner-conversation-list-and-prescriptions---no-dashboard-conversation-list-is-primary)**

In the next chapter, we'll see how **Daniel** and **Dollar** view their conversation list with doctors, and how they can view prescriptions they've received.

---

# Chapter 10: Shop Owner Conversation List and Prescriptions

## 📖 Story Context

After **Sam** created a prescription for **Sarah**, the prescription was automatically distributed to all verified shop owners. **Daniel** (Shop Owner 1) receives a real-time notification and views his conversation list. He sees a new conversation with **Dr. Sam Smith** containing the prescription. He can view the prescription details and prepare to fulfill the order. **Dollar** (Shop Owner 2) also receives the same prescription in his conversation list.

---

## 🎯 State Transition

**State**: `9` (Prescription created and distributed) → `10` (Shop owners view prescriptions)

---

## 👤 User Journey: Daniel Views Conversation List and Prescriptions

### 🎬 Scene 1: Daniel Receives Real-Time Notification

**WebSocket Event**: `new_prescription` (from Chapter 9)

**Event Data** (received by Daniel):
```json
{
  "prescription": {
    "id": "clxmsg789",
    "message": "Prescription",
    "message_type": "prescription",
    "medicine_details": "Paracetamol 500mg - 2 tablets, 3 times daily for 5 days. Take after meals.",
    "patient_name": "Sarah Johnson",
    "created_at": "2024-01-01T12:15:00Z",
    "sender": {
      "id": "clxsam123",
      "name": "Dr. Sam Smith",
      "avatar_url": "https://example.com/avatars/sam.jpg"
    }
  },
  "doctor": {
    "id": "clxsam123",
    "name": "Dr. Sam Smith"
  }
}
```

**Frontend Action**: 
- Receives `new_prescription` WebSocket event
- Shows notification: "New prescription from Dr. Sam Smith"
- Updates conversation list in real-time
- Creates or updates doctor-shop_owner conversation

**What Daniel Sees**: 
- Notification: "New prescription from Dr. Sam Smith"
- Conversation with Dr. Sam Smith appears in conversation list

---

### 🎬 Scene 2: Daniel Clicks "Inbox" Button

**User Action**: Daniel clicks the "Inbox" button in the navbar.

**Frontend Action**: 
- Navigation to conversation list page
- Calls API: `GET /chat/conversation`
- Shows loading state

**API Call**: `GET /chat/conversation`

**Response Body**:
```json
{
  "success": true,
  "data": [
    {
      "id": "clxconv456",
      "creator_id": "clxsam123",
      "participant_id": "clxdaniel123",
      "type": "doctor_shop_owner",
      "status": "open",
      "created_at": "2024-01-01T12:15:00Z",
      "updated_at": "2024-01-01T12:15:00Z",
      "creator": {
        "id": "clxsam123",
        "name": "Dr. Sam Smith",
        "avatar_url": "https://example.com/avatars/sam.jpg"
      },
      "participant": {
        "id": "clxdaniel123",
        "name": "Daniel Pharmacy",
        "avatar_url": "https://example.com/avatars/daniel.jpg"
      },
      "messages": [
        {
          "id": "clxmsg789",
          "message": "Prescription",
          "message_type": "prescription",
          "created_at": "2024-01-01T12:15:00Z"
        }
      ]
    }
  ],
  "count": 1
}
```

**What Daniel Sees**: 
- Conversation list with Dr. Sam Smith
- Last message preview: "Prescription"
- Conversation type: "doctor_shop_owner"
- Can click on conversation to view prescription details

---

### 🎬 Scene 3: Daniel Views Conversation Detail Page

**User Action**: Daniel clicks on the conversation with Dr. Sam Smith.

**Frontend Action**: 
- Navigation to conversation detail page: `/chat/conversation/clxconv456`
- Calls API: `GET /chat/conversation/:id`
- Calls API: `GET /chat/message?conversation_id=clxconv456`

**API Call**: `GET /chat/conversation/clxconv456`

**Response Body**:
```json
{
  "success": true,
  "data": {
    "id": "clxconv456",
    "creator_id": "clxsam123",
    "participant_id": "clxdaniel123",
    "type": "doctor_shop_owner",
    "status": "open",
    "created_at": "2024-01-01T12:15:00Z",
    "updated_at": "2024-01-01T12:15:00Z",
    "creator": {
      "id": "clxsam123",
      "name": "Dr. Sam Smith",
      "avatar_url": "https://example.com/avatars/sam.jpg"
    },
    "participant": {
      "id": "clxdaniel123",
      "name": "Daniel Pharmacy",
      "avatar_url": "https://example.com/avatars/daniel.jpg"
    },
    "messages": [
      {
        "id": "clxmsg789",
        "message": "Prescription",
        "message_type": "prescription",
        "created_at": "2024-01-01T12:15:00Z"
      }
    ]
  }
}
```

**What Daniel Sees**: 
- Conversation header with Dr. Sam Smith's name and avatar
- Prescription message in conversation
- Medicine details: "Paracetamol 500mg - 2 tablets, 3 times daily for 5 days. Take after meals."
- Patient name: "Sarah Johnson"
- Can view full prescription details

---

### 🎬 Scene 4: Daniel Views All Prescriptions

**User Action**: Daniel clicks "View All Prescriptions" or navigates to prescriptions page.

**Frontend Action**: 
- Calls API: `GET /chat/shop-owner/prescriptions`

**API Call**: `GET /chat/shop-owner/prescriptions?limit=20`

**Response Body**:
```json
{
  "success": true,
  "data": [
    {
      "id": "clxmsg789",
      "message": "Prescription",
      "message_type": "prescription",
      "medicine_details": "Paracetamol 500mg - 2 tablets, 3 times daily for 5 days. Take after meals.",
      "patient_name": "Sarah Johnson",
      "created_at": "2024-01-01T12:15:00Z",
      "sender": {
        "id": "clxsam123",
        "name": "Dr. Sam Smith",
        "avatar_url": "https://example.com/avatars/sam.jpg"
      },
      "receiver": {
        "id": "clxdaniel123",
        "name": "Daniel Pharmacy",
        "avatar_url": "https://example.com/avatars/daniel.jpg"
      },
      "conversation": {
        "id": "clxconv456",
        "type": "doctor_shop_owner",
        "status": "open"
      }
    }
  ],
  "count": 1
}
```

**What Daniel Sees**: 
- List of all prescriptions he has received
- Each prescription shows:
  - Doctor name: "Dr. Sam Smith"
  - Patient name: "Sarah Johnson"
  - Medicine details: "Paracetamol 500mg - 2 tablets, 3 times daily for 5 days. Take after meals."
  - Timestamp: "Just now"
- Can click on prescription to view details

---

### 🎬 Scene 5: Daniel Views Prescription Details

**User Action**: Daniel clicks on a prescription to view full details.

**Frontend Action**: 
- Calls API: `GET /chat/shop-owner/prescriptions/:id`

**API Call**: `GET /chat/shop-owner/prescriptions/clxmsg789`

**Response Body**:
```json
{
  "success": true,
  "data": {
    "id": "clxmsg789",
    "message": "Prescription",
    "message_type": "prescription",
    "medicine_details": "Paracetamol 500mg - 2 tablets, 3 times daily for 5 days. Take after meals.",
    "patient_name": "Sarah Johnson",
    "created_at": "2024-01-01T12:15:00Z",
    "sender": {
      "id": "clxsam123",
      "name": "Dr. Sam Smith",
      "avatar_url": "https://example.com/avatars/sam.jpg"
    },
    "receiver": {
      "id": "clxdaniel123",
      "name": "Daniel Pharmacy",
      "avatar_url": "https://example.com/avatars/daniel.jpg"
    },
    "conversation": {
      "id": "clxconv456",
      "type": "doctor_shop_owner",
      "status": "open"
    }
  }
}
```

**What Daniel Sees**: 
- Full prescription details:
  - Doctor: "Dr. Sam Smith"
  - Patient: "Sarah Johnson"
  - Medicine: "Paracetamol 500mg - 2 tablets, 3 times daily for 5 days. Take after meals."
  - Timestamp: "2024-01-01T12:15:00Z"
- Can prepare to fulfill the order

---

## 🔄 Alternative Flows

### 🎬 Scene 6: Dollar Also Receives Prescription

**User Action**: Dollar (Shop Owner 2) also receives the prescription.

**Frontend Action**: 
- Same flow as Daniel
- Dollar receives `new_prescription` WebSocket event
- Dollar sees conversation with Dr. Sam Smith in his conversation list
- Dollar can view prescription details

**What Dollar Sees**: 
- Conversation with Dr. Sam Smith
- Prescription message with medicine details and patient name
- Can view prescription details

---

### 🎬 Scene 7: Multiple Prescriptions from Same Doctor

**Scenario**: Sam sends another prescription for a different patient.

**Backend Flow**:
- Same doctor-shop_owner conversation is reused
- New prescription message is added to the existing conversation
- Conversation `updated_at` timestamp is updated

**What Daniel Sees**: 
- Same conversation with Dr. Sam Smith
- Multiple prescription messages in the conversation
- Conversation moves to top of list (most recently updated)

---

## ⚠️ Error Handling

- **401 Unauthorized**: User not authenticated
- **403 Forbidden**: User is not a shop owner, or shop owner account is not verified
- **404 Not Found**: Prescription not found, or shop owner not found
- **500 Internal Server Error**: Server error

---

## 📝 API Documentation

### `GET /chat/shop-owner/prescriptions`

**Description**: Get all prescriptions for the authenticated shop owner

**Role**: `shop_owner` (only shop owners can access this endpoint)

**Authentication**: Required (JWT token)

**Query Parameters**:
- `limit`: Number of prescriptions to fetch (default: 20, optional)
- `cursor`: Cursor for pagination (optional)

**Success Response**: `200 OK`

**Response Body**:
```json
{
  "success": true,
  "data": [
    {
      "id": "clxmsg789",
      "message": "Prescription",
      "message_type": "prescription",
      "medicine_details": "Paracetamol 500mg - 2 tablets, 3 times daily for 5 days. Take after meals.",
      "patient_name": "Sarah Johnson",
      "created_at": "2024-01-01T12:15:00Z",
      "sender": {
        "id": "clxsam123",
        "name": "Dr. Sam Smith",
        "avatar_url": "https://example.com/avatars/sam.jpg"
      },
      "receiver": {
        "id": "clxdaniel123",
        "name": "Daniel Pharmacy",
        "avatar_url": "https://example.com/avatars/daniel.jpg"
      },
      "conversation": {
        "id": "clxconv456",
        "type": "doctor_shop_owner",
        "status": "open"
      }
    }
  ],
  "count": 1
}
```

**Notes**:
- Returns only prescriptions where shop owner is receiver
- Prescriptions are ordered by `created_at` DESC (most recent first)
- Supports pagination with `limit` and `cursor` parameters

---

### `GET /chat/shop-owner/prescriptions/:id`

**Description**: Get a single prescription by ID

**Role**: `shop_owner` (only shop owners can access this endpoint)

**Authentication**: Required (JWT token)

**Success Response**: `200 OK`

**Response Body**: Same as `GET /chat/shop-owner/prescriptions` but returns a single prescription object

---

### `GET /chat/shop-owner/conversations`

**Description**: Get all conversations with doctors for the authenticated shop owner

**Role**: `shop_owner` (only shop owners can access this endpoint)

**Authentication**: Required (JWT token)

**Success Response**: `200 OK`

**Response Body**: Same as `GET /chat/conversation` but filtered to `doctor_shop_owner` type conversations

**Notes**:
- Returns only `doctor_shop_owner` type conversations
- Conversations are ordered by `updated_at` DESC (most recently updated first)
- Last message preview is included for each conversation

---

## 🎨 Frontend Implementation Guide

### Shop Owner Conversation List (React/TypeScript Example)

```typescript
const ShopOwnerConversationList = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, token } = useAuthContext();
  const router = useRouter();
  const socket = useSocket();

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('new_prescription', (data: { prescription: Message; doctor: { id: string; name: string } }) => {
      toast.info(`New prescription from ${data.doctor.name}`);
      fetchConversations(); // Refresh conversation list
    });

    socket.on('message', (data: { from: string; data: Message }) => {
      if (data.data.message_type === 'prescription') {
        fetchConversations(); // Refresh conversation list
      }
    });

    return () => {
      socket.off('new_prescription');
      socket.off('message');
    };
  }, [socket]);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/chat/conversation', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        // Filter to only doctor-shop_owner conversations
        const doctorConversations = data.data.filter(
          (c: Conversation) => c.type === 'doctor_shop_owner'
        );
        setConversations(doctorConversations);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of component (similar to patient conversation list)
};
```

---

## ✅ Summary

### What We Learned

1. **Conversation List**: Shop owners view their conversation list with doctors (no dashboard)
2. **Prescription Viewing**: Shop owners can view prescriptions in conversations or via prescription endpoints
3. **Real-Time Updates**: Shop owners receive real-time notifications when prescriptions are distributed
4. **Conversation Reuse**: Same doctor-shop_owner conversation is reused for multiple prescriptions
5. **Authorization**: Only verified shop owners can view prescriptions

### Key Takeaways

- ✅ Shop owners don't have a dashboard - conversation list is primary interface
- ✅ Shop owners can view prescriptions in conversations or via prescription endpoints
- ✅ Shop owners receive real-time notifications when prescriptions are distributed
- ✅ Same doctor-shop_owner conversation is reused for multiple prescriptions
- ✅ Only verified shop owners can view prescriptions

### Next Steps

- **Daniel and Dollar**: Can view prescriptions and prepare to fulfill orders
- **Admin**: Can monitor system activities and manage user verifications (Chapter 11)

---

## 🎯 Next Chapter

**[Chapter 11: Admin Dashboard - System Monitoring and User Verification](#chapter-11-admin-dashboard---system-monitoring-and-user-verification)**

In the next chapter, we'll see how **Admin** monitors system activities, manages user verifications (doctors and shop owners), and views system statistics.

---

# Chapter 11: Admin Dashboard - System Monitoring and User Verification

## 📖 Story Context

**Admin** logs into the platform and accesses the admin dashboard. The admin can view system statistics, manage user verifications (approve/reject doctors and shop owners), and monitor system activities (conversations, prescriptions, broadcasts). This is the only role that has access to a dashboard - all other roles use conversation lists as their primary interface.

---

## 🎯 State Transition

**State**: `10` (Shop owners view prescriptions) → `11` (Admin monitors system)

---

## 👤 User Journey: Admin Monitors System

### 🎬 Scene 1: Admin Views System Statistics

**User Action**: Admin logs in and views the dashboard.

**Frontend Action**: 
- Navigation to admin dashboard
- Calls API: `GET /admin/user/statistics`
- Shows loading state

**API Call**: `GET /admin/user/statistics`

**Response Body**:
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 10,
      "by_type": {
        "patient": 5,
        "doctor": 3,
        "shop_owner": 2,
        "admin": 1
      }
    },
    "approved_users": {
      "total": 8,
      "by_type": {
        "patient": 5,
        "doctor": 2,
        "shop_owner": 1,
        "admin": 1
      }
    },
    "pending_verifications": {
      "total": 2,
      "by_type": {
        "doctor": 1,
        "shop_owner": 1
      }
    },
    "conversations": {
      "total": 15
    },
    "prescriptions": {
      "total": 8
    },
    "broadcasts": {
      "total": 10,
      "open": 2,
      "assisted": 8
    }
  }
}
```

**What Admin Sees**: 
- System statistics dashboard with:
  - Total users: 10 (5 patients, 3 doctors, 2 shop owners, 1 admin)
  - Approved users: 8 (5 patients, 2 doctors, 1 shop owner, 1 admin)
  - Pending verifications: 2 (1 doctor, 1 shop owner)
  - Total conversations: 15
  - Total prescriptions: 8
  - Total broadcasts: 10 (2 open, 8 assisted)

---

### 🎬 Scene 2: Admin Views Pending Verifications

**User Action**: Admin clicks "Pending Verifications" to see doctors and shop owners waiting for approval.

**Frontend Action**: 
- Calls API: `GET /admin/user/verifications/pending`
- Shows loading state

**API Call**: `GET /admin/user/verifications/pending`

**Response Body**:
```json
{
  "success": true,
  "data": [
    {
      "id": "clxparker123",
      "name": "Dr. Parker Williams",
      "email": "parker@example.com",
      "type": "doctor",
      "approved_at": null,
      "created_at": "2024-01-01T10:00:00Z",
      "avatar_url": "https://example.com/avatars/parker.jpg"
    },
    {
      "id": "clxdollar123",
      "name": "Dollar Pharmacy",
      "email": "dollar@example.com",
      "type": "shop_owner",
      "approved_at": null,
      "created_at": "2024-01-01T11:00:00Z",
      "avatar_url": "https://example.com/avatars/dollar.jpg"
    }
  ],
  "count": 2
}
```

**What Admin Sees**: 
- List of pending verifications:
  - Dr. Parker Williams (doctor) - waiting for approval
  - Dollar Pharmacy (shop_owner) - waiting for approval
- Can approve or reject each user

---

### 🎬 Scene 3: Admin Approves Doctor

**User Action**: Admin clicks "Approve" on Dr. Parker Williams.

**Frontend Action**: 
- Calls API: `POST /admin/user/:id/approve`
- Shows loading state

**API Call**: `POST /admin/user/clxparker123/approve`

**Response Body**:
```json
{
  "success": true,
  "message": "User (doctor) approved successfully"
}
```

**Backend Flow**:
- Validates user exists
- Validates user is a doctor or shop owner
- Validates user is not already approved
- Sets `approved_at` timestamp to current time
- Returns success message

**What Admin Sees**: 
- Success message: "User (doctor) approved successfully"
- Dr. Parker Williams is removed from pending verifications list
- System statistics updated (approved_users count increased)

---

### 🎬 Scene 4: Admin Rejects Shop Owner

**User Action**: Admin clicks "Reject" on Dollar Pharmacy.

**Frontend Action**: 
- Calls API: `POST /admin/user/:id/reject`
- Shows loading state

**API Call**: `POST /admin/user/clxdollar123/reject`

**Response Body**:
```json
{
  "success": true,
  "message": "User (shop_owner) rejected successfully"
}
```

**Backend Flow**:
- Validates user exists
- Validates user is a doctor or shop owner
- Sets `approved_at` timestamp to null
- Returns success message

**What Admin Sees**: 
- Success message: "User (shop_owner) rejected successfully"
- Dollar Pharmacy is removed from pending verifications list
- System statistics updated (pending_verifications count decreased)

---

### 🎬 Scene 5: Admin Views All Conversations

**User Action**: Admin clicks "View All Conversations" to monitor system activities.

**Frontend Action**: 
- Calls API: `GET /admin/user/conversations?limit=20`

**API Call**: `GET /admin/user/conversations?limit=20`

**Response Body**:
```json
{
  "success": true,
  "data": [
    {
      "id": "clxconv123",
      "creator_id": "clxsarah123",
      "participant_id": "clxsam123",
      "type": "patient_doctor",
      "status": "open",
      "created_at": "2024-01-01T12:00:00Z",
      "updated_at": "2024-01-01T12:15:00Z",
      "creator": {
        "id": "clxsarah123",
        "name": "Sarah Johnson",
        "type": "patient",
        "avatar_url": "https://example.com/avatars/sarah.jpg"
      },
      "participant": {
        "id": "clxsam123",
        "name": "Dr. Sam Smith",
        "type": "doctor",
        "avatar_url": "https://example.com/avatars/sam.jpg"
      },
      "messages": [
        {
          "id": "clxmsg123",
          "message": "Hello, how are you?",
          "message_type": "text",
          "created_at": "2024-01-01T12:15:00Z"
        }
      ]
    },
    {
      "id": "clxconv456",
      "creator_id": "clxsam123",
      "participant_id": "clxdaniel123",
      "type": "doctor_shop_owner",
      "status": "open",
      "created_at": "2024-01-01T12:15:00Z",
      "updated_at": "2024-01-01T12:15:00Z",
      "creator": {
        "id": "clxsam123",
        "name": "Dr. Sam Smith",
        "type": "doctor",
        "avatar_url": "https://example.com/avatars/sam.jpg"
      },
      "participant": {
        "id": "clxdaniel123",
        "name": "Daniel Pharmacy",
        "type": "shop_owner",
        "avatar_url": "https://example.com/avatars/daniel.jpg"
      },
      "messages": [
        {
          "id": "clxmsg789",
          "message": "Prescription",
          "message_type": "prescription",
          "created_at": "2024-01-01T12:15:00Z"
        }
      ]
    }
  ],
  "count": 2
}
```

**What Admin Sees**: 
- List of all conversations in the system:
  - Patient-doctor conversations (e.g., Sarah ↔ Dr. Sam Smith)
  - Doctor-shop_owner conversations (e.g., Dr. Sam Smith ↔ Daniel Pharmacy)
- Each conversation shows:
  - Creator and participant information
  - Conversation type and status
  - Last message preview
  - Timestamps

---

### 🎬 Scene 6: Admin Views All Prescriptions

**User Action**: Admin clicks "View All Prescriptions" to monitor prescription activities.

**Frontend Action**: 
- Calls API: `GET /admin/user/prescriptions?limit=20`

**API Call**: `GET /admin/user/prescriptions?limit=20`

**Response Body**:
```json
{
  "success": true,
  "data": [
    {
      "id": "clxmsg789",
      "message": "Prescription",
      "message_type": "prescription",
      "medicine_details": "Paracetamol 500mg - 2 tablets, 3 times daily for 5 days. Take after meals.",
      "patient_name": "Sarah Johnson",
      "created_at": "2024-01-01T12:15:00Z",
      "sender": {
        "id": "clxsam123",
        "name": "Dr. Sam Smith",
        "type": "doctor",
        "avatar_url": "https://example.com/avatars/sam.jpg"
      },
      "receiver": {
        "id": "clxdaniel123",
        "name": "Daniel Pharmacy",
        "type": "shop_owner",
        "avatar_url": "https://example.com/avatars/daniel.jpg"
      },
      "conversation": {
        "id": "clxconv456",
        "type": "doctor_shop_owner",
        "status": "open"
      }
    }
  ],
  "count": 1
}
```

**What Admin Sees**: 
- List of all prescriptions in the system:
  - Prescription details (medicine, patient name)
  - Doctor who created the prescription
  - Shop owner who received the prescription
  - Conversation information
  - Timestamps

---

### 🎬 Scene 7: Admin Views All Broadcasts

**User Action**: Admin clicks "View All Broadcasts" to monitor broadcast activities.

**Frontend Action**: 
- Calls API: `GET /admin/user/broadcasts?limit=20`

**API Call**: `GET /admin/user/broadcasts?limit=20`

**Response Body**:
```json
{
  "success": true,
  "data": [
    {
      "id": "clxbroadcast123",
      "patient_id": "clxsarah123",
      "message": "I have a severe headache and fever.",
      "status": "assisted",
      "assisted_by": "clxsam123",
      "conversation_id": "clxconv123",
      "created_at": "2024-01-01T12:00:00Z",
      "updated_at": "2024-01-01T12:05:00Z",
      "patient": {
        "id": "clxsarah123",
        "name": "Sarah Johnson",
        "type": "patient",
        "avatar_url": "https://example.com/avatars/sarah.jpg"
      }
    },
    {
      "id": "clxbroadcast456",
      "patient_id": "clxpatient456",
      "message": "I need help with my prescription.",
      "status": "open",
      "assisted_by": null,
      "conversation_id": null,
      "created_at": "2024-01-01T13:00:00Z",
      "updated_at": "2024-01-01T13:00:00Z",
      "patient": {
        "id": "clxpatient456",
        "name": "Patient 456",
        "type": "patient",
        "avatar_url": "https://example.com/avatars/patient456.jpg"
      }
    }
  ],
  "count": 2
}
```

**What Admin Sees**: 
- List of all broadcasts in the system:
  - Broadcast message
  - Patient who created the broadcast
  - Broadcast status (open, assisted, closed)
  - Doctor who assisted (if any)
  - Linked conversation (if any)
  - Timestamps

---

## 🔄 Alternative Flows

### 🎬 Scene 8: Admin Views All Users

**User Action**: Admin clicks "View All Users" to see all registered users.

**Frontend Action**: 
- Calls API: `GET /admin/user?type=doctor&approved=approved`

**API Call**: `GET /admin/user?type=doctor&approved=approved`

**Response Body**: List of all approved doctors with filtering options

**What Admin Sees**: 
- List of all users (filtered by type and approval status)
- Can filter by:
  - User type (patient, doctor, shop_owner, admin)
  - Approval status (approved, pending)
  - Search query (name or email)

---

## ⚠️ Error Handling

- **401 Unauthorized**: User not authenticated
- **403 Forbidden**: User is not an admin
- **404 Not Found**: User not found, or resource not found
- **400 Bad Request**: User is already approved/rejected, or user type does not require approval
- **500 Internal Server Error**: Server error

---

## 📝 API Documentation

### `GET /admin/user/statistics`

**Description**: Get system statistics (Admin only)

**Role**: `admin` (only admins can access this endpoint)

**Authentication**: Required (JWT token)

**Success Response**: `200 OK`

**Response Body**: System statistics including user counts, conversation counts, prescription counts, and broadcast counts

---

### `GET /admin/user/verifications/pending`

**Description**: Get pending verification requests (Admin only)

**Role**: `admin` (only admins can access this endpoint)

**Authentication**: Required (JWT token)

**Success Response**: `200 OK`

**Response Body**: List of doctors and shop owners waiting for approval

---

### `POST /admin/user/:id/approve`

**Description**: Approve a user (doctor or shop owner) (Admin only)

**Role**: `admin` (only admins can access this endpoint)

**Authentication**: Required (JWT token)

**Success Response**: `200 OK`

**Response Body**:
```json
{
  "success": true,
  "message": "User (doctor) approved successfully"
}
```

---

### `POST /admin/user/:id/reject`

**Description**: Reject a user (doctor or shop owner) (Admin only)

**Role**: `admin` (only admins can access this endpoint)

**Authentication**: Required (JWT token)

**Success Response**: `200 OK`

**Response Body**:
```json
{
  "success": true,
  "message": "User (shop_owner) rejected successfully"
}
```

---

### `GET /admin/user/conversations`

**Description**: Get all conversations (Admin view-only)

**Role**: `admin` (only admins can access this endpoint)

**Authentication**: Required (JWT token)

**Query Parameters**:
- `limit`: Number of conversations to fetch (default: 20, optional)
- `cursor`: Cursor for pagination (optional)

**Success Response**: `200 OK`

**Response Body**: List of all conversations in the system

---

### `GET /admin/user/prescriptions`

**Description**: Get all prescriptions (Admin view-only)

**Role**: `admin` (only admins can access this endpoint)

**Authentication**: Required (JWT token)

**Query Parameters**:
- `limit`: Number of prescriptions to fetch (default: 20, optional)
- `cursor`: Cursor for pagination (optional)

**Success Response**: `200 OK`

**Response Body**: List of all prescriptions in the system

---

### `GET /admin/user/broadcasts`

**Description**: Get all broadcasts (Admin view-only)

**Role**: `admin` (only admins can access this endpoint)

**Authentication**: Required (JWT token)

**Query Parameters**:
- `limit`: Number of broadcasts to fetch (default: 20, optional)
- `cursor`: Cursor for pagination (optional)

**Success Response**: `200 OK`

**Response Body**: List of all broadcasts in the system

---

### `GET /admin/user`

**Description**: Get all users (Admin only)

**Role**: `admin` (only admins can access this endpoint)

**Authentication**: Required (JWT token)

**Query Parameters**:
- `q`: Search query (name or email, optional)
- `type`: User type filter (patient, doctor, shop_owner, admin, optional)
- `approved`: Approval status filter (approved, pending, optional)

**Success Response**: `200 OK`

**Response Body**: List of all users (filtered by query parameters)

---

## ✅ Summary

### What We Learned

1. **Admin Dashboard**: Only admin has access to a dashboard for system monitoring
2. **User Verification**: Admin can approve/reject doctors and shop owners
3. **System Monitoring**: Admin can view all conversations, prescriptions, and broadcasts
4. **System Statistics**: Admin can view system statistics (user counts, conversation counts, etc.)
5. **View-Only Access**: Admin has view-only access to system activities (cannot modify conversations, prescriptions, or broadcasts)

### Key Takeaways

- ✅ Only admin has access to a dashboard - all other roles use conversation lists
- ✅ Admin can approve/reject doctors and shop owners
- ✅ Admin can view all system activities (conversations, prescriptions, broadcasts)
- ✅ Admin can view system statistics
- ✅ Admin has view-only access to system activities

### Next Steps

- **Admin**: Can continue monitoring system activities and managing user verifications
- **Complete Flow**: See Chapter 12 for the complete end-to-end journey

---

## 🎯 Next Chapter

**[Chapter 12: Complete Flow - End-to-End Journey](#chapter-12-complete-flow---end-to-end-journey)**

In the next chapter, we'll see the complete end-to-end journey from registration to prescription, covering all state transitions, API calls, and WebSocket events.

---

# Chapter 12: Complete Flow - End-to-End Journey

## 📖 Overview

This chapter provides a comprehensive overview of the complete end-to-end journey in **QuickMed Connect**, from user registration to prescription delivery. We'll follow all our characters as they interact with the platform, showing how all the pieces fit together.

---

## 🎯 Complete State Transition Flow

```
State 0 (Not Registered)
    ↓
[Chapter 1: Registration]
    ↓
State 1 (Registered but Not Authenticated)
    ↓
[Chapter 2: Authentication]
    ↓
State 2 (Authenticated)
    ↓
[Chapter 3: Patient Sends Broadcast]
    ↓
State 3 (Broadcast Created)
    ↓
[Chapter 4: Patient Views Inbox (Empty)]
    ↓
State 4 (Inbox Loaded - Empty)
    ↓
[Chapter 5: Doctors See Broadcast]
    ↓
State 5 (Doctors See Broadcast)
    ↓
[Chapter 6: Doctor Responds]
    ↓
State 6 (Conversation Created)
    ↓
[Chapter 7: Conversation Loaded]
    ↓
State 7 (Conversation Loaded)
    ↓
[Chapter 8: Messages Exchanged]
    ↓
State 8 (Messages Exchanged)
    ↓
[Chapter 9: Prescription Created]
    ↓
State 9 (Prescription Created)
    ↓
[Chapter 10: Shop Owners Receive Prescription]
    ↓
State 10 (Shop Owners View Prescription)
    ↓
[Chapter 11: Admin Monitors System]
    ↓
State 11 (Admin Monitors System)
```

---

## 🎭 Complete Journey with All Characters

### 👤 Sarah (Patient) Journey

1. **Registration** (Chapter 1)
   - Sarah registers as a patient
   - API: `POST /auth/register`
   - State: 0 → 1

2. **Authentication** (Chapter 2)
   - Sarah logs in
   - API: `POST /auth/login`
   - WebSocket: Connects with JWT token
   - State: 1 → 2

3. **Sends Broadcast** (Chapter 3)
   - Sarah sends a broadcast from landing page
   - API: `POST /chat/broadcast`
   - WebSocket: `new_broadcast` event (to all doctors)
   - State: 2 → 3

4. **Views Inbox** (Chapter 4)
   - Sarah clicks "Inbox" button
   - API: `GET /chat/conversation`
   - Inbox is empty (no conversations yet)
   - State: 3 → 4

5. **Receives Conversation** (Chapter 6)
   - Sarah receives real-time notification
   - WebSocket: `conversation` event
   - Conversation appears in inbox
   - State: 4 → 6

6. **Views Conversation** (Chapter 7)
   - Sarah opens conversation with Sam
   - API: `GET /chat/conversation/:id`
   - API: `GET /chat/message?conversation_id=:id`
   - State: 6 → 7

7. **Exchanges Messages** (Chapter 8)
   - Sarah and Sam exchange messages
   - API: `POST /chat/message`
   - WebSocket: `message` event (real-time)
   - State: 7 → 8

8. **Receives Prescription** (Chapter 9)
   - Sarah receives prescription from Sam
   - WebSocket: `message` event (prescription)
   - Prescription appears in conversation
   - State: 8 → 9

---

### 👨‍⚕️ Sam (Doctor 1) Journey

1. **Registration** (Chapter 1)
   - Sam registers as a doctor
   - API: `POST /auth/register`
   - State: 0 → 1 (pending approval)

2. **Admin Approval** (Chapter 11)
   - Admin approves Sam
   - API: `POST /admin/user/:id/approve`
   - State: 1 → 1 (approved)

3. **Authentication** (Chapter 2)
   - Sam logs in
   - API: `POST /auth/login`
   - WebSocket: Connects with JWT token
   - State: 1 → 2

4. **Views Broadcast Inbox** (Chapter 5)
   - Sam views broadcast inbox
   - API: `GET /chat/broadcast/inbox`
   - Sees Sarah's broadcast
   - State: 2 → 5

5. **Responds to Broadcast** (Chapter 6)
   - Sam responds to Sarah's broadcast
   - API: `POST /chat/conversation/broadcast/:broadcastId/respond`
   - WebSocket: `broadcast_updated` event (to all doctors)
   - WebSocket: `conversation` event (to Sarah and Sam)
   - State: 5 → 6

6. **Views Conversation** (Chapter 7)
   - Sam opens conversation with Sarah
   - API: `GET /chat/conversation/:id`
   - API: `GET /chat/message?conversation_id=:id`
   - State: 6 → 7

7. **Exchanges Messages** (Chapter 8)
   - Sam and Sarah exchange messages
   - API: `POST /chat/message`
   - WebSocket: `message` event (real-time)
   - State: 7 → 8

8. **Creates Prescription** (Chapter 9)
   - Sam creates prescription for Sarah
   - API: `POST /chat/message` (with `message_type: "prescription"`)
   - WebSocket: `message` event (to Sarah and shop owners)
   - WebSocket: `new_prescription` event (to shop owners)
   - State: 8 → 9

---

### 👨‍⚕️ Parker (Doctor 2) Journey

1. **Registration** (Chapter 1)
   - Parker registers as a doctor
   - API: `POST /auth/register`
   - State: 0 → 1 (pending approval)

2. **Admin Approval** (Chapter 11)
   - Admin approves Parker
   - API: `POST /admin/user/:id/approve`
   - State: 1 → 1 (approved)

3. **Authentication** (Chapter 2)
   - Parker logs in
   - API: `POST /auth/login`
   - WebSocket: Connects with JWT token
   - State: 1 → 2

4. **Views Broadcast Inbox** (Chapter 5)
   - Parker views broadcast inbox
   - API: `GET /chat/broadcast/inbox`
   - Sees Sarah's broadcast
   - State: 2 → 5

5. **Tries to Respond** (Chapter 6)
   - Parker tries to respond to Sarah's broadcast
   - API: `POST /chat/conversation/broadcast/:broadcastId/respond`
   - Error: "Broadcast already assisted"
   - State: 5 → 5 (cannot respond)

---

### 🏪 Daniel (Shop Owner 1) Journey

1. **Registration** (Chapter 1)
   - Daniel registers as a shop owner
   - API: `POST /auth/register`
   - State: 0 → 1 (pending approval)

2. **Admin Approval** (Chapter 11)
   - Admin approves Daniel
   - API: `POST /admin/user/:id/approve`
   - State: 1 → 1 (approved)

3. **Authentication** (Chapter 2)
   - Daniel logs in
   - API: `POST /auth/login`
   - WebSocket: Connects with JWT token
   - State: 1 → 2

4. **Receives Prescription** (Chapter 9)
   - Daniel receives prescription from Sam
   - WebSocket: `new_prescription` event
   - WebSocket: `message` event (prescription)
   - State: 2 → 9

5. **Views Conversation List** (Chapter 10)
   - Daniel clicks "Inbox" button
   - API: `GET /chat/conversation`
   - Sees conversation with Sam
   - State: 9 → 10

6. **Views Prescription** (Chapter 10)
   - Daniel views prescription details
   - API: `GET /chat/shop-owner/prescriptions/:id`
   - Can prepare to fulfill order
   - State: 10 → 10

---

### 🏪 Dollar (Shop Owner 2) Journey

1. **Registration** (Chapter 1)
   - Dollar registers as a shop owner
   - API: `POST /auth/register`
   - State: 0 → 1 (pending approval)

2. **Admin Approval** (Chapter 11)
   - Admin approves Dollar
   - API: `POST /admin/user/:id/approve`
   - State: 1 → 1 (approved)

3. **Authentication** (Chapter 2)
   - Dollar logs in
   - API: `POST /auth/login`
   - WebSocket: Connects with JWT token
   - State: 1 → 2

4. **Receives Prescription** (Chapter 9)
   - Dollar receives prescription from Sam
   - WebSocket: `new_prescription` event
   - WebSocket: `message` event (prescription)
   - State: 2 → 9

5. **Views Conversation List** (Chapter 10)
   - Dollar clicks "Inbox" button
   - API: `GET /chat/conversation`
   - Sees conversation with Sam
   - State: 9 → 10

---

### 👨‍💼 Admin Journey

1. **Authentication** (Chapter 2)
   - Admin logs in
   - API: `POST /auth/login`
   - WebSocket: Connects with JWT token
   - State: 1 → 2

2. **Views System Statistics** (Chapter 11)
   - Admin views dashboard
   - API: `GET /admin/user/statistics`
   - Sees system statistics
   - State: 2 → 11

3. **Views Pending Verifications** (Chapter 11)
   - Admin views pending verifications
   - API: `GET /admin/user/verifications/pending`
   - Sees Sam, Parker, Daniel, Dollar waiting for approval
   - State: 11 → 11

4. **Approves Users** (Chapter 11)
   - Admin approves Sam, Parker, Daniel, Dollar
   - API: `POST /admin/user/:id/approve`
   - Users can now use the platform
   - State: 11 → 11

5. **Monitors System Activities** (Chapter 11)
   - Admin views all conversations
   - API: `GET /admin/user/conversations`
   - Admin views all prescriptions
   - API: `GET /admin/user/prescriptions`
   - Admin views all broadcasts
   - API: `GET /admin/user/broadcasts`
   - State: 11 → 11

---

## 📊 Complete API Call Sequence

### Registration Phase

1. **Sarah Registers** (Patient)
   - `POST /auth/register` (type: "patient")
   - Response: Success, email verification sent

2. **Sam Registers** (Doctor)
   - `POST /auth/register` (type: "doctor")
   - Response: Success, waiting for approval

3. **Parker Registers** (Doctor)
   - `POST /auth/register` (type: "doctor")
   - Response: Success, waiting for approval

4. **Daniel Registers** (Shop Owner)
   - `POST /auth/register` (type: "shop_owner")
   - Response: Success, waiting for approval

5. **Dollar Registers** (Shop Owner)
   - `POST /auth/register` (type: "shop_owner")
   - Response: Success, waiting for approval

### Authentication Phase

6. **Admin Logs In**
   - `POST /auth/login` (admin credentials)
   - Response: JWT token, user data

7. **Admin Approves Users**
   - `POST /admin/user/:id/approve` (Sam)
   - `POST /admin/user/:id/approve` (Parker)
   - `POST /admin/user/:id/approve` (Daniel)
   - `POST /admin/user/:id/approve` (Dollar)
   - Response: Success, users approved

8. **Sarah Logs In**
   - `POST /auth/login` (patient credentials)
   - Response: JWT token, user data

9. **Sam Logs In**
   - `POST /auth/login` (doctor credentials)
   - Response: JWT token, user data

10. **Parker Logs In**
    - `POST /auth/login` (doctor credentials)
    - Response: JWT token, user data

11. **Daniel Logs In**
    - `POST /auth/login` (shop owner credentials)
    - Response: JWT token, user data

12. **Dollar Logs In**
    - `POST /auth/login` (shop owner credentials)
    - Response: JWT token, user data

### Broadcast Phase

13. **Sarah Sends Broadcast**
    - `POST /chat/broadcast` (message: "I have a severe headache and fever.")
    - Response: Success, broadcast created
    - WebSocket: `new_broadcast` event (to all doctors)

14. **Sarah Views Inbox**
    - `GET /chat/conversation`
    - Response: Empty list (no conversations yet)

### Conversation Phase

15. **Sam Views Broadcast Inbox**
    - `GET /chat/broadcast/inbox`
    - Response: List of open broadcasts (Sarah's broadcast)

16. **Parker Views Broadcast Inbox**
    - `GET /chat/broadcast/inbox`
    - Response: List of open broadcasts (Sarah's broadcast)

17. **Sam Responds to Broadcast**
    - `POST /chat/conversation/broadcast/:broadcastId/respond`
    - Response: Success, conversation created
    - WebSocket: `broadcast_updated` event (to all doctors)
    - WebSocket: `conversation` event (to Sarah and Sam)

18. **Parker Tries to Respond**
    - `POST /chat/conversation/broadcast/:broadcastId/respond`
    - Response: Error, "Broadcast already assisted"

19. **Sarah Views Conversation List**
    - `GET /chat/conversation`
    - Response: List of conversations (conversation with Sam)

20. **Sarah Views Conversation Detail**
    - `GET /chat/conversation/:id`
    - `GET /chat/message?conversation_id=:id`
    - Response: Conversation details, messages

21. **Sam Views Conversation Detail**
    - `GET /chat/conversation/:id`
    - `GET /chat/message?conversation_id=:id`
    - Response: Conversation details, messages

### Messaging Phase

22. **Sam Sends Message**
    - `POST /chat/message` (message: "Hello Sarah, how can I help you?")
    - Response: Success, message sent
    - WebSocket: `message` event (to Sarah)

23. **Sarah Sends Message**
    - `POST /chat/message` (message: "Thank you, doctor. I have a severe headache.")
    - Response: Success, message sent
    - WebSocket: `message` event (to Sam)

24. **Sam Sends Message**
    - `POST /chat/message` (message: "I understand. Let me create a prescription for you.")
    - Response: Success, message sent
    - WebSocket: `message` event (to Sarah)

### Prescription Phase

25. **Sam Creates Prescription**
    - `POST /chat/message` (message_type: "prescription", medicine_details: "Paracetamol 500mg...", patient_name: "Sarah Johnson")
    - Response: Success, prescription sent
    - WebSocket: `message` event (to Sarah and shop owners)
    - WebSocket: `new_prescription` event (to shop owners)
    - WebSocket: `new_conversation` event (to shop owners if new conversation)

26. **Daniel Views Conversation List**
    - `GET /chat/conversation`
    - Response: List of conversations (conversation with Sam)

27. **Daniel Views Prescription**
    - `GET /chat/shop-owner/prescriptions/:id`
    - Response: Prescription details

28. **Dollar Views Conversation List**
    - `GET /chat/conversation`
    - Response: List of conversations (conversation with Sam)

29. **Dollar Views Prescription**
    - `GET /chat/shop-owner/prescriptions/:id`
    - Response: Prescription details

### Admin Monitoring Phase

30. **Admin Views System Statistics**
    - `GET /admin/user/statistics`
    - Response: System statistics (user counts, conversation counts, etc.)

31. **Admin Views All Conversations**
    - `GET /admin/user/conversations`
    - Response: List of all conversations

32. **Admin Views All Prescriptions**
    - `GET /admin/user/prescriptions`
    - Response: List of all prescriptions

33. **Admin Views All Broadcasts**
    - `GET /admin/user/broadcasts`
    - Response: List of all broadcasts

---

## 🔌 Complete WebSocket Event Flow

### Connection Events

1. **All Users Connect**
   - Event: `connection`
   - Data: JWT token (authentication)
   - Response: `connected` event

2. **Users Join Rooms**
   - Event: `joinRoom`
   - Data: `{ room_id: conversation_id }`
   - Response: `joinedRoom` event

### Broadcast Events

3. **Patient Sends Broadcast**
   - Event: `new_broadcast` (emitted to all doctors)
   - Data: `{ broadcast: { id, patient_id, message, status, created_at } }`
   - Receivers: All verified doctors

4. **Doctor Responds to Broadcast**
   - Event: `broadcast_updated` (emitted to all doctors and patient)
   - Data: `{ broadcast: { id, status: "assisted", assisted_by, conversation_id } }`
   - Receivers: All doctors and patient

5. **Broadcast Assisted**
   - Event: `broadcast_assisted` (emitted to all doctors)
   - Data: `{ broadcast_id, conversation: { id, creator_id, participant_id } }`
   - Receivers: All doctors

### Conversation Events

6. **Conversation Created**
   - Event: `conversation` (emitted to creator and participant)
   - Data: `{ from: user_id, data: { id, creator_id, participant_id, type, status } }`
   - Receivers: Creator and participant

7. **New Conversation (Shop Owner)**
   - Event: `new_conversation` (emitted to shop owner)
   - Data: `{ conversation: { id, creator_id, participant_id, type } }`
   - Receivers: Shop owner

### Message Events

8. **Text Message Sent**
   - Event: `message` (emitted to conversation room and receiver)
   - Data: `{ from: sender_id, data: { id, message, message_type: "text", created_at } }`
   - Receivers: Conversation participants

9. **Prescription Message Sent**
   - Event: `message` (emitted to conversation room and receiver)
   - Data: `{ from: sender_id, data: { id, message, message_type: "prescription", medicine_details, patient_name, created_at } }`
   - Receivers: Patient and shop owners

10. **New Prescription (Shop Owner)**
    - Event: `new_prescription` (emitted to shop owner)
    - Data: `{ prescription: { id, message, medicine_details, patient_name }, doctor: { id, name } }`
    - Receivers: Shop owners

---

## 🎯 Key System Features

### 1. Chat-First Architecture
- **No Dashboards**: Patients, doctors, and shop owners don't have dashboards
- **Conversation List**: Primary interface for all users (except admin)
- **Landing Page**: Patients can send messages directly from landing page
- **Inbox Button**: All users have an "Inbox" button in the navbar

### 2. Broadcast System
- **Patient Broadcasts**: Patients create broadcasts that are sent to all verified doctors
- **Real-Time Notifications**: Doctors receive real-time notifications when broadcasts are created
- **Race Condition Protection**: Only one doctor can respond to a broadcast
- **Status Management**: Broadcast status changes from "open" to "assisted" when doctor responds

### 3. Conversation System
- **Patient-Doctor Conversations**: Created when doctor responds to broadcast
- **Doctor-Shop Owner Conversations**: Created when doctor sends prescription
- **Conversation Reuse**: Same doctor-shop_owner conversation is reused for multiple prescriptions
- **Real-Time Messaging**: WebSocket-based real-time messaging

### 4. Prescription System
- **Prescription Creation**: Doctors create prescription messages with medicine details and patient name
- **Automatic Distribution**: Prescriptions are automatically distributed to all verified shop owners
- **Real-Time Notifications**: Shop owners receive real-time notifications when prescriptions are distributed
- **Prescription Viewing**: Shop owners can view prescriptions in conversations or via prescription endpoints

### 5. Admin System
- **User Verification**: Admin can approve/reject doctors and shop owners
- **System Monitoring**: Admin can view all conversations, prescriptions, and broadcasts
- **System Statistics**: Admin can view system statistics (user counts, conversation counts, etc.)
- **View-Only Access**: Admin has view-only access to system activities

---

## 🔐 Security & Authorization

### Role-Based Access Control (RBAC)

1. **Patient Role**
   - Can create broadcasts
   - Can view their own conversations
   - Can send/receive messages in their conversations
   - Cannot create prescriptions

2. **Doctor Role**
   - Can view open broadcasts
   - Can respond to broadcasts
   - Can create conversations with patients
   - Can send/receive messages in conversations
   - Can create prescriptions
   - Must be approved by admin

3. **Shop Owner Role**
   - Can view prescriptions
   - Can view conversations with doctors
   - Cannot create broadcasts
   - Cannot create prescriptions
   - Must be approved by admin

4. **Admin Role**
   - Can view all users
   - Can approve/reject doctors and shop owners
   - Can view all conversations, prescriptions, and broadcasts
   - Can view system statistics
   - Has view-only access to system activities

### Authentication & Authorization

- **JWT Tokens**: All API requests require JWT token authentication
- **WebSocket Authentication**: WebSocket connections require JWT token
- **Role Guards**: Routes are protected by role-based guards
- **User Verification**: Doctors and shop owners must be approved by admin

---

## ✅ Complete System Summary

### What We Built

1. **User Management**: Registration, authentication, and user verification
2. **Broadcast System**: Patient broadcasts to all verified doctors
3. **Conversation System**: Patient-doctor and doctor-shop_owner conversations
4. **Messaging System**: Real-time messaging with WebSocket support
5. **Prescription System**: Automatic prescription distribution to shop owners
6. **Admin System**: User verification and system monitoring

### Key Technologies

- **Backend**: NestJS, Prisma, PostgreSQL
- **Authentication**: JWT, Passport.js
- **Real-Time**: WebSocket (Socket.IO)
- **Authorization**: Role-based access control (RBAC)
- **Database**: PostgreSQL with Prisma ORM

### Key Features

- **Chat-First Architecture**: No dashboards for patients, doctors, or shop owners
- **Real-Time Messaging**: WebSocket-based real-time messaging
- **Automatic Distribution**: Prescriptions automatically distributed to shop owners
- **Race Condition Protection**: Only one doctor can respond to a broadcast
- **Conversation Reuse**: Same doctor-shop_owner conversation reused for multiple prescriptions
- **Admin Monitoring**: Admin can monitor all system activities

---

## 🎓 Best Practices

### Frontend Implementation

1. **WebSocket Connection**: Establish WebSocket connection on login
2. **Token Management**: Store JWT token securely (localStorage or httpOnly cookie)
3. **Real-Time Updates**: Listen for WebSocket events and update UI in real-time
4. **Error Handling**: Handle API errors and WebSocket disconnections gracefully
5. **Loading States**: Show loading states during API calls
6. **Optimistic Updates**: Update UI optimistically for better UX

### Backend Implementation

1. **Error Handling**: Handle all errors gracefully with appropriate HTTP status codes
2. **Validation**: Validate all input data using DTOs
3. **Authorization**: Protect all routes with role-based guards
4. **Database Transactions**: Use database transactions for critical operations
5. **WebSocket Events**: Emit WebSocket events for real-time updates
6. **Logging**: Log all important events for debugging and monitoring

### Security

1. **Authentication**: Use JWT tokens for authentication
2. **Authorization**: Use role-based access control (RBAC)
3. **Input Validation**: Validate all input data
4. **SQL Injection Prevention**: Use Prisma ORM to prevent SQL injection
5. **XSS Prevention**: Sanitize all user input
6. **CORS**: Configure CORS properly for production

---

## 🎯 Conclusion

**QuickMed Connect** is a comprehensive telemedicine platform that enables patients to connect with doctors, receive medical advice, and get prescriptions delivered to shop owners. The platform uses a chat-first architecture, real-time messaging, and automatic prescription distribution to provide a seamless user experience.

### Key Achievements

- ✅ Complete user management system
- ✅ Broadcast system for patient-doctor communication
- ✅ Real-time messaging system
- ✅ Automatic prescription distribution
- ✅ Admin system for user verification and monitoring
- ✅ Comprehensive API documentation

### Next Steps

- **Frontend Development**: Implement frontend using the API documentation
- **Testing**: Write unit tests and integration tests
- **Deployment**: Deploy backend to production
- **Monitoring**: Set up monitoring and logging
- **Scaling**: Scale the system as needed

---

## 📚 Additional Resources

### API Documentation
- All API endpoints are documented in the previous chapters
- Swagger documentation is available at `/api/docs`
- WebSocket events are documented in each chapter

### Code Examples
- Frontend implementation examples are provided in each chapter
- Backend implementation is available in the codebase
- WebSocket event handling examples are provided

### Support
- For questions or issues, please refer to the API documentation
- For technical support, please contact the development team

---

## 🎉 Thank You!

Thank you for using **QuickMed Connect**! We hope this documentation helps you understand and use the platform effectively. If you have any questions or feedback, please don't hesitate to reach out.

---

**End of Documentation**

---
