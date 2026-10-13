-- Participant Handbook: admin-managed sections shown on /participant-handbook.
CREATE TABLE "HandbookSection" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "part" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "HandbookSection_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "HandbookSection_order_idx" ON "HandbookSection"("order");

ALTER TABLE "HandbookSection" ADD CONSTRAINT "HandbookSection_createdById_fkey"
    FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Initial content from HU013.02 Participant Handbook 2025 (version 2).
-- Migrations run once, so sections the admin later edits or deletes are never restored.
INSERT INTO "HandbookSection" ("part", "title", "content", "order", "updatedAt") VALUES
    ('Section 1: Our Organisation', 'Welcome to Health U Australia', 'This handbook explains the disability services and supports we provide and how they may assist you in achieving your goals. Importantly, this handbook explains how we partner with you to meet your support needs.', 10, CURRENT_TIMESTAMP),
    ('Section 1: Our Organisation', 'Handbook Details', '| Detail | Information |
|---|---|
| Address | Shop MM20, Level 2, 109-129 Blaxland Road, Ryde NSW 2112 |
| Phone | 0481707758 |
| ABN/ACN | 89661174821 |
| Version | 2 |
| Approval date | 20/05/2025 |
| Review date | 20/05/2026 |', 20, CURRENT_TIMESTAMP),
    ('Section 1: Our Organisation', 'About Us', 'Health U is built on a set of key core values that we adhere to and pride ourselves on.

**Contact details**

| Address | Shop MM20, Level 2, 109-129 Blaxland Road, Ryde NSW 2112 |
| Phone | 0481707758 |
| After hours contact | 0481707758 |
| Email | info@healthuau.com |', 30, CURRENT_TIMESTAMP),
    ('Section 1: Our Organisation', 'Your Contact Person', '**Contact details**

| Contact person | Audrey Wong – Support Service Manager |
| Phone | 0481707758 |
| Email | info@healthuau.com |
| Emergency Contact | Audrey Wong 0481707758 |', 40, CURRENT_TIMESTAMP),
    ('Section 1: Our Organisation', 'Our Vision', 'Our vision statement:

**Get your time back and focus on what truly matters while we take care of everything in between.**', 50, CURRENT_TIMESTAMP),
    ('Section 1: Our Organisation', 'Our Mission', 'Our mission statement:

**Our mission is to help make your life simple by enabling you to find professionals and support workers that can help your with a range of things.**', 60, CURRENT_TIMESTAMP),
    ('Section 1: Our Organisation', 'Our Values', 'Our values:

### What we stand for

Health U is built on a set of key core values that we adhere to and pride ourselves on.

### People-centric, high-quality customer support

We provide you with the right support, helping your clients reach their personal and health goals. We run rigorous quality checks, monitoring closely every job engaged through us to ensure it’s being performed to a high standard, delivering exceptional customer service experience every time, no exception.

### Diversity-oriented: fair access to specialised care for all

Fostering the culture of inclusivity, we guarantee respect and fair treatment for individuals from diverse cultural and linguistic backgrounds, first nations, LGBTQI+ communities, financially disadvantaged persons and any other marginalised groups. Our promise is that Health U is a safe space for people from all walks of life.

### Tailoring our services in accordance with your needs

We work with you and for you, doing our best to accommodate you. We strive to find the right solutions that suit best for your client’s personal circumstances, Connecting you with the right people for your tasks and assignments.', 70, CURRENT_TIMESTAMP),
    ('Section 1: Our Organisation', 'Organisation Structure', '| Position | Name |
|---|---|
| Support Service Manager | Audrey Wong |
| Admin / Rostering team | Allana Mae Apostol |
| Social Worker/ Support Services Specialist | Isabelle Ip |', 80, CURRENT_TIMESTAMP),
    ('Section 1: Our Organisation', 'Our Services', 'Health U Australia offers services and supports to people with disabilities. We are funded under NDIS to provide support and services under the following registration groups:

- 0106 Assist-Life Stage, Transition
- 0107 Assist-Personal Activities
- 0108 Assist-Travel/Transport
- 0115 Daily Tasks/Shared Living
- 0117 Development-Life Skills
- 0120 Household Tasks
- 0125 Participate Community
- 0136 Group/Centre Activities', 90, CURRENT_TIMESTAMP),
    ('Section 1: Our Organisation', 'NDIS Access and Entry Requirements', 'To be eligible for the NDIS, you must:

- have a permanent and significant disability or a developmental delay;
- be an Australian citizen, hold a Permanent Visa or a Protected Special Category Visa;
- be under 65 years of age; and
- require support from a person or equipment to do everyday activities.

To be eligible for our NDIS services and supports, you must:

- meet the NDIS eligibility criteria;
- have an NDIS Plan that identifies the services and supports to be provided;
- have an NDIS Plan that requires services that are included in our registration groups; and
- have funds available in your NDIS Plan to pay for our services.

**Note:** We also provide services on a ‘fee for service’ basis. Please let us know if you wish to pay fee for service.

The best way to receive information about all the services available is to speak to the Health U Australia contact person. You are entitled to receive information regarding our services, and we want to provide you with the most appropriate ones.', 100, CURRENT_TIMESTAMP),
    ('Section 1: Our Organisation', 'Words We Use and What They Mean', '| Keyword | Meaning |
|---|---|
| Worker | This includes employees, contractors and volunteers at our organisation. |
| Participant | A person with disability who meets the access requirements to become a participant in the NDIS. For the purposes of this document, when we say ‘participant’ it refers to you, or your family, carer or advocate. |
| Workplace or environment | Where service delivery takes place. This includes your home, during transport, in community spaces, public spaces or other facilities. |
| Service | The services and activities we deliver are related to a Service Agreement and Support Plan. |
| We, us and our | Within this context ‘we’ refers to Health U Australia. |', 110, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Your Voice', 'We want to hear about your lived experience, your needs, preferences and goals and how we can provide you with services to support you to live your best life. Your input into our services and practices is essential to ensure we provide services to help you reach your goals. Please let our Support Service Manager know if you have any suggestions on how we can improve our governance structures, policies, procedures and processes – including our documentation. Your input helps us continuously improve so we can provide safe and quality services.', 120, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Your Needs, Circumstances, Preferences and Goals', 'You are at the centre of our services. We will partner with you to learn about your needs, circumstances, preferences and goals to design the right supports for you.

We will listen to you when you tell us what services and supports you need and how, when and by whom you want them delivered. We will design a service that assists you in maintaining and improving your lifestyle, increasing your independence and involvement in the community and empowering you to live your best life.

Your Support Plan is developed with you as its focus. We will create the Plan in collaboration with you, your family or advocate, our team, and any other relevant stakeholders. Assessments will be undertaken before you receive services and supports from Health U Australia. Our Support Service Manager/ Support Service Specialist will conduct assessments face-to-face with you, your family and/or advocate.

Your Support Plan will be person-centred and take an individualised approach. The Plan will focus on you as an individual and be designed to promote your independence. We will record your unique skills and strengths, together with your goals and aspirations. The Plan will be flexible and open to change, depending on your progress and other factors. Health U Australia will regularly review your Plan to ensure that we meet your needs, preferences and goals. We welcome your feedback regarding the services and supports we provide you.

You can ask your worker about your Support Plan. You can seek more information and clarification about your Plan at any time from your worker. If it is outside their capability to inform you, we will contact you to discuss your Plan.

We follow the process below to commence the development of the Support Plan:

1. Health U Australia will perform assessments face-to-face with you, your family and/or your advocate. Any specific access or entry requirements we have will be discussed with you.
2. Assessment interview time/s are arranged by telephone. Your advocate will be invited to be present (if applicable).
3. During your first meeting, the Support Service Manager/ Support Service Specialist will explain our assessment process to you. They will provide information on collecting and using personal data, privacy, information-sharing, and confidentiality considerations. They will also remind you that an advocate can be arranged if you want one.
4. If you have specific communication needs, our Support Service Manager/ Support Service Specialist will make the necessary arrangements to ensure these needs are considered. For example, interpreters and translated information can be provided. If you have a vision impairment or hearing loss, we will make the necessary arrangements for the essential support service during assessments.
5. The Support Service Manager/ Support Service Specialist will inform you of your right to opt-out of sharing your personal information to meet government requirements.
6. The Support Service Manager/ Support Service Specialist will review completed assessments. Identified areas of your strengths and needs will form the basis of your care discussions.
7. Developing your Support Plan is a consultative process between all relevant parties. Here we will look at various areas related to your services, such as:
   - risks to you and your environment;
   - emergency and disaster management;
   - mealtime management (if required);
   - your health needs, including comprehensive assessments, oral health and medication requirements; and
   - how we can assist you in gaining vaccines or other clinical services.
8. We will explain your Support Plan and give you time to review the Plan. Let us know what needs changing or adjusting or if it works for you.
9. Once your Plan has been determined and you are happy with it, we will ask you to sign off on it. You will be provided with a copy of your Plan.
10. Health U Australia will regularly assess your Support Plan to check that your needs are being met.
11. Our Support Service Manager/ Support Service Specialist will collect information when they work with you. This information is entered into your client record so we have evidence-based information to check that our service delivery meets your current needs, circumstances, preferences and goals.
12. Health U Australia will conduct regular assessments with you to review your Support Plan and make sure the support you are receiving still meets your needs. This review will happen at least every year, but it may happen earlier if required.
13. We can re-negotiate your Service Agreement to take into consideration any changes in your needs or circumstances. This may include a:
   - change to your support worker or representative; and/or
   - request to increase or decrease the number or types of services we provide.
14. You can opt-out of providing the information requested by government bodies such as the NDIS. Please inform our Support Service Manager/ Support Services Specialist if you want to opt-out.', 130, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Networking and Participating in Community', 'We are committed to encouraging and supporting you to engage with your networks and community to ensure you are offered the opportunity to be involved in activities and areas of interest. This includes assisting you to access religious groups, local cultural or ethnic groups, community and any other service or group that you would like to access.', 140, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Communicating with You', 'Following our initial assessment of your communication needs, we will provide written, verbal or translated options to communicate with you on an ongoing basis.

If there is a language, mode or method of communication that best suits you, please let our team know, so we can arrange this for you. We will record this in your Support Plan to ensure our workers communicate with you in your preferred way and in a way in which you are most likely to understand.

If you are from a non-English speaking background, we can engage an interpreter if you would like one. We will only engage an interpreter if we have your permission.

The interpreter will attend meetings with you and record all meeting information in your record. We can arrange for a telephone interpreter service in an emergency or a crisis.', 150, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Assistance with Medication', 'The Support Service Manager/ Support Services Specialist will discuss your medication requirements with you and then complete an assessment regarding your medication needs. If our Support Service Manager/ Support Services Specialist has concerns regarding your ability to manage your medication safely, they will complete a Self-Administration of Medication Assessment.

During your assessment, our team will determine if you have any issues with taking medication and how we can arrange a medication plan to support you.', 160, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Management of Budgets, Statements and Fees', 'You receive NDIS funding to pay for your disability support and support management. Your funding lets you decide the type of disability support you need and want, who provides it and where it is provided. Thank you for choosing Health U Australia as part of your support team. Our team will never offer you financial advice or recommendations, you should speak to a financial adviser for that.

Health U Australia will regularly inform you of the cost of the services being provided. We are transparent with our fee structure. When starting your service with us, we will provide you with a statement outlining your fees, and we will then provide you with a monthly statement outlining your fees.

Fees may be changed during your service delivery, but you will be informed of this increase two (2) weeks in advance.

**Please note:** There are annual changes in the NDIS Pricing Arrangement and Price Limits. These will automatically adjust your fees.

Before services are provided, we will inform you of the following:

- chargeable fees;
- payment methods (i.e. direct debit, cheque, money order. Please never pay a worker directly);
- your budget (or the amount of money you can spend); and
- methods for payment of fees.

If you use the National Disability Insurance Agency (NDIA) to manage your funds (i.e. you are ‘plan managed’, Health U Australia will work with the NDIA.', 170, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Your Money and Property', 'Your money, or other property, will only be used for the purposes you request, and with your (or your family/authorised representative/advocate’s) consent.

Your Service Agreement and Support Plan will outline the assistance you need relating to your money and property.

If your Support Plan requires workers to be involved in handling your money or property, strict procedures will be followed to protect you from financial abuse. For example, if you require workers to assist you with banking, or paying household bills, you (or your family/authorised representative/ advocate) must approve the arrangement and complete a Participant Money and Property Consent Form.

You, your family or your advocate should sign the Service Agreement and Support Plan. If you don''t want to sign the Service Agreement and Support Plan, we will record the reasons for future reference.

Our workers are not permitted to provide you with financial advice or information other than what is required under your Support Plan.

Health U Australia undertakes an annual audit of your money and property supports and will provide you with a copy of this report.', 180, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Authority to Hold Key(s)', 'If our workers need to hold your house or unit key, or have access to a house key code to provide your services, the Authority to Hold Key Form will need to be completed by yourself and our Support Service Manager/ Support Services Specialist on your admission to our service, or when the need arises.

When you no longer want us to hold your house or unit key or know your house code, you must complete a Withdrawal of Authority to Hold Key Form. The Support Service Manager/ Support Service Specialist will help you to do this.', 190, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Your Transport Needs', 'During your initial meeting with Health U Australia, we will discuss your transport requirements. Together, we will determine the most appropriate transport services to meet your needs and if this is required as part of your package or as an additional service.

If you did not arrange transport as part of your Service Agreement, Health U Australia can arrange to include transport services as part of your package or as an additional service. Contact our Support Service Manager/ Support Service Specialist for assistance.', 200, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Service Termination, Suspension and Leave', 'Your needs and circumstances may change, which may mean you need to transition (move) to another provider. Health U Australia will assist and support you during this process. With your approval, we will work with the other service providers to ensure your smooth transition meets your needs.

If you leave our service and want to return, we would be pleased for you to come back. You will need to:

- meet the program requirements to access funding, including prioritisation;
- be placed on a waiting list (if no positions are currently available) and be contacted once a position is available;
- undergo a risk assessment that reviews the risks relating to staying and leaving our service;
- undertake a screening assessment;
- agree to the conditions of the program; and
- pay any relevant fees.

During temporary absences, such as a hospital visit or respite, our team will regularly contact you, your family or your advocate when planning your entry to or exit from our service. We will also assist you in contacting the hospital to book any appointments.

You may terminate our services for any reason, and at any time, but you need to provide us with the length of notice included in your Service Agreement.

You may also request that your services be suspended, as outlined in the Service Agreement.

You may leave Australia on holiday or for another reason. There is a grace period of six (6) weeks before the NDIS reviews your need to continue our services.

Health U Australia has the right to stop providing services if you do not meet your responsibilities as outlined in the Service Agreement, or if we no longer have the capacity or resources to provide you with the required services.

You will never be excluded from service provision because of a ''dignity of risk'' choice, or for any other reason if you’re eligible to receive services and we are able to provide the services. In all cases, we will speak with you and discuss the reasons for any service withdrawal.

Where you agree to transfer to a different service provider where required, we will assist you in this process of finding another service provider.', 210, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Witnessing Legal Documents', 'Workers at Health U Australia are not permitted to witness any legal documents, including a Will. Health U Australia does not store Wills on your records. If you require legal assistance, or information on Wills, we recommend you contact a legal firm and/or the Public Trustee, who can arrange to manage your Will on your behalf.', 220, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Service Agreement', 'Once Health U Australia has been selected as your service provider, we will develop a Service Agreement with you, your family or your advocate (if required). This Service Agreement will list the Schedule of Supports, the responsibilities of Health U Australia, your responsibilities (as a participant), your emergency and disaster plan and our cancellation policy.

If or when your needs or circumstances change, or when you request an increase or decrease in the number or type of services, renegotiating your Service Agreement may be required. Our Support Service Manager/ Support Service Specialist will advise you if this is the case and arrange for a revised Service Agreement to be prepared.', 230, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Charter of Rights', '### Your Rights

As an individual, you have many rights, and we support and assist you in identifying and exercising these rights to achieve your goals. Health U Australia adopts a policy of non-discrimination regarding eligibility and entry to our services and when providing support services to you.

You have the right to:

- access supports that promote, uphold, and respect your legal and human rights;
- exercise informed choice and control to maximise independence;
- freedom of expression, self-determination and personal decision-making;
- access supports that respect your culture, diversity, values and beliefs;
- a support service that respects your right to privacy and dignity;
- be helped to make informed choices that will maximise independence;
- receive support that is free from violence, abuse, neglect, exploitation or discrimination;
- receive supports which are overseen by strong operational management;
- receive services that are safeguarded by informed and compliant risk and incident management systems;
- receive services from workers who are competent, appropriately qualified and have expertise in providing person-centred supports;
- advise consent to the sharing of information between providers during the transition; and
- opt-out of giving information as required by NDIS.

### Your Responsibilities

The information below explains your responsibilities when using our services. We ask that you:

- respect the rights of workers to have a workplace that is safe and healthy and free from abuse or harassment;
- comply with the terms of your agreement with us;
- understand that your needs may change, meaning your services may need to change;
- accept responsibility for your actions and choices, even though some decisions may involve risk;
- tell us if you have problems with the care or service you are receiving from us;
- provide us with enough information to develop, deliver and review your Support Plan;
- care for your health and well-being as much as you are able;
- provide us with information that will help us to meet your needs
- provide us with a minimum of 24 hours’ notice if you need to cancel your service;
- remember that our workers are only authorised to perform the agreed number of hours and tasks outlined in your Service Agreement;
- participate in the safety assessments of your home;
- ensure your pets are controlled during service provision;
- provide a smoke-free working environment;
- pay the agreed amount for the services provided;
- tell us in writing (where able) and provide appropriate notice when you want to stop receiving our services; and
- inform a worker if you wish to opt-out of providing your information to government bodies such as NDIS.

### Our Responsibilities

Health U Australia will:

- provide the supports that meet your needs at your preferred times;
- regularly review the provision of your support with you;
- communicate openly, honestly and promptly;
- treat you with courtesy and respect;
- discuss with you all decisions regarding your supports and how they are being provided;
- listen to your complaints and feedback, and address any problems that may arise;
- provide you with 24 hours'' notice if we need to change a scheduled support provision appointment;
- keep your personal information confidential;
- provide safe environments – and respect and support your culture, community and identity; and
- implement policies and procedures to ensure your safety and the safety of others during service provision.', 240, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Conflict of Interest', 'Health U Australia is committed to ensuring that actions and decisions taken at all levels in our organisation are informed, objective and fair. A conflict of interest may affect how a worker acts or their choices. Identified conflicts of interest require action to be undertaken by our organisation to ensure that personal or individual interests do not impact your or our services, activities or decisions.

Health U Australia requires all workers to declare their involvement in external work-related activities to allow for discussion and management of potential conflicts of interest by the Support Service Manager/ Support Service Specialist.

Please let us know if you feel there is, or may be, a conflict of interest involving a worker providing you with services and we will activate our conflict of interest process to resolve this.', 250, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Gifts', 'Health U Australia recognises that you may, on occasion, like to give a gift to a worker. If you wish to give a gift, we prefer that it is something that can be shared by all workers (e.g. flowers, a cake or chocolates).

Please NEVER offer or provide money to a worker, because this is a conflict of interest. Workers are paid professionals and they are made aware that they are not permitted to accept any offer of money from you.', 260, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'NDIS Code of Conduct', 'Health U Australia and our workers follow the NDIS Code of Conduct by:

- acting with respect for individual rights to freedom of expression, self-determination, and decision-making following relevant laws and conventions;
- respecting your privacy;
- providing supports and services in a safe and competent manner with care and skill;
- acting with integrity, honesty, and transparency;
- promptly taking steps to raise and act on concerns regarding matters that might have an impact on the quality and safety of supports provided to you;
- taking all reasonable steps to prevent and respond to all forms of violence, exploitation, neglect and abuse toward you;
- taking all reasonable steps to prevent sexual misconduct towards you.', 270, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Harm and Risk of Harm', 'Health U Australia recognises your right to feel safe and to live in an environment where you are protected from assault, violence, abuse, neglect, exploitation or any other form of harm.

We follow the National Principles for Child Safe Organisations and we support all children and young people to live in a safe and supportive environment and report any suspicions, real or potential risks of harm.

We encourage and support any person who has witnessed violence, abuse, neglect or any other form of harm towards one of our participants, or suspects that abuse has occurred, to make a report and be confident of doing so without fear of retribution. Our reporting process includes any kind of harm, including financial, emotional, social, psychological, sexual, physical abuse or neglect. A report of harm is a reportable incident and we will contact and work with all authorities – Police, NDIS and state or territory government departments as required.

You can make a report to whomever you feel comfortable and safe with; this may include one of our workers, a family member, your advocate or a trusted friend.

If you would like to speak with someone outside of Health U Australia, you can contact the NDIS Quality and Safeguards Commission by:

- Phone: 1800 035 544 (free call from landlines) or TTY 133 677
- National Relay Service and ask for 1800 035 544
- Interpreters can be arranged.
- You can also complete an NDIS Complaint Contact Form online.

Health U Australia acknowledges that prevention is the best protection from harm or risk of harm and recognises our duty of care to identify potential risks to your health, safety and wellbeing. Our prevention strategies include engaging skilled and trained workers, who are aware of, and respect participants'' human and legal rights. Our workers will assist you, your family or your advocate to access our complaints process and raise any concerns regarding our service provision, either internally or externally if preferred.

Where any form of violence, abuse, neglect, exploitation or any other form of harm has occurred, Health U Australia will respond quickly and appropriately to protect you from further harm. We will support you to access any required counselling, medical and/or legal assistance.

When you make allegations of violence, abuse, neglect, exploitation or discrimination, you have the right to have an advocate present. Health U Australia can arrange this for you if you would like an advocate to speak on your behalf.', 280, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Family Assistance and Support', 'Health U Australia encourages, where applicable, input and support from your family in the support planning and delivery process. We will assist you to maintain contact with your family and we will engage and communicate with your family, if you give us your consent to do so, so that we can work together to access the services you require and want. Your family is welcome to contact us at any time for information and support.

We can help your family by:

- communicating with them using a language, mode and method they are most likely to understand;
- providing information regarding available services, including those offered by other agencies;
- helping to build trust and respect between workers, you and your family;
- providing them with the opportunity to take part in service delivery planning;
- creating opportunities to develop links with you;
- assisting them in accessing counselling and support services;
- providing them with access to effective complaint procedures; and
- helping them to access advocacy services where required.', 290, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Continuity of Support', 'The Support Service Manager/ Support Service Specialist will arrange your Schedule of Supports, so you know who will work with you, and when and how, to deliver your services and support. We will provide you with workers who have the skills and knowledge you require. Wherever possible, we will meet your support requests. For example, if you would like a worker who speaks the same language as you, who shares similar cultural, religious or spiritual beliefs and/or who meets other specific criteria you request.

In the event your regular worker is unavailable for a scheduled support service, Health U Australia:

- Will contact alternate workers with relevant qualifications as suitable replacements;
- Where possible, will provide a worker who has worked with you before and is aware of your needs, circumstances, preferences and goals;
- Where possible, will give you notice of this change of worker.
- Will gather your feedback on the replacement worker on completion of the service and record this so this worker can be requested again if the need arises;
- Will brief the alternate worker on your specific needs and preferences to ensure continuity of support;
- Will refer to our records and never place someone to support you who you do not wish to have.', 300, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Emergency and Disaster Planning', 'We will create an emergency and disaster plan with you and other relevant support networks. This emergency plan will be trialled before we activate it, and workers will consult with you about changes and improvements. This plan will be reviewed, and adjusted as required, after an emergency or disaster.

Your emergency and disaster plan is attached to your Service Agreement.', 310, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Health Referrals and Vaccinations', 'Our team will support you in obtaining any health referrals you need, with your consent and any vaccinations that you request. We will work out a plan with you. We will look at how you will get to the clinic, or surgery or vaccination location and the support you need during and after the visit.', 320, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Infection Management', 'Health U Australia is committed to prioritising your health and wellbeing. We will take all measures required to reduce contamination in your environment and prevent and manage infection outbreaks. This includes workers wearing masks or gowns, regular cleaning of surfaces with antibacterial gels, regular handwashing. All workers are trained in infection management processes in accordance with our Infection Management Procedure. We ask that you please ensure that you keep yourself and your environment as clean as possible.', 330, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Your Advocacy Rights', 'An advocate is a person who will listen to you, help you make decisions about what should happen in your life and then speak, on your behalf, to ensure your decisions about your life are being implemented. An advocate will ensure your rights are respected and speak out for you if your needs or preferences are not being met.

You can ask anyone that you know well and trust to be your advocate, such as a family member or a friend. Alternatively, you can engage an advocate from a professional advocacy service.

Health U Australia can help you find an advocate by providing a list of available advocacy services. Once you have selected an advocate, the Support Service Manager/ Support Service Specialist will provide you with a form that must be completed called the Authority to Act as an Advocate Form.

With your permission, Health U Australia will:

- provide your advocate with all the information they need to ensure that we (and any other service providers) are acting in your best interest;
- work closely with your advocate and involve them in the planning of services that will be provided to you;
- ensure our workers understand the role of your advocate, and engage with them as required.

Health U Australia will ensure that your advocate is invited to attend:

- consultation meetings;
- person-centred planning meetings and reviews; and
- any other relevant meetings or conferences.

You can use your advocate:

- any time you wish to communicate with us;
- during your initial assessment consultation;
- during your interviews and reviews;
- during service delivery;
- when you want to make a complaint; and
- when you want to give feedback.

We encourage you to bring your advocate to your initial assessment meeting to ‘be your voice’ during the planning process, guiding and developing your person-centred Support Plan. Your advocate is welcome to attend any other meeting and speak on your behalf at any time.

Health U Australia will listen to your advocate if they want to discuss problems or concerns they may have in relation to our service provision.

You can change your advocate at any time. If you change your advocate, please inform us as soon as possible so we can update your information and ensure that we talk to the correct person.', 340, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Consent', 'When you provide consent, you give your permission for something to happen, or to be done, relation to your needs or preferences.

It is your human and legal right to provide, change or withdraw consent in relation to any aspect of service provision or information-sharing at any time. If you want more information about this, you can contact our Support Service Manager/ Support Service Specialist or your advocate, for help.

Health U Australia will obtain your consent to:

- provide your services and supports in accordance with the Service Agreement and Support Plan;
- undertake any clinical or health-related tasks, activities and/or procedures;
- administer your medication, if required;
- refer you to see a doctor, dentist or any other health practitioner;
- read your personal information that other service providers have about you;
- provide your personal information to other service providers, your family or your advocate;
- collect data relating to you for funding bodies;
- ask other people to attend your person-centred planning meeting; and
- carry out any training programs or behaviour support programs we suggest could be put in place for you;

Consent will be documented in your Support Plan. However, we will also ask you to sign a consent form to release your personal information.

We will always ask for your permission and explain the reasons for accessing your information when providing it to a worker or another service provider. If you are unsure during this process, you should ask your advocate for help.

If you feel you cannot provide consent, or need support to do so, we can talk to your family or advocate and ask them to assist. If you do not have family who can make decisions for you, or you do now want family to make decisions for you, we will help you apply to the court, or other government bodies (e.g. public trustee), to appoint a Guardian (who is legally appointed by a court) who can legally help you make these decisions.', 350, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Privacy and Confidentiality', 'Health U Australia complies with all relevant privacy legislation, regulations and standards. We have processes in place for the collection, use, disclosure and storage of your personal information, to ensure your privacy and confidentiality is properly maintained.

We will ask you to sign a Participant Information Consent Form which provides your consent for us to collect, use and disclose your personal information in accordance with the Privacy Act 1988 (Cth), the Australian Privacy Principles and applicable state or territory privacy legislation. Information regarding your privacy is also included in your Service Agreement.

Your Privacy Officer is the Support Service Manager/ Support Service Specialist and they can be contacted via:

- **Mail:** PO Box 31, Ermington NSW 1700
- **Phone:** 0481707758
- **Email:** info@healthuau.com

If you believe a breach of privacy has occurred, please notify our privacy officer immediately. If we identify that a breach of your personal information has, or may have, occurred, we will notify you immediately and take appropriate action to contain the breach. We will keep you informed of what actions we are taking.

If you are not happy with our response to a privacy breach, or you would like to gain information about privacy from an external party, you can complain to, or seek further information from the Office of the Australian Information Commissioner (OAIC) via:

- **Mail:** GPO Box 5218, Sydney NSW 2001
- **Fax:** 02 9284 9666
- **Email:** enquiries@oaic.gov.au
- **Online:** https://www.oaic.gov.au/

Health U Australia data is password-protected and stored on a secure online cloud server. We regularly back-up data to ensure record protection in case of a system crash or hard drive failure. Participant files are kept for seven (7) years, as required by legislation – or longer if the law requires us to keep it for longer. Aboriginal or Torres Strait Island participant files are stored indefinitely.', 360, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Access to your Personal Records', 'Health U Australia keeps personal records of our participants. At any time, you, or your advocate/guardian, can request access to your personal information. We will follow the process below to provide you with your personal information/records:

1. You, or your appointed advocate/guardian, request access to your records, verbally or in writing.
2. The Support Service Manager/ Support Service Specialist will confirm your request within 48 hours.
3. The Support Service Manager/ Support Service Specialist will update you about releasing your information within seven (7) working days.
4. A reply to your request for information will be provided within two (2) weeks of your request.
5. Personal information is only released with the approval of the Support Service Manager/ Support Service Specialist.
6. After we obtain your consent, we will provide your personal information to the agreed person.
7. The Support Service Manager/ Support Service Specialist can assist you in understanding the information and will explain the terminology used.
8. Sometimes, but not often, access to records may be denied. This will be based on advice received from our legal representative. In this event, we will discuss the outcome with you, your family and/or your advocate.', 370, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Incident Management', 'While we hope that a critical incident does not occur, in the event it does, we will support and assist you by following our rigorous incident management procedures, including managing reportable incidents to regulators.

A critical incident is an event (or alleged event) that occurs because of, or during, the delivery of services and has caused, or is likely to cause, a significant negative impact on your health, safety or well-being.

If an incident does occur, we will engage the required authorities to support you during this time.

Critical incidents that relate to you may include, but are not necessarily limited to:

- an unexpected death, serious injury or alleged assault (including physical, sexual abuse, sexual assault or indecent assault) that occurs as a result or during the delivery of services;
- allegations of serious, unlawful or criminal activity or conduct involving worker that has caused, or has the potential to cause, serious harm to you;
- an incident where you assault or cause serious harm to another person (e.g. another participant, or a worker) during the delivery of services;
- a severe fire, natural disaster, accident or another incident that will, or is likely to prevent, service provision, or that results in closure or significant damage to premises or property, or that poses a substantial threat to your health and safety.

Health U Australia has established procedures that identify, manage and resolve incidents which include the following:

- Workers will report all incidents to their line manager, in accordance with our incident management procedures.
- Workers will complete an incident report that identifies and records an incident accurately and comprehensively.
- The Support Service Manager/ Support Service Specialist is responsible for reporting incidents that are ''reportable incidents'' to the NDIS Commissioner and other required agencies.
- Compliance with the National Disability Insurance Scheme (Incident Management and Reportable) Rules 2018.
- Supporting and assisting you if you are affected by the incident.
- Review of the incident by the Support Service Manager/ Support Service Specialist if you or others were affected, to put in place any continuous improvements or safe guards required.
- Collaborating with you, your family and/or advocate to manage and resolve the incident.
- Reviewing the incident and making necessary amendments to systems and processes to reduce the risk of recurrence.', 380, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Complaints and Feedback', 'We actively encourage your feedback and input. This allows us to provide safe and quality services. You can provide feedback or complaints anonymously, or through written or online surveys or you can talk to your worker about your concerns and they will help you fill in a complaints form, if you prefer. We value your feedback on the following:

- quality of care received;
- consistency of services provided;
- support worker performance;
- supports that work for you;
- changes you want made to assist you; and
- what you like and dislike about our services.

You have the right to receive the best possible standard of service from us, and we will treat any concern or complaint you provide as a serious issue. Health U Australia has processes in place to ensure you do not experience any reprisal or retribution for a complaint you make.

You can make an anonymous complaint to our Support Service Manager/ Support Service Specialist using the Anonymous Complaints and Feedback form provided during the intake process.

You can make a complaint regarding our services or about a worker provided to work with you. If you do not feel comfortable making a complaint, someone else can do this on your behalf, including:

- an advocate;
- a family member;
- a close friend
- your care worker; or
- any other person you know and trust.

Below is a flowchart that demonstrates our commitment to your complaint or feedback. You can also be part of our feedback system by providing feedback and sharing ideas with our management. Don''t hesitate to contact us if you wish to express your thoughts, lived experience and ideas.

1. **Complaint received** – from workers, participants, advocates, family members, carers, anonymous person/s or members of the public.
2. **Managed by our Support Service Manager/ Support Service Specialist** – who manages, records, reviews, collaborates, investigates, communicates and plans actions to determine outcomes with the complainant.
3. **Investigation** – acknowledge, review, assess, investigate, decision-making and resolution, continuous improvement.
4. **Record-keeping** – document, maintain register, archive.
5. **Review and continuous improvement** – quarterly review for trends for governing body/management action. Do changes need to be made to process, rostering, training or communication?
6. **Management meetings** – each complaint is discussed in management meetings to facilitate compliance and continuous improvements.

Please send your complaints addressed to the Support Service Manager/ Support Service Specialist via

| Online complaints form | [HU58.01 Health U Complaints and Feedback Form](https://au1.documents.adobe.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhAxKEM2lwh_xvf5k_MXC3IUDRovgcFxtHxDLL6eu2l9zcfTEjPNYMbsCMNUoBzZa6I*) |
| Email | info@healthuau.com |
| Postal address | PO Box 31, Ermington NSW 1700 |

Once a complaint has been received, Health U Australia ''s Support Service Manager/ Support Service Specialist will investigate the complaint and find a resolution. The Support Service Manager/ Support Service Specialist will notify you in writing to confirm that your complaint has been received. We will provide you with the expected date Health U Australia of the complaint resolution.

The complaint will then be investigated, and a plan to resolve it will be created. You will be informed of this plan, and we will ask you to provide your opinion on our recommended solution. You can advise if you are happy with the proposed solution or unhappy with the outcome and feel the matter is not resolved.

If you are not happy with the solution proposed by Health U Australia regarding your complaint, you can speak to other organisations, such as:

### Commonwealth Ombudsman – Disability Services

- **Telephone:** 1300 362 072
- **Email:** ombudsman@ombudsman.gov.au
- **Website:** www.ombudsman.gov.au

### NDIS Complaints

- **Telephone:** 1800 800 110
- **Email:** feedback@ndis.gov.au or
- **Website:** https://www.ndis.gov.au/contact/feedback-and-complaints', 390, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Legislation and Standards', 'Health U Australia complies with all current legislation and standards. Please contact us if you would like us to send you a copy of the legislation that applies to our service. The primary legislation and standards that cover your service include the following:

- National Disability Insurance Scheme Act 2013;
- National Disability Insurance Scheme Practice Standards and Quality Indicators 2021; and
- State/territory-based Disability Act and Regulation.', 400, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Dignity of Risk', 'You have the right to participate in lawful activities that may involve risk. It is your life – and we want to support you to live your best life. We will always balance our duty of care to you, with your right to take informed risks — this is called ‘dignity of risk’. We will discuss this with you if you wish to undertake the activity. Any dangerous risk may require you to sign that you are willing to take the risk, and you understand the risk involved. In this case, we will discuss with you the various options available regarding the activity to help you make an informed choice.

We always assume that you can make your own choices unless there is clear evidence otherwise.', 410, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Risk Assessment', 'We will conduct an initial risk assessment during the intake process. We will also review your risks annually, or more often if your needs or circumstances change (e.g. changes to your health and wellbeing, living arrangements or physical environment). If we feel you need another review, or referral for review by a health practitioner, we will discuss this with you or your representative/advocate.

Your safety is at the centre of all we do, and we will partner with you during the risk assessment process.', 420, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Continuous Improvement', 'We are committed to providing you with safe and quality services that best suits your needs, circumstances, preferences and goals. To help us do this, we ask you to let us know how we can maintain and improve the services we provide to you. You can do this by giving feedback or making a complaint at any time.', 430, CURRENT_TIMESTAMP),
    ('Section 2: Working with You', 'Work Health and Safety', 'Under the Work Health and Safety Act 2011, Health U Australia has a duty, under the law, to make sure our workers have a safe and healthy work environment. Some things you can do to assist in this matter include:

- notifying our workers of any unsafe conditions in your home;
- participating in safety assessments of your home;
- arranging repairs of any hazards identified during our safety assessment of your home;
- ensuring your pets are controlled during service provision;
- providing a smoke-free working environment;
- providing a workplace for workers that is free of racial, sexual, physical or emotional abuse;
- treating our workers with dignity and respect;
- advising our workers if you are unwell or cannot do things the way you usually do them;
- telling our workers if your doctor has diagnosed you with a short-term infectious illness;
- providing cleaning equipment that is suitable and well maintained;
- providing safe, non-toxic cleaning products; and
- ensuring your mobility equipment and other items required to live independently in your home are available and well-maintained.

During our first service, we will conduct a safety risk assessment check and discuss any identified risks with you. The safety of the service will be reviewed with you on an ongoing basis, following state and federal work health and safety legislation.', 440, CURRENT_TIMESTAMP),
    ('Section 3: NDIS Practice Standards and Quality Indicators', 'About the NDIS Practice Standards', 'The NDIS Practice Standards and Quality Indicators create the foundation for ensuring safe and quality service delivery by providers and it is an essential benchmark for us to assess our performance and to demonstrate our compliance with the standards. Together with the NDIS Code of Conduct, the NDIS Practice Standards assist you in understanding what quality service provision you should expect from us.

These NDIS Practice Standards state your rights and responsibilities when delivering support and services to you.', 450, CURRENT_TIMESTAMP),
    ('Section 3: NDIS Practice Standards and Quality Indicators', '1. Participant Rights and Responsibilities', 'The standards addressed in this division include:

- 1.1 Person-Centred Supports
- 1.2 Individual Values and Beliefs
- 1.3 Privacy and Dignity
- 1.4 Independence and Informed Choice
- 1.5 Violence, Abuse, Neglect, Exploitation and Discrimination.

People with a disability have the right to respect, dignity and full participation in society. It is important to us that you know and understands your rights. We are here to support you and provide guidance and assistance in your choices.

We respect your right to privacy and the confidentiality of your personal information and records.

We recognise and respect your right to make your own decisions.

It is your right to try new activities and experiences, and we will assist you while ensuring that you are treated fairly and independently and are able to access the activities and experiences.

You have the right to talk freely and express your thoughts, opinions and choices. We will listen to you and support the choices you make. We will include your family, advocate and support workers in discussions, if and when you want them involved.

We understand that everyone communicates differently; we have various communication methods and will use a language, mode and method of communication in accordance with your needs and preferences.

We will support you in participating in the community of your choice and partner with you, and your family/alternate decision-maker/advocate to make this happen.

We will respect your cultural background and deliver services that suit your cultural, religious and spiritual needs and preferences.', 460, CURRENT_TIMESTAMP),
    ('Section 3: NDIS Practice Standards and Quality Indicators', '2. Provider Governance and Operational Management', 'The standards addressed in this division include:

- 2.1 Governance and Operational Management
- 2.2 Risk Management
- 2.3 Quality Management
- 2.4 Information Management
- 2.5 Feedback and Complaints Management
- 2.6 Incident Management
- 2.7 Human Resource Management
- 2.8 Continuity of Supports
- 2.9 Emergency and Disaster Management.

We encourage you to share your opinions and provide your feedback about anything related to the services we provide, whether they be good or bad. We welcome your input and want you to offer it without fear of reprisal, discrimination, or negative consequences.

You can ask for support from another person when making a complaint, such as a family member, support worker, advocate, or the Ombudsman.

Whatever the issue, we will do everything possible to solve your problem. We appreciate your opinion about our services and will introduce service improvements based on your feedback (when required).

Health U Australia recruits quality, caring workers, who receive ongoing training. We provide continuous improvement of services, correct working processes, and effective and transparent communication, which are key to our services'' success.

We will work closely with you to provide and maintain excellent service and support and strengthen our systems and processes to deliver positive results when resolving any problems. A systematic approach to emergencies and disasters assists us in supporting you in these circumstances.

Health U Australia ''s management possesses the skills and experience to implement and monitor the effectiveness of our policies and procedures and make necessary changes when required.', 470, CURRENT_TIMESTAMP),
    ('Section 3: NDIS Practice Standards and Quality Indicators', '3. Provision of Supports', 'The standards addressed in this division include:

- 3.1 Access to Supports
- 3.2 Support Planning
- 3.3 Service Agreements with Participants
- 3.4 Responsive Support Provision
- 3.5 Transitions to or from the Provider.

Health U Australia will support your goals and decisions regarding your chosen services. We will offer you guidance and assist you in identifying your strengths and weaknesses to develop appropriate skills to help you achieve your goals.

We will never discriminate against you, irrespective of age, gender, disability, cultural background or sexuality.

Health U Australia will assist anyone enquiring about our services. We will provide support and advice regarding the appropriateness of our services or give a referral to an alternative service that may be more suitable for you. You have the right to seek the service you need and access the support you require.

Health U Australia will encourage and help you to participate actively and meaningfully within the community of your choice.', 480, CURRENT_TIMESTAMP),
    ('Section 3: NDIS Practice Standards and Quality Indicators', '4. Provision of Supports Environment', 'The standards addressed in this division include:

- 4.1 Safe Environment
- 4.2 Participant Money and Property
- 4.3 Management of Medication
- 4.4 Mealtime Management
- 4.5 Management of Waste.

Health U Australia strives to keep you safe — both physically and emotionally. Our workers will report any actual or potential risks they observe.

We will work with you and/or your advocate to ensure you understand our fees and payment methods of our fees. All information will be clear and accurate.

If you require medication, our workers are trained in managing your medication appropriately. We will also ensure that you take your medication safely.

If you require mealtime support, once we identify that you need mealtime assistance with your diet, dysphagia or similar, we will create a plan to support your mealtime and allow the choice of meals preference. We will engage a qualified health practitioner, such as a dietitian if you need a texture modified diet as part of a mealtime management plan.

Our workers are trained to manage waste effectively to protect you, or any other person, from harm resulting from exposure to waste, infectious or hazardous substances created during our service delivery. Our policies and procedures comply with relevant legislation and include waste management, infection management, incident management, risk management and emergency and disaster management and plans. Where possible, we manage waste in a sustainable manner, such as recycling paper, glass and plastic waste, where appropriate.

Health U Australia has established procedures that identify, manage and resolve incidents which include the following:

- Completing an incident report that identifies and records an incident.
- Reporting all incidents to our Support Service Manager/ Support Service Specialist.
- Undertaking required reportable incident reporting to the NDIS Commissioner and other appropriate authorities.
- Complying with the National Disability Insurance Scheme (Incident Management and Reportable) Rules 2018.
- Supporting and assisting you if you have been affected by an incident.
- Reviewing the incident with you and the appropriate workers.
- Partnering with you to manage and resolve the incident effectively and to your satisfaction.
- Making amendments to systems and procedures to continuously improve and reduce the risk of recurrence.', 490, CURRENT_TIMESTAMP),
    ('Section 4: National Principles of Child Safe Organisations', 'Our Commitment to Child Safety', 'We have policies and procedures to comply with the National Principles of Child Safe Organisations.', 500, CURRENT_TIMESTAMP),
    ('Section 4: National Principles of Child Safe Organisations', 'Principle 1: Child safety and wellbeing is embedded in organisational leadership, governance and culture', '- Commitment to Safety in accordance with our Safeguarding Against Violence, Abuse, Neglect, Exploitation and Discrimination Policy and Procedure).
- Workers are trained in the following:
  - child safety;
  - codes of conduct;
  - behavioural standards when interacting with children; and
  - reporting obligations and record keeping.
- Risk Management Plans are undertaken for each child.
- Compliance with the NDIS Code of Conduct and Health U Australia ''s Code of Conduct.', 510, CURRENT_TIMESTAMP),
    ('Section 4: National Principles of Child Safe Organisations', 'Principle 2: Children and young people are informed about their rights, participate in decisions affecting them and are taken seriously', '- Children can express their views and are provided with opportunities to participate in decisions that affect their lives:
  - on commencement with our organisation;
  - on an ongoing basis – regularly asked for their thoughts and ideas; and
  - at the review of their plan.
- The importance of friendships is recognised, and support from peers is encouraged, helping children feel safe and less isolated and we work with the child and the family to determine how best to assist with these linkages.
- Children can access abuse prevention programs and information:
  - provide links to relevant organisations (e.g. Kids Helpline);
  - age-appropriate information that describes how adults should behave is provided.
- Workers are trained to recognise signs of harm and facilitate child-friendly ways for children to communicate and raise their concerns:
  - workers are trained to work with each child;
  - knowledge and skills are assessed to determine training to ensure skills and knowledge are evident.', 520, CURRENT_TIMESTAMP),
    ('Section 4: National Principles of Child Safe Organisations', 'Principle 3: Families and communities are informed and involved in promoting child safety and well-being', '- All workers encourage families to take an active role in keeping children safe.
- Families and community members are encouraged to provide feedback on how the organisation keeps children safe, and this information is acted upon where necessary:
  - complaint and feedback forms; and
  - meetings about children.', 530, CURRENT_TIMESTAMP),
    ('Section 4: National Principles of Child Safe Organisations', 'Principle 4: Equity is upheld, and diverse needs are respected in policy and practice', '- Health U Australia and our workers understand barriers that prevent children from disclosing abuse or adults.
- Workers will identify and respect the diverse needs, abilities and backgrounds of children and understand the value of treating them fairly:
  - review each child''s cultural needs at intake; and
  - provide safe, culturally sensitive, age-appropriate activities.
- Workers are trained and aware of factors that increase a child''s vulnerability to harm:
- Health U Australia engages a workforce that reflects our participants'' diversity, where possible.
- Workers adapt activities and services to ensure all children feel included:
  - a Risk Management Plan completed for each child; and
  - strategy planning takes place with the child and their family.', 540, CURRENT_TIMESTAMP),
    ('Section 4: National Principles of Child Safe Organisations', 'Principle 5: People working with children are suitable and supported to reflect child safety and well-being values in practice', '- Health U Australia understands that child-safe recruitment does not rely solely on a Working With Children Checks — but also job advertisements that identify our organisation as a child-safe organisation and ongoing training opportunities at induction and as part of ongoing training.
- Our recruitment processes involve a range of interview questions to establish worker suitability. Background and reference checks are carried out and recorded in accordance with our Human Resource Management Policy and the Worker Risk Assessed Roles Policy).
- Worker supervision includes regular reviews to check whether workers are following the Codes of Conduct and our child-safe policies.
- The Support Service Manager/ Support Service Specialist is responsible for monitoring all aspects of worker supervision and undertakes, at a minimum, quarterly supervision.', 550, CURRENT_TIMESTAMP),
    ('Section 4: National Principles of Child Safe Organisations', 'Principle 6: Processes to respond to complaints and concerns are child-focused', '- Health U Australia creates a culture where complaints are taken seriously through our worker recruitment, induction, training and supervision processes.
- Breaches of Codes of Conduct will result in disciplinary action, and potentially termination of employment.
- Workers are provided support and information on what and how to report any issues or concerns relating to child safety, including to external bodies.
- Our processes and procedures enable children, workers and others to make complaints, both internally and externally.
- Complaints are handled confidentially in accordance with our Complaints and Feedback Policy and Procedure.
- Processes are reviewed at regular intervals, and after complaints are made.
- Privacy and confidentiality is maintained.', 560, CURRENT_TIMESTAMP),
    ('Section 4: National Principles of Child Safe Organisations', 'Principle 7: Staff and volunteers are equipped with knowledge, skills and awareness to keep children and young people safe through ongoing education and training', '- Health U Australia provides ongoing education and training opportunities for all workers, including:
  - knowledge, skills and confidence to prevent and identify instances of violence, abuse, neglect, exploitation or discimination;
  - how to respond to complaints and escalate appropriately; and
  - if higher risks are identified, additional training is provided, e.g. behaviour management.
- The Support Service Manager/ Support Service Specialist is our child safety officer responsible for training.
- Training is regularly reviewed in response to emerging best practices.', 570, CURRENT_TIMESTAMP),
    ('Section 4: National Principles of Child Safe Organisations', 'Principle 8: Physical and online environments promote safety and well-being while minimising the opportunity for children and young people to be harmed', '- Health U Australia sets expectations about behavioural standards for workers interacting with children in physical and online environments.
- Risk assessments identify areas where workers can interact with children unsupervised, including one-off events and overnight accommodation.
- Physical environments are altered to increase natural sight lines while respecting a child''s right to privacy.
- Higher-risk areas (e.g. cars, boarding facilities and offsite locations) are managed using specific safety measures (e.g. spot checks).
- Children are provided information about online safety and regularly encouraged to tell staff about negative experiences.
- Workers and parents/guardians are provided with information about risks in the online environment (e.g. online grooming, cyberbullying and sexting).', 580, CURRENT_TIMESTAMP),
    ('Section 4: National Principles of Child Safe Organisations', 'Principle 9: Implementation of national child safe principles is regularly reviewed and improved', '- Health U Australia maintains a culture of continuous improvement to ensure that policies and procedures are implemented and routinely reviewed, even though staffing may change in accordance with our Continuous Improvement and Quality Management Policy and Procedure).
- Workers recognise the value of continuous monitoring, open conversations and exploring new ways to keep children safe.
- Child-safe policies and practices are reviewed annually.
- Workers refer to the NDIS Standards when creating, reviewing or evaluating child-safe policies and procedures.
- We learn from incidents to identify trends, the root cause of the problem, identify risks to children''s safety and make improvements in safeguards.
- Children are supported to provide feedback, which is acted upon as required.', 590, CURRENT_TIMESTAMP),
    ('Section 4: National Principles of Child Safe Organisations', 'Principle 10: Policies and procedures document how the organisation is safe for children and young people', '- Health U Australia reviews our policies, procedures and forms to ensure they remain compliant.
- Health U Australia acknowledges that we are accountable for the compliance of our policies and procedures.
- Workers are trained and knowledgeable about Health U Australia’s policies and procedures in relation to child safety.', 600, CURRENT_TIMESTAMP);
