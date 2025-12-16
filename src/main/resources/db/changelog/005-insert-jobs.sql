--liquibase formatted sql
--changeset samson.kayode:005


INSERT INTO jobs (title, category_id, description, company)
VALUES

-- 1. Information Technology
('Frontend Developer', 1,
 'Develop responsive web interfaces using HTML, CSS, JavaScript, and React.',
 'TechSpark Innovations'),

('IT Support Specialist', 1,
 'Provide technical assistance, troubleshoot hardware/software issues, and support company systems.',
 'GlobalTech Services'),

-- 2. Engineering
('Mechanical Engineer', 2,
 'Design, analyze, and maintain mechanical systems and manufacturing equipment.',
 'Prime Engineering Ltd'),

('Civil Engineer', 2,
 'Oversee construction projects and ensure compliance with structural standards.',
 'BuildRight Construction Co.'),

-- 3. Finance & Accounting
('Accountant', 3,
 'Prepare financial statements, handle bookkeeping, and ensure tax compliance.',
 'GreenLeaf Microfinance'),

('Financial Analyst', 3,
 'Analyze financial performance, build forecast models, and prepare investment reports.',
 'BlueStone Capital'),

-- 4. Education & Training
('Mathematics Teacher', 4,
 'Teach mathematics to secondary students and prepare lesson plans.',
 'Springfield Academy'),

('Corporate Trainer', 4,
 'Facilitate professional development programs and deliver training workshops.',
 'ProLearn Consulting'),

-- 5. Healthcare & Medical
('Registered Nurse', 5,
 'Provide patient care, administer medication, and support clinical workflows.',
 'Lifeline Hospital'),

('Medical Laboratory Scientist', 5,
 'Conduct diagnostic tests, analyze samples, and maintain lab equipment.',
 'HealthCheck Diagnostics'),

-- 6. Sales & Marketing
('Sales Executive', 6,
 'Identify prospects, convert leads, and manage customer relationships.',
 'StarTrade Nigeria'),

('Digital Marketing Specialist', 6,
 'Plan and execute online campaigns, SEO/SEM, and social media strategies.',
 'AdReach Media'),

-- 7. Human Resources
('HR Generalist', 7,
 'Manage recruitment, onboarding, payroll, and employee relations.',
 'PeopleFirst Consulting'),

('Talent Acquisition Specialist', 7,
 'Source, screen, and hire top talent for various departments.',
 'TalentBridge Agency'),

-- 8. Customer Service
('Customer Service Representative', 8,
 'Handle customer inquiries, complaints, and feedback across channels.',
 'QuickConnect Support'),

('Call Center Agent', 8,
 'Respond to incoming calls, resolve issues, and escalate when necessary.',
 'HelpDesk 24/7'),

-- 9. Manufacturing & Production
('Production Supervisor', 9,
 'Manage production lines, supervise workers, and ensure efficiency.',
 'MetalWorks Industries'),

('Quality Control Officer', 9,
 'Inspect products, ensure compliance with quality standards, and document issues.',
 'PerfectFit Manufacturing'),

-- 10. Logistics & Supply Chain
('Logistics Coordinator', 10,
 'Plan shipments, track inventory, and coordinate delivery schedules.',
 'Speedy Logistics'),

('Warehouse Manager', 10,
 'Oversee warehouse operations, inventory management, and safety procedures.',
 'MegaStore Distributions'),

-- 11. Construction & Real Estate
('Site Supervisor', 11,
 'Supervise construction sites, manage workers, and ensure project timelines.',
 'UrbanBuild Nigeria'),

('Real Estate Agent', 11,
 'Assist clients in buying, selling, and renting properties.',
 'PrimeHomes Realtors'),

-- 12. Hospitality & Tourism
('Hotel Receptionist', 12,
 'Greet guests, manage bookings, and coordinate hotel operations.',
 'Sunset Hotels'),

('Tour Guide', 12,
 'Conduct tours, provide information, and ensure visitor safety.',
 'Explore Naija Travels'),

-- 13. Creative & Design
('Graphic Designer', 13,
 'Design digital and print materials using Adobe tools.',
 'Cre8ive Studios'),

('UI/UX Designer', 13,
 'Create user-friendly interfaces and improve user experience through research.',
 'SoftWave Digital'),

-- 14. Legal
('Legal Assistant', 14,
 'Support lawyers with documentation, research, and case preparation.',
 'LexPartners Chambers'),

('Compliance Officer', 14,
 'Ensure organizational compliance with regulatory standards and laws.',
 'RegulaCheck Ltd'),

-- 15. Agriculture
('Farm Manager', 15,
 'Oversee daily farming activities, workers, and agricultural production.',
 'GreenField Farms'),

('Agricultural Technician', 15,
 'Monitor crops, maintain equipment, and support farm operations.',
 'AgroTech Support Services'),

-- 16. Government & Public Sector
('Administrative Officer', 16,
 'Handle official documentation, public service support, and administrative tasks.',
 'Federal Civil Service Commission'),

('Community Development Officer', 16,
 'Coordinate social programs and engage local communities in development initiatives.',
 'Lagos State Development Agency'),

-- 17. Others
('Project Coordinator', 17,
 'Assist in project planning, execution, documentation, and team coordination.',
 'NextGen Solutions'),

('Office Assistant', 17,
 'Handle office tasks, organization, and basic administrative duties.',
 'BrightPath Services');
