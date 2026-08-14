-- 009: Backfill companyId + seed missing companies with real data

-- ============================================
-- STEP 1: Create missing companies
-- ============================================

INSERT INTO company (id, name, description, website, industry, size, location, createdAt) VALUES
(
  'c001a001-0000-4000-8000-000000000001',
  'SafeNet Solutions',
  'Cybersecurity firm providing enterprise-grade protection, threat monitoring, and compliance consulting for mid-size businesses.',
  'https://safenetsolutions.io',
  'Cybersecurity',
  '51-200',
  'Austin, TX',
  datetime('now')
),
(
  'c001a001-0000-4000-8000-000000000002',
  'APIWorks',
  'API infrastructure company building tools for developers to design, test, and deploy REST and GraphQL APIs at scale.',
  'https://apiworks.dev',
  'Developer Tools',
  '11-50',
  'San Francisco, CA',
  datetime('now')
),
(
  'c001a001-0000-4000-8000-000000000003',
  'AI Labs',
  'Applied artificial intelligence research lab building production ML models for healthcare, finance, and logistics.',
  'https://ailabs.ai',
  'Artificial Intelligence',
  '201-500',
  'New York, NY',
  datetime('now')
),
(
  'c001a001-0000-4000-8000-000000000004',
  'Quality First',
  'Quality assurance consultancy offering automated testing solutions, CI/CD pipelines, and test infrastructure for software teams.',
  'https://qualityfirst.qa',
  'Software Testing',
  '11-50',
  'Chicago, IL',
  datetime('now')
),
(
  'c001a001-0000-4000-8000-000000000005',
  'InfraTech Global',
  'Cloud infrastructure and DevOps consultancy helping companies migrate to AWS, GCP, and Azure with zero-downtime deployments.',
  'https://infratechglobal.com',
  'Cloud Infrastructure',
  '201-500',
  'Seattle, WA',
  datetime('now')
),
(
  'c001a001-0000-4000-8000-000000000006',
  'Agile Minds',
  'Agile coaching and digital transformation firm helping enterprises adopt lean practices and modern development workflows.',
  'https://agileminds.co',
  'Consulting',
  '51-200',
  'Denver, CO',
  datetime('now')
),
(
  'c001a001-0000-4000-8000-000000000007',
  'HelpDesk Pro',
  'SaaS platform for customer support teams with AI-powered ticketing, live chat, and knowledge base management.',
  'https://helpdeskpro.com',
  'Customer Support Software',
  '51-200',
  'Portland, OR',
  datetime('now')
),
(
  'c001a001-0000-4000-8000-000000000008',
  'WebDev Masters',
  'Full-service web development agency specializing in React, Next.js, and headless CMS solutions for startups and enterprises.',
  'https://webdevmasters.io',
  'Web Development',
  '11-50',
  'Barcelona, Spain',
  datetime('now')
),
(
  'c001a001-0000-4000-8000-000000000009',
  'BigData Solutions',
  'Big data engineering company building real-time data pipelines, ETL frameworks, and analytics platforms on Spark and Kafka.',
  'https://bigdatasolutions.io',
  'Data Engineering',
  '201-500',
  'Berlin, Germany',
  datetime('now')
),
(
  'c001a001-0000-4000-8000-000000000010',
  'AppFactory Inc.',
  'Mobile app development studio creating cross-platform iOS and Android applications for healthcare and fintech clients.',
  'https://appfactory.io',
  'Mobile Development',
  '51-200',
  'Miami, FL',
  datetime('now')
),
(
  'c001a001-0000-4000-8000-000000000011',
  'CloudNative Corp',
  'Cloud-native software company building Kubernetes orchestration tools and microservices observability platforms.',
  'https://cloudnativecorp.com',
  'Cloud Native',
  '51-200',
  'Austin, TX',
  datetime('now')
),
(
  'c001a001-0000-4000-8000-000000000012',
  'UserCentric Design',
  'UX design studio focused on accessible, human-centered digital products for startups and Fortune 500 companies.',
  'https://usercentricdesign.co',
  'UX/UI Design',
  '11-50',
  'London, UK',
  datetime('now')
),
(
  'c001a001-0000-4000-8000-000000000013',
  'DataSecure Systems',
  'Data governance and privacy platform helping organizations comply with GDPR, CCPA, and SOC 2 requirements.',
  'https://datasecuresystems.com',
  'Data Privacy',
  '51-200',
  'Washington, DC',
  datetime('now')
),
(
  'c001a001-0000-4000-8000-000000000014',
  'SecureIT Labs',
  'Penetration testing and security auditing firm with a track record of protecting financial institutions and government agencies.',
  'https://secureitlabs.com',
  'Cybersecurity',
  '11-50',
  'Boston, MA',
  datetime('now')
),
(
  'c001a001-0000-4000-8000-000000000015',
  'AgileTech Solutions',
  'Nearshore software development company delivering agile squads for US startups needing backend, frontend, and DevOps talent.',
  'https://agiletechsolutions.co',
  'Software Development',
  '201-500',
  'Guadalajara, Mexico',
  datetime('now')
),
(
  'c001a001-0000-4000-8000-000000000016',
  'MobileFirst Studio',
  'Mobile-first product studio building consumer and enterprise apps with React Native and Flutter.',
  'https://mobilefirststudio.io',
  'Mobile Development',
  '11-50',
  'Toronto, Canada',
  datetime('now')
),
(
  'c001a001-0000-4000-8000-000000000017',
  'ScalableSystems',
  'Distributed systems consultancy specializing in high-throughput architectures, event sourcing, and CQRS patterns.',
  'https://scalablesystems.dev',
  'Backend Infrastructure',
  '51-200',
  'Amsterdam, Netherlands',
  datetime('now')
),
(
  'c001a001-0000-4000-8000-000000000018',
  'DeepLearning Labs',
  'Research-driven AI company building computer vision and NLP models for autonomous vehicles and smart manufacturing.',
  'https://deeplearninglabs.ai',
  'Artificial Intelligence',
  '201-500',
  'Toronto, Canada',
  datetime('now')
),
(
  'c001a001-0000-4000-8000-000000000019',
  'QualityAssurance Pro',
  'QA automation consultancy providing Selenium, Cypress, and Playwright frameworks for enterprise web applications.',
  'https://qualityassurancepro.com',
  'Software Testing',
  '11-50',
  'Buenos Aires, Argentina',
  datetime('now')
),
(
  'c001a001-0000-4000-8000-000000000020',
  'ReliableOps',
  'Site reliability engineering consultancy helping SaaS companies achieve 99.99% uptime with incident response automation.',
  'https://reliableops.io',
  'DevOps / SRE',
  '51-200',
  'Stockholm, Sweden',
  datetime('now')
),
(
  'c001a001-0000-4000-8000-000000000021',
  'TransformationHub',
  'Digital transformation partner for legacy enterprises, modernizing monoliths into microservices and cloud-native architectures.',
  'https://transformationhub.com',
  'Consulting',
  '201-500',
  'Madrid, Spain',
  datetime('now')
),
(
  'c001a001-0000-4000-8000-000000000022',
  'TechSupport Solutions',
  'Managed IT services and help desk outsourcing for small and medium businesses across North America.',
  'https://techsupport.solutions',
  'IT Services',
  '51-200',
  'Monterrey, Mexico',
  datetime('now')
),
(
  'c001a001-0000-4000-8000-000000000023',
  'CryptoTech Innovations',
  'Web3 infrastructure company building developer tools for DeFi protocols, smart contract auditing, and on-chain analytics.',
  'https://cryptotechinnovations.io',
  'Blockchain / Web3',
  '11-50',
  'Zurich, Switzerland',
  datetime('now')
),
(
  'c001a001-0000-4000-8000-000000000024',
  'DataInsights Corp',
  'Business intelligence platform turning raw data into actionable dashboards, reports, and predictive analytics for enterprises.',
  'https://datainsights.corp',
  'Business Intelligence',
  '201-500',
  'Singapore',
  datetime('now')
),
(
  'c001a001-0000-4000-8000-000000000025',
  'MobileTech Studio',
  'Cross-platform mobile development agency building performant apps for retail, logistics, and on-demand services.',
  'https://mobiletechstudio.co',
  'Mobile Development',
  '11-50',
  'Mexico City, Mexico',
  datetime('now')
),
(
  'c001a001-0000-4000-8000-000000000026',
  'DocuTech Solutions',
  'Document automation and e-signature platform for legal, HR, and finance teams looking to eliminate paper workflows.',
  'https://docutech.solutions',
  'Document Automation',
  '51-200',
  'Dublin, Ireland',
  datetime('now')
);

-- ============================================
-- STEP 2: Link jobs to their companies
-- ============================================

UPDATE jobs
SET companyId = (SELECT id FROM company WHERE name = jobs.company)
WHERE companyId IS NULL AND company IS NOT NULL;
