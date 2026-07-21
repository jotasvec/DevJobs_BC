-- 005: Remove bio from recruiter_profile table
-- User.bio is the primary bio; recruiter_profile.bio is redundant

ALTER TABLE recruiter_profile DROP COLUMN bio;
