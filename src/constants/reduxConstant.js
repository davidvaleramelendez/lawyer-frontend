// Contact
export const contactItem = { ContactID: null, Name: "", Email: "", Subject: "", PhoneNo: "", message: "", IsCase: 0, message_id: null }

// ContactNotes
export const contactNoteItem = { ContactNotesID: null, ContactID: null, Notes: "", UserID: null }

// Contact to Case
export const caseItem = { CaseID: null, UserID: null, ContactID: null, LaywerID: null, CaseTypeID: null, Name: "", Email: "", PhoneNo: "", Address: "", Date: "", Status: "", City: "", Pincode: "" }

// User
export const userItem = { id: null, role_id: null, name: "", first_name: "", last_name: "", email: "", email_verified_at: null, password: "", two_factor_secret: null, two_factor_recovery_codes: null, remember_token: null, current_team_id: null, profile_photo_path: null, language: 'English', Status: "Active", Contact: "", Company: null, DOB: null, Gender: null, Address: null, Address1: null, Postcode: null, City: null, State: null, Country: null }

// AccountSetting
export const accountItem = { id: null, UserId: null, bank_information: "", footer_columns: null, invoice_logo: "", Account_Name: "", Account_title: "", Account_Number: "", User_Name: "", Address: "", Postal_Code: "", City: "", Invoice_text: "", Casetype: null, defaultText: "" }

// Imap
export const imapItem = { id: null, user_id: null, imap_host: "", imap_email: "", imap_password: "", imap_port: "", imap_ssl: "" }

// Email
export const emailsMeta = { inbox: 0, draft: 0, important: 0, spam: 0 }

export const emailItem = { id: "", imap_id: "", folder: "", from_id: "", to_id: "", from: "", to: "", reply_to: "", sender: "", subject: "", message_id: "", uid: "", email_group_id: "", date: "", toaddress: "", fromaddress: "", reply_toaddress: "", senderaddress: "", body: "", hasAttachment: null, attachedFiles: null, is_read: 0, is_delete: 0, is_trash: 0, important: 0, email_to: null, email_cc: null, email_bcc: null }

// Chat
export const chatItem = { id: "", sender_id: "", receiver_id: "", message: "" }

// Fighter
export const fighterItem = { id: "", name: "", last_name: "", email: "", telefone: "", city: "", zip_code: "", country: "", address: "", CaseID: "" }

// Record
export const recordItem = { RecordID: "", CaseID: "", UserID: "", Email: "", Subject: "", Content: "", File: "", Type: "", ToUserID: "", IsShare: "", start_time: "", end_time: "", interval_time: "" }

// Case Document
export const caseDocItem = { id: "", case_id: "", user_id: "", title: "", description: "", attachment: "", attachment_pdf: "", deleted: 0, is_archived: 0, is_print: 0, frist_date: "", isErledigt: 0 }

// Letter
export const letterItem = { id: "", user_id: "", case_id: "", letter_template_id: "", subject: "", message: "", best_regards: "", frist_date: "", created_date: "", last_date: "", is_print: 0, deleted: 0, is_archived: 0, word_file: "", pdf_file: "", isErledigt: 0 }

// Todo
export const todosMeta = { important: 0 }

export const todoItem = { id: "", title: "", Assign: "", due_date: new Date(), tag: "", description: "", UserId: "", is_important: 0, is_completed: 0, is_deleted: 0 }

// Add Events
export const addEventItem = { id: "", google_id: "", title: "", business: "", start_date: "", end_date: "", allDay: false, event_url: "", user_id: "", guest: "", location: "", description: "", extendedProps: { calendar: "" }, user: [] }

// Invoice
export const invoiceItem = { id: "", invoice_no: "", customer_id: "", user_id: "", invoice_date: null, invoice_due_date: null, payment_details: "", note: "", CaseID: "", vat: "", total_price: "", remaining_amount: "", method: "", status: "", CaseTypeName: "", items: [{ id: "", invoice_id: "", item_detail: "", price: "", vat: "" }] }

// Invoice
export const invoiceItemItem = { id: "", invoice_id: "", item_detail: "", price: "", vat: "" }

// Invoice Payments
export const invoicePaymentItem = { id: "", invoice_id: "", paid_amount: "", date: new Date(), note: "" }

// EmailTemplate
export const emailTemplateItem = { id: "", subject: "", template: "", status: "Active" }

// EmailTemplateAttachment
export const emailTemplateAttachmentItem = { id: "", email_template_id: "", name: "", extension: "", path: "", status: "Active" }

// Site Setting
export const siteSettingItem = { id: "", user_id: "", name: "", value: "" }

// CloudStorage
export const cloudStorageItem = { id: "", name: "", slug: "", parent_id: "", user_id: "", roll_id: "", type: "", file_name: "", extension: "", path: "" }

// Companies
export const companyItem = { id: "", user_id: "", company: "", name: "", last_name: "", address: "", city: "", zip_code: "" }

// LetterTemplate
export const letterTemplateItem = { id: "", subject: "", content: "", regard_title: "", status: "Active" }

// InquiryImap
export const inquiryImapItem = { id: "", imap_host: "", imap_email: "", imap_password: "", imap_port: "", imap_ssl: "" }

// Pdf Api
export const pdfApiItem = { id: "", key: "", created_at: "", updated_at: "" }

// Voice Recording
export const voiceRecordingItem = { id: "", case_id: "", name: "", subject: "", path: "" }