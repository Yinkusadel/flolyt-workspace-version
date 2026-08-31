export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// src/config/apiConfig.ts
export const WAITLIST_BASE_URL = import.meta.env.VITE_WAITLIST_BASE_URL || "http://localhost:5139";

export const USER_BASE_URL = `${API_BASE_URL}/api/users/auth`;
export const WORKFLOW_BASE_URL = `${API_BASE_URL}/api/flolyt/campaigns/{campaignId}/workflow`;
export const SEGMENT_BASE_URL = `${API_BASE_URL}/api/flolyt/segment`;
export const MESSAGING_BASE_URL = `${API_BASE_URL}/api/flolyt/messaging`;
export const CUSTOMER_BASE_URL = `${API_BASE_URL}/api/flolyt/customers`;
export const CAMPAIGN_BASE_URL = `${API_BASE_URL}/api/flolyt/campaigns`;
export const TEAMS_BASE_URL = `${API_BASE_URL}/api/teams`;
export const WALLET_BASE_URL = `${API_BASE_URL}/api/payments/wallets`;
export const EVENT_BASE_URL = `${API_BASE_URL}/api/flolyt/events`;
export const COMPANY_BASE_URL = `${API_BASE_URL}/api/flolyt/company`;
export const DATASOURCES_BASE_URL = `${API_BASE_URL}/api/flolyt/datasources`;
export const DATA_PLATFORM_BASE_URL = `${API_BASE_URL}/api/flolyt/data-platform`;
export const APIKEY_BASE_URL = `${API_BASE_URL}/api/flolyt/api-key`;
export const ANALYTICS_BASE_URL = `${API_BASE_URL}/api/analytics`;
export const WORKFLOWSTUDIO_BASE_URL = `${API_BASE_URL}/api/flolyt/workflows/studio`;
export const CHANNELS_BASE_URL = `${API_BASE_URL}/api/flolyt/channels`;
export const CREDENTIALS_BASE_URL = `${API_BASE_URL}/api/flolyt/`;
export const PERSONALIZATION_BASE_URL = `${API_BASE_URL}/api/flolyt/personalization`;
export const COMMAND_CENTER_BASE_URL = `${API_BASE_URL}/api/flolyt/command-center`;
// Agent runs live under command-center/ for historical reasons only. They are surface-agnostic —
// the AI conversation surface uses these same routes. Do not add a second set for chat.
export const AGENT_RUNS_BASE_URL = `${COMMAND_CENTER_BASE_URL}/runs`;
export const SKILLS_BASE_URL = `${API_BASE_URL}/api/flolyt/skills`;
export const AI_CONVERSATIONS_BASE_URL = `${API_BASE_URL}/api/flolyt/ai/conversations`;
export const NOTIFICATIONS_BASE_URL = `${API_BASE_URL}/api/flolyt/notifications`;
export const AICREDITS_BASE_URL = `${API_BASE_URL}/api/flolyt/payments/credits`;
export const GOVERNANCE_BASE_URL = `${API_BASE_URL}/api/flolyt/governance`;
export const INTELLIGENCE_BASE_URL = `${API_BASE_URL}/api/v1/intelligence`;
export const PLATFORM_ADMIN_BASE_URL = `${API_BASE_URL}/api/flolyt/platform-admin`;
export const CURRENCY_BASE_URL = `${API_BASE_URL}/api/flolyt/currency`;
export const WORKSPACE_BASE_URL = `${API_BASE_URL}/api/flolyt/workspace`;
export const LIFECYCLE_BASE_URL = `${API_BASE_URL}/api/flolyt/lifecycle`;

