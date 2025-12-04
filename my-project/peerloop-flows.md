# PeerLoop User Flows & Data Schema

## 1. Certification Flow (Student → Student-Teacher)

**How does a Student become a Student-Teacher?**

```
1. Student completes all modules (self-marked checkboxes)
2. Student schedules "Certification Assessment" session with their Student-Teacher
3. Student-Teacher confirms mastery in BBB session
4. Student-Teacher clicks [Recommend for Certification]
5. CREATOR (not Brian) sees certification request in Creator Dashboard
6. Creator clicks [Approve Certification]
7. Certificate issued to student
8. Student can now apply to become Student-Teacher
9. Creator approves Student-Teacher application
10. Student's profile updated to "Certified Student-Teacher"
11. Student can now set availability and appear in scheduling
```

**What triggers eligibility?**
- Complete all course modules (5/5)
- Student-Teacher recommendation

**Who approves?**
- Creator approves certification AND Student-Teacher status (NOT Brian, NOT system)

**UI when approved:**
- Dashboard shows "Available as Student-Teacher" toggle becomes visible
- Profile gets "Student-Teacher" badge
- Appears in Student-Teacher directory for scheduling

---

## 2. Scheduling Flow (Student Books Session)

**Booking Flow:**
```
Student → Course Page → "Schedule Session" button
    ↓
Calendar View → Select Day (date picker)
    ↓
See Available Student-Teachers for that day with time slots
    ↓
Click Student-Teacher listing → Book time
    ↓
Both receive: Email + In-app notification + BBB link
```

**What students see about each Student-Teacher:**
```
┌─────────────────────────────────────────────────┐
│ 👤 Marcus Chen                                   │
│ ⭐ 4.9 rating | 12 students taught              │
│ Available: 10am, 2pm, 7pm                       │
│ [View Profile] [Book 7pm →]                     │
└─────────────────────────────────────────────────┘
```

**How Student-Teachers set availability:**
- Set recurring weekly schedule
- Block out specific dates
- Set session duration (30/45/60 min options)
- Set minimum advance notice (e.g., 4 hours)
- Set max booking window (e.g., 2 weeks)

---

## 3. Branding Status

**Logo:** No PeerLoop logo exists yet. Keep using `alphapeer-logo.svg` temporarily.

**Brand colors:** Not defined yet.

**Action needed:** Ask Brian for brand direction before launch.

---

## 4. Database Schema (Suggested - Not Finalized)

```sql
-- users table additions
profile_photo_url       string, nullable
bio                     text, max 500 chars
handle                  string, unique, indexed
privacy                 enum: public/private
is_student_teacher      boolean, default false
student_teacher_available boolean, default false
join_date               timestamp

-- interests table
id      primary key
name    string, unique

-- user_interests (junction)
user_id     foreign key
interest_id foreign key

-- follows table
id          primary key
follower_id foreign key → users
followee_id foreign key → users, nullable
course_id   foreign key → courses, nullable
created_at  timestamp

-- ratings table
id         primary key
user_id    foreign key → users (person being rated)
rater_id   foreign key → users, nullable (Brian in MVP)
rating     integer 1-5
course_id  foreign key → courses
created_at timestamp

-- enrollments table (from payment spec)
id               primary key
student_id       foreign key
course_id        foreign key
creator_id       foreign key → links to creator profile
student_teacher_id foreign key → who taught this student (for payout)
amount_paid      decimal
payment_date     timestamp
status           enum: active/completed/refunded
```

**Note:** This is suggested schema from feature specs, not a finalized ERD.

---

## Source Files (in planning workspace)

| Purpose | File Path |
|---------|-----------|
| Certification + Complete User Journey | mvp-decisions/2025-12-02-course-content-delivery.md |
| Scheduling System Spec | features/must-have/calendar-scheduling-system.md |
| Profile System + Suggested Schema | features/must-have/student-profile-system.md |
| Payment Flow | mvp-decisions/2025-12-02-payment-escrow-system.md |






