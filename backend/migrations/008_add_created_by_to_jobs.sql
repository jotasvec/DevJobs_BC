-- 008: Assign created_by to existing jobs via company match + random fallback

-- Step 1: Jobs matching any recruiter's company → assign to that recruiter
UPDATE jobs SET created_by = (
    SELECT rp.userId
    FROM recruiter_profile rp
    JOIN company c ON rp.companyId = c.id    
    WHERE c.name = jobs.company
    LIMIT 1
)
WHERE created_by IS NULL 
AND company IN (
    SELECT c.name
    FROM company c 
    JOIN recruiter_profile rp ON c.id = rp.companyId
);
-- Step 2: Remaining jobs → randomly split between the two recruiters
UPDATE jobs SET created_by = CASE
    WHEN abs(random()) % 2 = 0 THEN 'CgfMLi5rs0FOsRc6zEooZ10mSY3UGOU9'
    ELSE 'QN4ImLWhEphL486M1FNhCs66WKmyfVZ1'
END
WHERE created_by IS NULL;