export const API_ENDPOINTS = {
  USER: {
    REGISTER: `${API_BASE_URL}/api/users/registration/register`,
    CONFIRM_REGISTRATION: `${API_BASE_URL}/api/users/registration/{userId}/confirm`,
    RESEND_OTP: `${API_BASE_URL}/api/users/registration/resend-otp`,
    REQUEST_LOGIN_CODE: `${USER_BASE_URL}/login/request-code`,
    VERIFY_LOGIN_CODE: `${USER_BASE_URL}/login/verify-code`,
    STEP_UP_REQUEST_CODE: `${USER_BASE_URL}/step-up/request-code`,
    STEP_UP_VERIFY_CODE: `${USER_BASE_URL}/step-up/verify-code`,
    CREATE_COMPANY: `${API_BASE_URL}/api/flolyt/company`,
    GET_USER_BY_EMAIL: `${API_BASE_URL}/api/users/registration/{email}`,
    REFRESH_TOKEN: `${USER_BASE_URL}/token/refresh`,
    LOGOUT: `${USER_BASE_URL}/logout`,
    LOGOUT_ALL: `${USER_BASE_URL}/logout-all`,
    GET_USER_SESSIONS: `${USER_BASE_URL}/sessions`,
    REVOKE_USER_SESSION: `${USER_BASE_URL}/sessions/{id}`,
    REVOKE_USER_SESSION_BY_ADMIN: `${USER_BASE_URL}/admin/users/{userId}/revoke-sessions`,
    REVOKE_COMPANY_SESSIONS_BY_ADMIN: `${USER_BASE_URL}/admin/companies/{companyId}/revoke-sessions`,
    GET_COMPANY_USERS: `${USER_BASE_URL}/admin/companies/{companyId}/users`,
  },

  WORKFLOW: {
    INITIALIZE_WORKFLOW: `${WORKFLOW_BASE_URL}`,
    ADD_WORKFLOW_NODE: `${WORKFLOW_BASE_URL}/nodes`,
    UPDATE_WORKFLOW_NODE_POSITION: `${WORKFLOW_BASE_URL}/nodes/{nodeId}/position`,
    UPDATE_WORKFLOW_NODE_DATA: `${WORKFLOW_BASE_URL}/nodes/{nodeId}/data`,
    DELETE_WORKFLOW_NODE: `${WORKFLOW_BASE_URL}/nodes/{nodeId}`,
    CONNECT_WORKFLOW_NODES: `${WORKFLOW_BASE_URL}/edges`,
    DISCONNECT_WORKFLOW_NODES: `${WORKFLOW_BASE_URL}/edges`,
    UPDATE_WORKFLOW_TRIGGER: `${WORKFLOW_BASE_URL}/trigger`,
    GENERATE_Campaign_WORKFLOW: `${WORKFLOW_BASE_URL}/generate`,
    IMPORT_WORKFLOW: `${WORKFLOW_BASE_URL}/import`,
  },

  SEGMENT: {
    ACTIVATE_SEGMENT: `${SEGMENT_BASE_URL}/{id}/activate`,
    DEACTIVATE_SEGMENT: `${SEGMENT_BASE_URL}/{id}/deactivate`,
    REMOVE_CUSTOMERS: `${SEGMENT_BASE_URL}/{id}/customer`,
    CREATE_SEGMENT: `${SEGMENT_BASE_URL}`,
    GET_SEGMENTS_OF_COMPANY_OF_SIGNED_IN_USER: `${SEGMENT_BASE_URL}`,
    UPDATE_SEGMENT: `${SEGMENT_BASE_URL}/{id}`,
    DELETE_SEGMENT: `${SEGMENT_BASE_URL}/{id}`,
    GET_SEGMENT_BY_ID: `${SEGMENT_BASE_URL}/{id}`,
    ADD_TAG_TO_SEGMENT: `${SEGMENT_BASE_URL}/{id}/tag`,
    REMOVE_TAG_FROM_SEGMENT: `${SEGMENT_BASE_URL}/{id}/tag`,
    GET_SEGMENT_ANALYTICS: `${SEGMENT_BASE_URL}/{id}/analytics`,
    GET_SEGMENT_CUSTOMERS: `${SEGMENT_BASE_URL}/{id}/customers`,
    ARCHIVE_SEGMENT: `${SEGMENT_BASE_URL}/{id}/archive`,
    RESTORE_SEGMENT: `${SEGMENT_BASE_URL}/{id}/restore`,
    GET_SEGMENT_CUSTOMERS_ANALYTICS: `${SEGMENT_BASE_URL}{id}/customers`,
    ESTIMATE_SEGMENT_CUSTOMERS: `${SEGMENT_BASE_URL}/estimate`,
    ADD_SEGMENT_RULES: `${SEGMENT_BASE_URL}/{id}/rules`,
    REMOVE_SEGMENT_RULES: `${SEGMENT_BASE_URL}/{id}/rules`,
  },


  MESSAGING: {
    CONNECT_CHANNEL: `${MESSAGING_BASE_URL}/channels/connect`,
    GET_CHANNELS: `${MESSAGING_BASE_URL}/channels`,
    DELETE_CHANNEL: `${MESSAGING_BASE_URL}/channels/{channelId}`,
    GET_CONNECTED_CHANNELS: `${MESSAGING_BASE_URL}/channels/connected`,
    CREATE_SENDER: `${MESSAGING_BASE_URL}/channels/sender`,
    DIRECT_MESSAGE: `${MESSAGING_BASE_URL}/direct`,
    DIRECT_MESSAGE_COST: `${MESSAGING_BASE_URL}/direct/cost`,
    GET_DIRECT_MESSAG_BY_ID: `${MESSAGING_BASE_URL}/direct/{id}`,
    TEST: `${MESSAGING_BASE_URL}/test`,
  },

  MESSAGING_TEMPLATE: {
    GET_TEMPLATES: `${MESSAGING_BASE_URL}/templates`,
    CREATE_TEMPLATE: `${MESSAGING_BASE_URL}/templates`,
    GET_TEMPLATE_BY_ID: `${MESSAGING_BASE_URL}/templates/{id}`,
    UPDATE_TEMPLATE: `${MESSAGING_BASE_URL}/templates/{id}`,
    DELETE_TEMPLATE: `${MESSAGING_BASE_URL}/templates/{id}`,
    ACTIVATE_TEMPLATE: `${MESSAGING_BASE_URL}/templates/{id}/activate`,
    DEACTIVATE_TEMPLATE: `${MESSAGING_BASE_URL}/templates/{id}/deactivate`,
    CREATE_WHATSAPP_TEMPLATE: `${MESSAGING_BASE_URL}/templates/whatsapp`,
    GET_WHATSAPP_TEMPLATES: `${MESSAGING_BASE_URL}/templates/whatsapp`,
    GET_WHATSAPP_TEMPLATE_BY_ID: `${MESSAGING_BASE_URL}/templates/whatsapp/{id}`,
    DELETE_WHATSAPP_TEMPLATE_BY_ID: `${MESSAGING_BASE_URL}/templates/whatsapp/{id}`,
    UPDATE_WHATSAPP_TEMPLATE_HEADER: `${MESSAGING_BASE_URL}/templates/whatsapp/{id}/header`,
    UPDATE_WHATSAPP_TEMPLATE_CONTENT: `${MESSAGING_BASE_URL}/templates/whatsapp/{id}/content`,
    ADD_WHATSAPP_TEMPLATE_BUTTONS: `${MESSAGING_BASE_URL}/templates/whatsapp/{id}/buttons`,
    CLEAR_WHATSAPP_TEMPLATE_BUTTONS: `${MESSAGING_BASE_URL}/templates/whatsapp/{id}/buttons`,
    REMOVE_WHATSAPP_TEMPLATE_BUTTON: `${MESSAGING_BASE_URL}/templates/whatsapp/{id}/buttons/{buttonIndex}`,
    GET_SMS_TEMPLATES: `${MESSAGING_BASE_URL}/templates/sms`,
    CREATE_SMS_TEMPLATE: `${MESSAGING_BASE_URL}/templates/sms`,
    GET_SMS_TEMPLATE_BY_ID: `${MESSAGING_BASE_URL}/templates/sms/{id}`,
    UPDATE_SMS_TEMPLATE: `${MESSAGING_BASE_URL}/templates/sms/{id}`,
    DELETE_SMS_TEMPLATE: `${MESSAGING_BASE_URL}/templates/sms/{id}`,
    ACTIVATE_SMS_TEMPLATE: `${MESSAGING_BASE_URL}/templates/{id}/sms/activate`,
    DEACTIVATE_SMS_TEMPLATE: `${MESSAGING_BASE_URL}/templates/{id}/sms/deactivate`,
  },

  CUSTOMER: {
    GET_CUSTOMERS: `${CUSTOMER_BASE_URL}`,
    CREATE_CUSTOMER: `${CUSTOMER_BASE_URL}`,
    DELETE_CUSTOMERS: `${CUSTOMER_BASE_URL}`,
    GET_CUSTOMER_BY_ID: `${CUSTOMER_BASE_URL}/{id}`,
    UPDATE_CUSTOMER: `${CUSTOMER_BASE_URL}/{id}`,
    DELETE_CUSTOMER_BY_ID: `${CUSTOMER_BASE_URL}/{id}`,
    CREATE_CUSTOMERS_BULK: `${CUSTOMER_BASE_URL}/bulk`,
    REMOVE_CUSTOMERS_FROM_SEGMENTS: `${CUSTOMER_BASE_URL}/segments`,
    CREATE_CUSTOMER_ATTRIBUTE: `${CUSTOMER_BASE_URL}/attributes`,
    GET_CUSTOMER_ATTRIBUTES: `${CUSTOMER_BASE_URL}/attributes`,
    GET_CUSTOMER_ATTRIBUTE_BY_ID: `${CUSTOMER_BASE_URL}/{id}`,
    GET_CUSTOMER_ATTRIBUTE_BY_NAME: `${CUSTOMER_BASE_URL}/attributes/single/{name}`,
    ADD_CUSTOMERS_TO_SEGMENTS: `${CUSTOMER_BASE_URL}/segments`,
    GET_CUSTOMER_INTELLIGENCE_BY_ID: `${CUSTOMER_BASE_URL}/{id}/intelligence`,
    GET_CUSTOMER_SEGMENTS: `${CUSTOMER_BASE_URL}/{id}/segments`,
    GET_CUSTOMER_LIFECYCLE_OVERVIEW: `${CUSTOMER_BASE_URL}/lifecycle/overview`,
    GET_CUSTOMER_LIFECYCLE_RADAR: `${CUSTOMER_BASE_URL}/lifecycle/radar`,
    GET_CUSTOMER_LIFECYCLE_FUNNEL: `${CUSTOMER_BASE_URL}/lifecycle/funnel`,
    GET_CUSTOMER_LIFECYCLE_CAMPAIGN_PERFORMANCE: `${CUSTOMER_BASE_URL}/lifecycle/campaign/performance`,
    GET_CUSTOMER_LIFECYCLE_COHORT_HEATMAP: `${CUSTOMER_BASE_URL}/lifecycle/cohort/heatmap`,
    GET_CUSTOMER_LIFECYCLE_BEHAVIOR_TRENDS: `${CUSTOMER_BASE_URL}/lifecycle/behavior/trends`,
    GET_CUSTOMER_LIFECYCLE_SEGMENT_INTELLIGENCE: `${CUSTOMER_BASE_URL}/lifecycle/segment/intelligence`,
  },

  CAMPAIGN: {
    CREATE_CAMPAIGN: `${CAMPAIGN_BASE_URL}`,
    CREATE_CAMPAIGN_V2: `${CAMPAIGN_BASE_URL}/v2`,
    GET_CAMPAIGNS: `${CAMPAIGN_BASE_URL}`,
    UPDATE_CAMPAIGN: `${CAMPAIGN_BASE_URL}/{campaignId}`,
    DELETE_CAMPAIGN: `${CAMPAIGN_BASE_URL}/{campaignId}`,
    GET_CAMPAIGN_BY_ID: `${CAMPAIGN_BASE_URL}/{campaignId}`,
    ACTIVATE_CAMPAIGN: `${CAMPAIGN_BASE_URL}/{campaignId}/activate`,
    SET_CAMPAIGN_WORKFLOW: `${CAMPAIGN_BASE_URL}/{campaignId}/workflow`,
    UPDATE_CAMPAIGN_WORKFLOW: `${CAMPAIGN_BASE_URL}/{campaignId}/workflow/update`,
    ADD_CAMPAIGN_GOAL: `${CAMPAIGN_BASE_URL}/{campaignId}/goal`,
    PAUSE_CAMPAIGN: `${CAMPAIGN_BASE_URL}/{campaignId}/pause`,
    RESUME_CAMPAIGN: `${CAMPAIGN_BASE_URL}/{campaignId}/resume`,
    GET_CAMPAIGN_OVERVIEW: `${CAMPAIGN_BASE_URL}/{campaignId}/overview`,
    GET_CAMPAIGN_PARTICIPANTS: `${CAMPAIGN_BASE_URL}/{id}/participants`,
    CAMPAIGN_ACTIVITY_STREAM: `${CAMPAIGN_BASE_URL}/{campaignId}/activity-stream`,
    GET_CAMPAIGN_COMMENTS: `${CAMPAIGN_BASE_URL}/{campaignId}/comments`,
    POST_CAMPAIGN_COMMENT: `${CAMPAIGN_BASE_URL}/{campaignId}/comments`,
    EDIT_CAMPAIGN_COMMENT: `${CAMPAIGN_BASE_URL}/comments/{commentId}`,
    DELETE_CAMPAIGN_COMMENT: `${CAMPAIGN_BASE_URL}/comments/{commentId}`,
    GET_CAMPAIGN_LIFECYCLE_ROI: `${CAMPAIGN_BASE_URL}/{campaignId}/lifecycle-roi`,
    GET_CAMPAIGN_STEP_ANALYTICS: `${CAMPAIGN_BASE_URL}/{campaignId}/step-analytics`,
    GET_CAMPAIGN_SEGMENTS_BREAKDOWN: `${CAMPAIGN_BASE_URL}/{campaignId}/segments-breakdown`,
    GET_CAMPAIGN_COMPARISON: `${CAMPAIGN_BASE_URL}/{campaignId}/comparison`,
    GET_CAMPAIGN_COMPLIANCE: `${CAMPAIGN_BASE_URL}/{campaignId}/compliance`,
    GET_CAMPAIGN_JOURNEY_FLOW: `${CAMPAIGN_BASE_URL}/{campaignId}/journey-flow`,
    GET_CAMPAIGN_DAILY_CONVERSIONS: `${CAMPAIGN_BASE_URL}/{campaignId}/daily-conversions`,
    GET_CAMPAIGN_GLOBAL_FUNNEL: `${CAMPAIGN_BASE_URL}/{campaignId}/global-funnel`,
    GET_CAMPAIGN_RETENTION: `${CAMPAIGN_BASE_URL}/{campaignId}/retention`,
    GET_CAMPAIGN_AB_EXPERIMENTS: `${CAMPAIGN_BASE_URL}/{campaignId}/ab-experiments`,
    GET_CAMPAIGN_LIVE_STREAM_STATS: `${CAMPAIGN_BASE_URL}/{campaignId}/live-stream/stats`,
  },




  TEAMS: {
    CREATE_TEAM: `${TEAMS_BASE_URL}`,
    GET_TEAMS: `${TEAMS_BASE_URL}`,
    GET_TEAM_BY_ID: `${TEAMS_BASE_URL}/{teamId}`,
    UPDATE_TEAM: `${TEAMS_BASE_URL}/{teamId}`,
    DEACTIVATE_TEAM: `${TEAMS_BASE_URL}/{teamId}`,
    UPDATE_MEMBER_ROLES: `${TEAMS_BASE_URL}/members/{memberId}/roles`,
    REMOVE_TEAM_MEMBER: `${TEAMS_BASE_URL}/members/{memberId}`,
    INVITE_TEAM_MEMBER: `${TEAMS_BASE_URL}/{teamId}/invitations`,
    GET_TEAM_INVITATIONS: `${TEAMS_BASE_URL}/{teamId}/invitations`,
    GET_INVITATION_DETAILS: `${TEAMS_BASE_URL}/invitations/details`,
    ACCEPT_INVITATION: `${TEAMS_BASE_URL}/invitations/accept`,
    REVOKE_TEAM_INVITATION: `${TEAMS_BASE_URL}/invitations/{invitationId}`,
    RESEND_TEAM_INVITATION: `${TEAMS_BASE_URL}/{teamId}/invitations/resend`,

  },


  AUDITING: {
    GET_AUDIT_TRAIL: `${API_BASE_URL}/api/auditing/trail`,

  },

  DASHBOARD: {
    GET_DASHBOARD: `${API_BASE_URL}/api/v1/dashboard`,
    GET_DASHBOARD_V2: `${API_BASE_URL}/api/v2/dashboard`,

  },


  WALLET: {
    TOPUP_WALLET: `${WALLET_BASE_URL}/topup`,
    GET_WALLET_BALANCE: `${WALLET_BASE_URL}/balance`,
    GET_WALLET_TRANSACTIONS: `${WALLET_BASE_URL}/transactions`,
    GET_WALLET_TRANSACTION_BY_ID: `${WALLET_BASE_URL}/transactions/{id}`,
    GET_WALLET_CHANNEL_USAGE_SUMMARY: `${WALLET_BASE_URL}/channels/usage-summary`,

  },

  WAITLIST: {
    SIGNUP: `${WAITLIST_BASE_URL}/signup`,
  },


  EVENT: {
    CREATE_EVENT: `${EVENT_BASE_URL}`,
    GET_EVENTS: `${EVENT_BASE_URL}`,
    DELETE_EVENT: `${EVENT_BASE_URL}/{id}`,
    UPDATE_EVENT: `${EVENT_BASE_URL}/{id}`,
    GET_EVENT_BY_ID: `${EVENT_BASE_URL}/{id}`,
  },

  COMPANY: {
    GET_PROFILE: `${COMPANY_BASE_URL}/profile`,
    UPDATE_COMPANY_PROFILE: `${COMPANY_BASE_URL}/profile`,
  },


  DATASOURCES: {
    GET_DATASOURCES: `${DATASOURCES_BASE_URL}`,
    GET_CONNECTED_DATASOURCES: `${DATASOURCES_BASE_URL}/connected`,
    TEST_DATASOURCE_CONNECTION: `${DATASOURCES_BASE_URL}/test-connection`,
    GET_DATASOURCE_SYNC_STATUS: `${DATASOURCES_BASE_URL}/{id}/sync-status`,
    TRIGGER_DATASOURCE_SYNC: `${DATASOURCES_BASE_URL}/{id}/sync/trigger`,
    GET_DATASOURCE_MCP_SCHEMA: `${DATASOURCES_BASE_URL}/{id}/schema/mcp`,
    GET_DATASOURCE_CONNECTION_SCHEMA: `${DATASOURCES_BASE_URL}/{name}/connection-schema`,
    CONNECT_DATASOURCE: `${DATASOURCES_BASE_URL}/connect`,
    DISCONNECT_DATASOURCE: `${DATASOURCES_BASE_URL}/{id}/disconnect`,
    RECONNECT_DATASOURCE: `${DATASOURCES_BASE_URL}/{id}/reconnect`,
    GET_DATASOURCE_DISCONNECTIONS: `${DATASOURCES_BASE_URL}/disconnections`,
    GET_DATASOURCE_DELETION_CONFIG: `${DATASOURCES_BASE_URL}/deletion-config`,
    UPDATE_DATASOURCE_DELETION_CONFIG: `${DATASOURCES_BASE_URL}/deletion-config`,
    DELETE_DATASOURCE_DELETION_CONFIG: `${DATASOURCES_BASE_URL}/deletion-config`,
  },




  DATA_PLATFORM: {
    GET_SCHEMA_EXPLORER: `${DATA_PLATFORM_BASE_URL}/schema-explorer`,
    GET_EVENTS: `${DATA_PLATFORM_BASE_URL}/events`,
    SYNC_EVENTS: `${DATA_PLATFORM_BASE_URL}/events/sync/{datasourceId}`,
    GET_PROFILE_ATTRIBUTES: `${DATA_PLATFORM_BASE_URL}/profile-attributes`,
    SYNC_PROFILE_ATTRIBUTES: `${DATA_PLATFORM_BASE_URL}/profile-attributes/sync/{datasourceId}`,
    GET_IDENTITY_RESOLUTION_CONFIG: `${DATA_PLATFORM_BASE_URL}/identity-resolution/config`,
    GET_IDENTITY_RESOLUTION_DASHBOARD: `${DATA_PLATFORM_BASE_URL}/identity-resolution/dashboard`,
    RUN_IDENTITY_RESOLUTION: `${DATA_PLATFORM_BASE_URL}/identity-resolution/run`,
    GET_IDENTITY_RESOLUTION_CONFLICTS: `${DATA_PLATFORM_BASE_URL}/identity-resolution/conflicts`,
    UPDATE_SOURCE_PRIORITY: `${DATA_PLATFORM_BASE_URL}/identity-resolution/source-priority`,
    UPDATE_MERGE_RULES: `${DATA_PLATFORM_BASE_URL}/identity-resolution/merge-rules`,
    UPDATE_CONFLICT_RESOLUTION: `${DATA_PLATFORM_BASE_URL}/identity-resolution/conflict-resolution`,
    RESOLVE_CONFLICT: `${DATA_PLATFORM_BASE_URL}/identity-resolution/conflicts/{conflictId}/resolve`,
    QUERY: `${DATA_PLATFORM_BASE_URL}/query`,
  },



  APIKEY: {
    GET_API_KEY: `${APIKEY_BASE_URL}`,
    REGENERATE_API_KEY: `${APIKEY_BASE_URL}/regenerate`,
  },


  ANALYTICS: {
    GET_ANALYTICS_OVERVIEW: `${ANALYTICS_BASE_URL}/overview`,
    GET_ANALYTICS_CAMPAIGNS: `${ANALYTICS_BASE_URL}/campaigns`,
    GET_ANALYTICS_CHANNELS: `${ANALYTICS_BASE_URL}/channels`,
    GET_ANALYTICS_COHORT_RETENTION: `${ANALYTICS_BASE_URL}/cohort-retention`,
    GET_CUSTOMER_HEALTH_SUMMARY: `${ANALYTICS_BASE_URL}/customer-health/summary`,
    GET_CUSTOMER_HEALTH_RFM_SEGMENTS: `${ANALYTICS_BASE_URL}/customer-health/rfm-segments`,
    GET_CUSTOMER_HEALTH_SEGMENT_TRENDS: `${ANALYTICS_BASE_URL}/customer-health/segment-trends`,
    GET_REVENUE_ATTRIBUTION_KPIS: `${ANALYTICS_BASE_URL}/revenue-attribution/kpis`,
    GET_REVENUE_ATTRIBUTION_BY_CAMPAIGN: `${ANALYTICS_BASE_URL}/revenue-attribution/by-campaign`,
    GET_REVENUE_ATTRIBUTION_BY_CHANNEL: `${ANALYTICS_BASE_URL}/revenue-attribution/by-channel`,
    GET_REVENUE_ATTRIBUTION_TRENDS: `${ANALYTICS_BASE_URL}/revenue-attribution/trends`,
    GET_REVENUE_ATTRIBUTION_FUNNEL: `${ANALYTICS_BASE_URL}/revenue-attribution/funnel`,
  },


  WORKFLOWSTUDIO: {
    RUN_PROMPT: `${WORKFLOWSTUDIO_BASE_URL}/prompt`,
    CANCEL_PROMPT: `${WORKFLOWSTUDIO_BASE_URL}/prompt/{sessionId}/cancel`,
    GET_SESSION: `${WORKFLOWSTUDIO_BASE_URL}/session`,
    AUTOCOMPLETE: `${WORKFLOWSTUDIO_BASE_URL}/autocomplete`,
    AUDIENCE_COUNT: `${WORKFLOWSTUDIO_BASE_URL}/audience-count/{campaignId}`,
    PREVIEW_NODE: `${WORKFLOWSTUDIO_BASE_URL}/preview/{nodeId}`,
    EDIT_NODE: `${WORKFLOWSTUDIO_BASE_URL}/node/edit`,
  },


  CHANNELS: {
    GET_CHANNELS: `${CHANNELS_BASE_URL}`,
    GET_CONNECTED_CHANNELS: `${CHANNELS_BASE_URL}/connected`,
    GET_CHANNEL_CONNECTION_SCHEMA: `${CHANNELS_BASE_URL}/{name}/connection-schema`,
    TEST_CHANNEL_CONNECTION: `${CHANNELS_BASE_URL}/test-connection`,
    CONNECT_CHANNEL: `${CHANNELS_BASE_URL}/connect`,
    DISCONNECT_CHANNEL: `${CHANNELS_BASE_URL}/{id}/disconnect`,
  },


  CREDENTIALS: {
    GET_CREDENTIALS: `${CREDENTIALS_BASE_URL}/credentials/{id}`,
  },


  PERSONALIZATION: {
    GET_TOKENS: `${PERSONALIZATION_BASE_URL}/tokens`,
    GET_CHANNEL_ROUTING: `${PERSONALIZATION_BASE_URL}/channel-routing`,
    REFRESH_TOKENS: `${PERSONALIZATION_BASE_URL}/tokens/refresh`,
    VALIDATE_TOKENS: `${PERSONALIZATION_BASE_URL}/tokens/validate`,
    UPDATE_CHANNEL_ROUTING: `${PERSONALIZATION_BASE_URL}/channel-routing`,
  },


  COMMAND_CENTER: {
    GET_SESSIONS: `${COMMAND_CENTER_BASE_URL}/sessions`,
    GET_SESSION_BY_ID: `${COMMAND_CENTER_BASE_URL}/sessions/{id}`,
    CREATE_SESSION: `${COMMAND_CENTER_BASE_URL}/sessions`,
    SUGGESTIONS: `${COMMAND_CENTER_BASE_URL}/suggestions`,
    DISMISS_SUGGESTIONS: `${COMMAND_CENTER_BASE_URL}/suggestions/{id}/dismiss`,
    SEND_MESSAGE: `${COMMAND_CENTER_BASE_URL}/sessions/{id}/messages`,
  },


  AGENT_RUNS: {
    GET_BY_ID: `${AGENT_RUNS_BASE_URL}/{id}`,
    CANCEL: `${AGENT_RUNS_BASE_URL}/{id}/cancel`,
    STEER: `${AGENT_RUNS_BASE_URL}/{id}/steer`,
  },


  SKILLS: {
    GET_SKILLS: `${SKILLS_BASE_URL}`,
    GET_SKILL_DETAIL: `${SKILLS_BASE_URL}/{skillId}`,
    GET_SKILL_RUNS: `${SKILLS_BASE_URL}/runs`,
    RUN_SKILL: `${SKILLS_BASE_URL}/{skillId}/run`,
    UPDATE_SKILL_CONFIG: `${SKILLS_BASE_URL}/{skillId}/config`,
  },



  AI_CONVERSATIONS: {
    SEND_MESSAGE: `${AI_CONVERSATIONS_BASE_URL}/messages`,
    LIST: `${AI_CONVERSATIONS_BASE_URL}`,
    GET_BY_ID: `${AI_CONVERSATIONS_BASE_URL}/{id}`,
    ARCHIVE: `${AI_CONVERSATIONS_BASE_URL}/{id}`,
    SAMPLE_PROMPTS: `${AI_CONVERSATIONS_BASE_URL}/sample-prompts`,
  },



  NOTIFICATIONS: {
    STREAM_NOTIFICATIONS: `${NOTIFICATIONS_BASE_URL}/stream`,
    GET_NOTIFICATIONS: `${NOTIFICATIONS_BASE_URL}`,
    GET_UNREAD_COUNT: `${NOTIFICATIONS_BASE_URL}/unread-count`,
    MARK_AS_READ: `${NOTIFICATIONS_BASE_URL}/{id}/read`,
    DISMISS: `${NOTIFICATIONS_BASE_URL}/{id}/dismiss`,
    MARK_ALL_AS_READ: `${NOTIFICATIONS_BASE_URL}/read-all`,
  },


  AICREDITS: {
    GET_BALANCE: `${AICREDITS_BASE_URL}/balance`,
    GET_PACKS: `${AICREDITS_BASE_URL}/packs`,
    GET_OPERATIONS: `${AICREDITS_BASE_URL}/operations`,
    GET_USAGE: `${AICREDITS_BASE_URL}/usage`,
    GET_OVERVIEW: `${AICREDITS_BASE_URL}/overview`,
    PURCHASE_PACK: `${AICREDITS_BASE_URL}/purchase`,
  },

  GOVERNANCE: {
    GET_SETTINGS: `${GOVERNANCE_BASE_URL}/settings`,
    GET_APPROVAL_SETTINGS: `${GOVERNANCE_BASE_URL}/approval/settings`,
    GET_APPROVAL_ROLES: `${GOVERNANCE_BASE_URL}/approval/roles`,
    GET_PENDING_APPROVALS: `${GOVERNANCE_BASE_URL}/approval/pending`,
    GET_FREQUENCY_CAPS: `${GOVERNANCE_BASE_URL}/frequency-caps`,
    GET_DELIVERY_TIMEZONE: `${GOVERNANCE_BASE_URL}/delivery-timezone`,
    GET_CONTENT_SAFETY: `${GOVERNANCE_BASE_URL}/content-safety`,
    GET_SUPPRESSION_LIST_STATS: `${GOVERNANCE_BASE_URL}/suppression-list/stats`,
    GET_SUPPRESSION_LIST_EXPORT: `${GOVERNANCE_BASE_URL}/suppression-list/export`,
    UPDATE_SETTINGS: `${GOVERNANCE_BASE_URL}/approval/settings`,
    UPDATE_FREQUENCY_CAPS: `${GOVERNANCE_BASE_URL}/frequency-caps`,
    UPDATE_DELIVERY_TIMEZONE: `${GOVERNANCE_BASE_URL}/delivery-timezone`,
    UPDATE_CONTENT_SAFETY: `${GOVERNANCE_BASE_URL}/content-safety`,
    SUBMIT_APPROVAL: `${GOVERNANCE_BASE_URL}/approval/submit`,
    APPROVE_CAMPAIGN: `${GOVERNANCE_BASE_URL}/approval/approve`,
    REJECT_CAMPAIGN: `${GOVERNANCE_BASE_URL}/approval/reject`,
    BLOCK_SUPPRESSION_LIST: `${GOVERNANCE_BASE_URL}/suppression-list/block`,
    GET_CAMPAIGN_PENDING_APPROVAL: `${GOVERNANCE_BASE_URL}/approval/campaigns/{campaignId}/pending`,
    GET_CAMPAIGN_APPROVAL_HISTORY: `${GOVERNANCE_BASE_URL}/approval/campaigns/{campaignId}/history`,
  },



  
  INTELLIGENCE: {
    GET_SUGGESTED_ACTIONS: `${INTELLIGENCE_BASE_URL}/suggested-actions`,
    DISMISS_SUGGESTED_ACTION: `${INTELLIGENCE_BASE_URL}/suggested-actions/{id}/dismiss`,
  },
  
  PLATFORM_ADMIN: {
    GET_PLATFORM_ADMIN_OVERVIEW: `${PLATFORM_ADMIN_BASE_URL}/overview`,
    GET_PLATFORM_ADMIN_SIGNUPS_FUNNEL: `${PLATFORM_ADMIN_BASE_URL}/signups/funnel`,
    GET_PLATFORM_ADMIN_TENANT_BY_ID: `${PLATFORM_ADMIN_BASE_URL}/tenants/{companyId}`,
    GET_PLATFORM_ADMIN_TENANTS: `${PLATFORM_ADMIN_BASE_URL}/tenants`,
    GET_PLATFORM_ADMIN_ACTIVITY: `${PLATFORM_ADMIN_BASE_URL}/activity`,
    REBUILD_SIGNUP_VIEW: `${PLATFORM_ADMIN_BASE_URL}/rebuild/signup-view`,
    REBUILD_TENANT_HEALTH_VIEW: `${PLATFORM_ADMIN_BASE_URL}/rebuild/tenant-health-view`,
    REBUILD_ACTIVITY_FEED: `${PLATFORM_ADMIN_BASE_URL}/rebuild/activity-feed-view`,
    REBUILD_CAMPAIGN_METRICS: `${PLATFORM_ADMIN_BASE_URL}/rebuild/campaign-metrics`,
    REBUILD_REVENUE_PROJECTIONS: `${PLATFORM_ADMIN_BASE_URL}/rebuild/revenue-projections`,
    BACKFILL_CURRENCY_TO_NGN: `${PLATFORM_ADMIN_BASE_URL}/backfill/currency-to-ngn`,
  },

  CURRENCY: {
    GET_SUPPORTED: `${CURRENCY_BASE_URL}/supported`,
    GET_DEFAULT: `${CURRENCY_BASE_URL}/default`,
  },

  WORKSPACE: {
    CREATE_WORKSPACE: `${WORKSPACE_BASE_URL}`,
    UPDATE_WORKSPACE_IDENTITY: `${WORKSPACE_BASE_URL}/identity`,
    CHECK_SLUG_AVAILABLE: `${WORKSPACE_BASE_URL}/slug-available`,
    ANALYZE_WORKSPACE: `${WORKSPACE_BASE_URL}/analyze`,
    GET_WORKSPACE_PROFILE: `${WORKSPACE_BASE_URL}/profile`,
    UPDATE_WORKSPACE_PROFILE: `${WORKSPACE_BASE_URL}/profile`,
    GET_PROPOSED_MARKETS: `${WORKSPACE_BASE_URL}/proposed-markets`,
    UPDATE_WORKSPACE_MARKETS: `${WORKSPACE_BASE_URL}/markets`,
    UPDATE_REVENUE_MODEL: `${WORKSPACE_BASE_URL}/revenue-model`,
    GET_LIFECYCLE_THRESHOLDS: `${WORKSPACE_BASE_URL}/lifecycle-thresholds`,
    UPDATE_LIFECYCLE_THRESHOLDS: `${WORKSPACE_BASE_URL}/lifecycle-thresholds`,
    GET_WORKSPACE_MEMBERS: `${WORKSPACE_BASE_URL}/members`,
    GET_WORKSPACE_ROLES: `${WORKSPACE_BASE_URL}/roles`,
    GET_MY_ROLES: `${WORKSPACE_BASE_URL}/members/me/roles`,
    GET_MEMBER_ROLES: `${WORKSPACE_BASE_URL}/members/{userId}/roles`,
    ASSIGN_MEMBER_ROLES: `${WORKSPACE_BASE_URL}/members/roles`,
    REMOVE_MEMBER_ROLE: `${WORKSPACE_BASE_URL}/members/roles`,
    GET_WORKSPACE_AGENTS: `${WORKSPACE_BASE_URL}/agents`,
    GET_ONBOARDING_STATUS: `${WORKSPACE_BASE_URL}/onboarding`,
    GET_MAPPING_QUALITY: `${WORKSPACE_BASE_URL}/mapping-quality`,
    GET_DATA_MAP: `${WORKSPACE_BASE_URL}/data-map`,
    SAVE_ONBOARDING_PROGRESS: `${WORKSPACE_BASE_URL}/onboarding/progress`,
  },

  LIFECYCLE: {
    GET_MAP: `${LIFECYCLE_BASE_URL}/map`,
    UPDATE_STAGE_OWNER: `${LIFECYCLE_BASE_URL}/map/{stageKey}/owner`,
    GET_MARKET: `${LIFECYCLE_BASE_URL}/market/{country}`,
    GET_LEAKAGE_MAP: `${LIFECYCLE_BASE_URL}/leakage-map`,
    GET_DISTRIBUTION: `${LIFECYCLE_BASE_URL}/distribution`,
    GET_STAGE: `${LIFECYCLE_BASE_URL}/stages/{stageKey}`,
    GET_STAGE_CHANGES: `${LIFECYCLE_BASE_URL}/stages/{stageKey}/changes`,
    GET_STAGE_CHANGE_REGISTRY: `${LIFECYCLE_BASE_URL}/stages/{stageKey}/change-registry`,
    CREATE_CHANGE: `${LIFECYCLE_BASE_URL}/changes`,
    CREATE_CHANGE_FROM_ROOM: `${LIFECYCLE_BASE_URL}/changes/from-room`,
    DELETE_CHANGE: `${LIFECYCLE_BASE_URL}/changes/{changeId}`,
    GET_CHANGE_IMPACT: `${LIFECYCLE_BASE_URL}/changes/{changeId}/impact`,
    GET_STAGE_DEFINITION: `${LIFECYCLE_BASE_URL}/stages/{stageKey}/definition`,
    UPDATE_STAGE_DEFINITION: `${LIFECYCLE_BASE_URL}/stages/{stageKey}/definition`,
    PREVIEW_STAGE_DEFINITION: `${LIFECYCLE_BASE_URL}/stages/{stageKey}/definition/preview`,
    MEASURE_ENTRY_EVENT: `${LIFECYCLE_BASE_URL}/entry-events/measure`,
    GET_STAGE_COHORTS: `${LIFECYCLE_BASE_URL}/stages/{stageKey}/cohorts`,
    GET_STAGE_COMPARE: `${LIFECYCLE_BASE_URL}/stages/{stageKey}/compare`,
  },

};
