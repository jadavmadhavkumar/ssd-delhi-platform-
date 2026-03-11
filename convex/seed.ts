import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const all = mutation({
    args: {},
    handler: async (ctx) => {
        // 1. Create a dummy admin user if none exists (for development)
        let admin = await ctx.db.query("users").withIndex("by_role", (q) => q.eq("role", "admin")).first();
        if (!admin) {
            const adminId = await ctx.db.insert("users", {
                clerkId: "seed-admin-id",
                email: "admin@ssddelhi.org",
                name: "SSD Admin",
                role: "admin",
                membershipStatus: "approved",
                city: "Delhi",
                state: "Delhi",
                preferredLanguage: "en",
            });
            admin = await ctx.db.get(adminId);
        }

        if (!admin) return;

        // 2. Seed Articles from all_data_for_ssd.md
        const articles = [
            {
                title: "Founder and Origins of Samta Sainik Dal",
                slug: "founder-and-origins",
                excerpt: "Dr. B.R. Ambedkar founded SSD to defend the rights and dignity of India's oppressed communities.",
                content: `Dr. Bhimrao Ramji Ambedkar, a jurist, economist and chief architect of the Indian Constitution, founded Samta Sainik Dal as part of his broader movement to annihilate caste and secure social, political and economic equality for the oppressed.

After returning from London in the 1920s, Ambedkar built several organizations and publications—such as Bahishkrit Hitakarini Sabha (1924), Mooknayak and Bahishkrit Bharat—to awaken Dalits, and he soon realized the need for a dedicated volunteer force to defend people and his meetings from attacks.

According to various sources, Ambedkar established Samta Sainik Dal around the Mahad movement, with many traditions tracing its foundation to a conference at Mahad on 24 September 1924. Other historical accounts highlight March 1927, during the Chavdar Lake struggle, as the formal announcement of the 'Social Equality Army'.`,
                category: "History",
                tags: ["Dr. Ambedkar", "Origins", "Mahad"],
                language: "en" as const,
                status: "published" as const,
                publishedAt: Date.now(),
                viewCount: 0,
                featured: true,
                sources: [
                    { title: "SSD India - About", url: "https://ssdindia.org/about/", accessedDate: "2024-02-23" }
                ],
                author: admin._id,
            },
            {
                title: "Ideology, Vision and Mission",
                slug: "ideology-vision-mission",
                excerpt: "The core principle of SSD is to establish equality by annihilating the caste system.",
                content: `The core principle of Samta Sainik Dal is to establish equality among the masses of Indian society by annihilating the caste system and all forms of social hierarchy.

The official constitution states that SSD's aim is "to strive for the removal of all inequality based on race, religion, caste, sex or class and to unite all members of the Scheduled Caste communities for a struggle to build a society based on the freedom and equality of all."

Vision: A casteless, democratic, humane India where every human being enjoys equal rights, self‑respect and dignity, free from all forms of discrimination.

Mission: To organize and train volunteers as "soldiers for equality" who educate, mobilize and protect oppressed communities; resist injustice through disciplined, non‑violent struggle; and work for equality in education, employment, health, environment and social life.`,
                category: "Ideology",
                tags: ["Equality", "Vision", "Mission"],
                language: "en" as const,
                status: "published" as const,
                publishedAt: Date.now(),
                viewCount: 0,
                featured: true,
                sources: [
                    { title: "AISSD Home", url: "https://aissd.org/home/", accessedDate: "2024-02-23" }
                ],
                author: admin._id,
            },
            {
                title: "Values and Guiding Principles",
                slug: "values-principles",
                excerpt: "Equality, Liberty, Fraternity, and Discipline are the pillars of SSD.",
                content: `You can list SSD's values as a section:

Equality: Rejecting caste, gender, religious and economic hierarchies in thought, speech and practice, and treating every person as fully human.
Liberty and Fraternity: Building a society where oppressed communities enjoy real freedom with a sense of brotherhood and mutual respect.
Discipline and Courage: Each "Sainik" (volunteer) is expected to be brave, disciplined and ready to sacrifice personal comfort to defend human rights, as reflected in the Sainik's Oath.
Non‑violence with self‑respect: Ambedkar emphasized peaceful methods while rejecting meekness; SSD stands for self‑defence and firm resistance against oppression without hatred or blind violence.
Service to humanity: SSD is described as a purely social organization committed to workers, labourers, Dalits, exploited and poor people.`,
                category: "Ideology",
                tags: ["Values", "Discipline", "Service"],
                language: "en" as const,
                status: "published" as const,
                publishedAt: Date.now(),
                viewCount: 0,
                featured: false,
                sources: [
                    { title: "SSD India Constitution", url: "https://ssdindia.org/ssd/", accessedDate: "2024-02-23" }
                ],
                author: admin._id,
            },
            {
                title: "Historical Timeline of Samta Sainik Dal (1924–2027)",
                slug: "historical-timeline-samta-sainik-dal-1924-2027",
                excerpt: "A complete chronological journey of SSD from its origins in the 1920s Mahad movement to centenary preparations in the 2020s.",
                content: `## Historical Timeline of Samta Sainik Dal

- **1924**: Bahishkrit Hitakarini Sabha formed; early volunteer ideas emerge.
- **24 Sep 1924**: Mahad conference — conceptual birth of SSD.
- **Mar 1927**: Formal announcement during Chavdar Lake satyagraha.
- **1930s**: Support to Independent Labour Party.
- **1940s**: Active with Scheduled Castes Federation.
- **Post-1956**: Revival after Babasaheb's Mahaparinirvan.
- **2010s–2020s**: Focus on education, health, environment, women empowerment.
- **2025–2027**: Centenary celebrations across units, including Delhi.

Delhi unit remains connected to national network while addressing local issues like slum rights and discrimination.

The timeline shows how SSD evolved from a protective volunteer force to a comprehensive social movement organization, adapting to changing times while maintaining its core commitment to equality and justice.`,
                category: "History",
                tags: ["timeline", "history", "centenary"],
                language: "en" as const,
                status: "published" as const,
                publishedAt: 1736035200000, // 2026-01-05
                viewCount: 0,
                featured: true,
                sources: [
                    { title: "SSD India - About", url: "https://ssdindia.org/about/", accessedDate: "2024-02-23" }
                ],
                author: admin._id,
            },
            {
                title: "From Nagpur to Delhi: All-India Network of SSD",
                slug: "from-nagpur-to-delhi-all-india-network-ssd",
                excerpt: "SSD's national structure, headquartered in Nagpur, connects units across states — with Delhi playing a vital role in northern coordination.",
                content: `## From Nagpur to Delhi: All-India Network of SSD

Headquartered in Nagpur (Untkhana, Rambagh Road), All India Samta Sainik Dal maintains a military-style hierarchy: Supreme Commander, National President, Zonal Majors, down to local platoons.

Delhi unit operates under North India coordination, using Ambedkar Bhawan for major events and linking to national leadership for guidance and legitimacy.

This pan-India presence strengthens the fight for equality everywhere.

The organizational structure ensures:
- Unified command and discipline across all units
- Coordinated response to caste atrocities anywhere in India
- Sharing of resources, training materials, and best practices
- National campaigns with local implementation

Delhi's strategic importance as the national capital makes it a key coordination hub for policy advocacy and national-level events.`,
                category: "Organization",
                tags: ["structure", "national", "network"],
                language: "en" as const,
                status: "published" as const,
                publishedAt: 1738368000000, // 2026-02-01
                viewCount: 0,
                featured: false,
                sources: [
                    { title: "AISSD Home", url: "https://aissd.org/home/", accessedDate: "2024-02-23" }
                ],
                author: admin._id,
            },
            {
                title: "SSD and the Independent Labour Party – Non-Political Yet Deeply Political",
                slug: "ssd-independent-labour-party-non-political",
                excerpt: "Though defined as social, SSD closely supported Ambedkar's political fronts like ILP — showing the deep link between social and political emancipation.",
                content: `## SSD and the Independent Labour Party

In 1930s Bombay, SSD volunteers mobilized for ILP elections while maintaining non-political identity.

This model continues: Delhi unit engages civic issues without party affiliation, yet advances Ambedkarite political consciousness.

The Independent Labour Party, founded by Dr. Ambedkar in 1936, represented his vision that social reform must be accompanied by political power. SSD played a crucial role in:

- Mobilizing voters from depressed classes
- Providing security for ILP rallies and meetings
- Spreading awareness about the party's manifesto
- Training young volunteers in political organizing

This dual approach — social organization supporting political action — remains relevant today. SSD Delhi focuses on social work while encouraging members to participate actively in democratic processes and advocate for Bahujan interests.`,
                category: "History",
                tags: ["politics", "history", "ilp"],
                language: "en" as const,
                status: "published" as const,
                publishedAt: 1734652800000, // 2025-12-20
                viewCount: 0,
                featured: false,
                sources: [
                    { title: "SSD India Constitution", url: "https://ssdindia.org/ssd/", accessedDate: "2024-02-23" }
                ],
                author: admin._id,
            },
            {
                title: "Organisational Structure & Command of Samta Sainik Dal",
                slug: "organisational-structure-command-ssd",
                excerpt: "Detailed look at SSD's hierarchical, disciplined command system — from National Commander-in-Chief to local platoons — and Delhi's place in it.",
                content: `## Organisational Structure & Command of Samta Sainik Dal

National: Supreme Commander → Commander-in-Chief → Zonal Majors

State/Regiment → Division → Battalion → Company → Platoon

Delhi operates as a key urban branch under North Zone, with local President & Secretary coordinating under national framework.

Ensures unity and discipline nationwide.

### Detailed Hierarchy

1. **National Level**: Supreme Commander (overall head), Commander-in-Chief (operational head), National President, General Secretary
2. **Zonal Level**: Zonal Commander (North, South, East, West, Central)
3. **State Level**: State President, State Secretary, State Commander
4. **District Level**: District President, District Secretary
5. **Local Level**: Unit President, Secretary, Volunteers

This military-inspired structure enables:
- Quick decision-making during emergencies
- Disciplined execution of programs
- Clear accountability at each level
- Efficient resource allocation

Delhi's structure mirrors the national model, with specialized cells for women, youth, legal aid, and media.`,
                category: "Organization",
                tags: ["structure", "organization", "command"],
                language: "en" as const,
                status: "published" as const,
                publishedAt: 1739923200000, // 2026-02-20
                viewCount: 0,
                featured: false,
                sources: [
                    { title: "SSD India Constitution", url: "https://ssdindia.org/ssd/", accessedDate: "2024-02-23" }
                ],
                author: admin._id,
            },
            {
                title: "How to Join SSD Delhi – Complete Guide",
                slug: "how-to-join-ssd-delhi-complete-guide",
                excerpt: "Step-by-step process to become a Samta Sainik in Delhi: eligibility, membership, training, and volunteering paths.",
                content: `## How to Join SSD Delhi – Complete Guide

Eligibility: Believe in equality, Ambedkarite principles, willing to follow discipline.

Steps:
1. Visit Dr. Ambedkar Bhawan during programs
2. Fill membership form & take oath
3. Attend orientation
4. Choose path: event security, education, women's cell, etc.

Contact national office for verification.

### Membership Requirements

- Age: 18+ for full membership (youth wing for 14-17)
- Commitment to SSD's ideology and constitution
- Willingness to participate in training and activities
- No criminal background

### Membership Benefits

- Access to training programs and workshops
- Networking with like-minded activists
- Opportunity to lead community initiatives
- Legal support in case of caste-based harassment

### Volunteer Paths

After joining, members can specialize in:
- Event Management & Security
- Education & Awareness
- Legal Aid & Support
- Women's Empowerment
- Youth Training
- Media & Communications
- Health & Environment`,
                category: "Membership",
                tags: ["join", "membership", "guide"],
                language: "en" as const,
                status: "published" as const,
                publishedAt: 1737331200000, // 2026-01-20
                viewCount: 0,
                featured: true,
                sources: [
                    { title: "SSD Delhi Unit", url: "https://ssddelhi.org", accessedDate: "2024-02-23" }
                ],
                author: admin._id,
            },
        ];

        for (const article of articles) {
            const existing = await ctx.db.query("articles").withIndex("by_slug", q => q.eq("slug", article.slug)).first();
            if (existing) {
                await ctx.db.delete(existing._id);
            }
            await ctx.db.insert("articles", article);
        }

        // 3. Seed Blogs
        const blogs = [
            {
                title: "Why Babasaheb Created Samta Sainik Dal: From Mahad to Delhi",
                slug: "why-babasaheb-created-ssd-mahad-to-delhi",
                content: `# Why Babasaheb Created Samta Sainik Dal: From Mahad to Delhi

Dr. Bhimrao Ramji Ambedkar returned from his studies abroad in the 1920s with a clear vision: annihilate caste and build an egalitarian society. But he quickly realized that peaceful meetings and mobilizations of the Depressed Classes were under constant threat from violent opposition.

### The Spark in Mahad (1924–1927)
The turning point came during the Mahad Satyagraha. Sources trace the conceptual birth of a volunteer force as early as the September 1924 Mahad conference. By March 1927, at Chavdar Tank, Babasaheb formally announced the "Social Equality Army" — Samata Sainik Dal — to defend the right to access public water and dignity.

Early groups like Bhim Sevak Dal evolved into this disciplined corps. Volunteers protected rallies, maintained order, and shielded participants from attacks — allowing the movement to grow without fear.

### Role in Ambedkar's Broader Struggle
In the 1930s–1940s, SSD supported the Independent Labour Party and Scheduled Castes Federation by mobilizing voters and securing events. Babasaheb repeatedly stressed: without such a force, the struggle against organized caste power could not succeed.

### Continuity in Modern Delhi
Today in Delhi, SSD volunteers carry forward this tradition. At Dr. Ambedkar Bhawan on Rani Jhansi Road, Sainiks organize conferences, protect gatherings, and conduct awareness drives on constitutional rights and anti-caste education. The same spirit of disciplined, non-violent resistance that began in Mahad now strengthens Bahujan communities in the capital.

Join us to become part of this historic mission.`,
                author: admin._id,
                category: "blog",
                tags: ["history", "ambedkar", "mahad", "delhi"],
                language: "en" as const,
                status: "published" as const,
                publishedAt: 1728950400000, // 2025-10-15
                viewCount: 0,
                allowComments: true,
            },
            {
                title: "The Sainik's Oath in Today's India",
                slug: "sainiks-oath-in-todays-india",
                content: `## The Sainik's Oath in Today's India

The official SSD constitution contains a solemn oath that binds every member:

"I pledge to reject caste discrimination, stand against all oppression, follow SSD discipline with honesty, and defend human rights with courage — ready to face any sacrifice."

In Delhi's urban context, this oath translates to:
- Protecting peaceful Ambedkarite gatherings from disruption
- Running study circles on the Constitution and Babasaheb's writings
- Supporting victims of caste atrocities through awareness and legal aid
- Promoting women's leadership and youth self-reliance

Reciting and living this oath keeps the spirit of Babasaheb alive.

### What the Oath Means Today

**Reject Caste Discrimination**: Not just avoiding caste practices, but actively working to dismantle caste barriers in housing, employment, and social life.

**Stand Against Oppression**: Speaking up when witnessing injustice, whether in the workplace, educational institutions, or public spaces.

**Follow Discipline**: Maintaining personal integrity, being punctual, following organizational protocols, and representing SSD with dignity.

**Defend Human Rights**: Being prepared to act when rights are violated, knowing legal provisions like SC/ST Prevention of Atrocities Act, and supporting victims through the legal process.

**Ready for Sacrifice**: Understanding that social change requires personal commitment — time, energy, and sometimes facing opposition from privileged sections.`,
                author: admin._id,
                category: "blog",
                tags: ["ideology", "oath", "discipline"],
                language: "en" as const,
                status: "published" as const,
                publishedAt: 1731196800000, // 2025-11-10
                viewCount: 0,
                allowComments: true,
            },
            {
                title: "Women in Samta Sainik Dal: Empowerment Through Discipline",
                slug: "women-in-samta-sainik-dal-empowerment",
                content: `## Women in Samta Sainik Dal: Empowerment Through Discipline

From the 1920s, women joined in large numbers, stepping out to participate in satyagrahas. Later groups like Mahila Samta Sainik Dal linked anti-caste and feminist struggles.

In contemporary SSD Delhi:
- Women lead awareness on gender justice and reservations
- Participate in marches, health camps, and youth training
- Emphasize self-respect, education, and economic independence

"Women are the backbone of the Ambedkarite movement" — this truth continues to guide SSD's work.

### Historical Role of Women

Women like Ramabai Ambedkar, Savita Ambedkar, and countless unnamed Sainikins marched alongside men in water satyagrahas, temple entry movements, and labor organizing. They faced double oppression — caste and gender — yet remained at the forefront.

### Modern Women's Wing

Delhi's Mahila Sainik Dal focuses on:
- **Legal Literacy**: Teaching women about their rights under domestic violence laws, inheritance laws, and workplace harassment protections.
- **Economic Empowerment**: Skill development programs, self-help groups, and entrepreneurship training.
- **Health Awareness**: Organizing health camps, menstrual hygiene workshops, and mental health support.
- **Leadership Development**: Training women to take on organizational roles and represent the community in public forums.

### Success Stories

Many women who joined as volunteers have gone on to become lawyers, teachers, and community leaders, proving that SSD's empowerment model works.`,
                author: admin._id,
                category: "blog",
                tags: ["women", "empowerment", "gender"],
                language: "en" as const,
                status: "published" as const,
                publishedAt: 1733616000000, // 2025-12-08
                viewCount: 0,
                allowComments: true,
            },
            {
                title: "Ambedkar's Message to Samta Sainiks",
                slug: "ambedkars-message-to-samta-sainiks",
                content: `## Ambedkar's Message to Samta Sainiks

Babasaheb emphasized: "Without an organized volunteer corps, the movement cannot withstand powerful opposition."

He called Sainiks to educate, mobilize, and protect — building real liberty, equality, fraternity.

In Delhi today, we strive to fulfill this vision through disciplined action.

### Key Teachings for Sainiks

**On Education**: "Educate, Agitate, Organize" — This famous triad remains SSD's guiding principle. Education without action is incomplete; action without organization is ineffective.

**On Unity**: "Unity is strength" — Ambedkar knew that divided communities remain oppressed. SSD brings together Dalits, Adivasis, OBCs, and religious minorities under one banner.

**On Self-Respect**: "I measure the progress of a community by the degree of progress which women have achieved" — Women's empowerment is central to SSD's mission.

**On Political Power**: "Political power is the key to all social progress" — While SSD is social, it encourages political awareness and participation.

**On Constitutional Morality**: "Democracy is not merely a form of government. It is primarily a mode of associated living" — SSD promotes constitutional values in daily life.

### Applying These Messages Today

Delhi SSD runs Constitution study circles, organizes youth training camps, and conducts leadership workshops — all inspired by Babasaheb's vision.`,
                author: admin._id,
                category: "blog",
                tags: ["ambedkar", "quotes", "ideology"],
                language: "en" as const,
                status: "published" as const,
                publishedAt: 1732579200000, // 2025-11-26
                viewCount: 0,
                allowComments: true,
            },
            {
                title: "Towards Centenary 1927–2027: 100 Years of Equality Soldiers",
                slug: "towards-centenary-1927-2027-ssd",
                content: `## Towards Centenary 1927–2027

Different branches mark foundation from 1924 or 1927, but all agree: 2027 completes a century of fighting caste.

Delhi plans major events, youth camps, publications to reaffirm commitment to annihilation of caste.

The journey continues.

### Centenary Preparations

SSD units across India are preparing for the historic 100-year milestone:

**Publications**: Documentaries, books, and research papers on SSD's contribution to Indian social movements.

**Events**: National conferences, cultural programs, marathons, and blood donation camps.

**Youth Engagement**: Special training programs for young Sainiks, connecting them with the organization's rich history.

**Digital Archive**: Creating online repositories of historical documents, photographs, and oral histories.

### Delhi's Centenary Plans

- Grand conference at Ambedkar Bhawan with national leadership
- Publication of a commemorative volume in Hindi and English
- Youth camp on leadership and organizational skills
- Women's convention on "100 Years of Women in SSD"
- Community service initiatives in underserved areas

### Looking Forward

The centenary is not just celebration — it's a moment to recommit to SSD's original mission while adapting to 21st-century challenges: digital activism, urban migration, changing caste dynamics, and new forms of discrimination.`,
                author: admin._id,
                category: "blog",
                tags: ["centenary", "100-years", "future"],
                language: "en" as const,
                status: "published" as const,
                publishedAt: 1739577600000, // 2026-02-15
                viewCount: 0,
                allowComments: true,
            },
        ];

        for (const blog of blogs) {
            const existing = await ctx.db.query("blogs").withIndex("by_slug", q => q.eq("slug", blog.slug)).first();
            if (existing) {
                await ctx.db.delete(existing._id);
            }
            await ctx.db.insert("blogs", blog);
        }

        // 4. Seed News
        const newsItems = [
            {
                headline: "SSD Delhi Celebrates 101st Foundation Day at Ambedkar Bhawan",
                slug: "ssd-delhi-101st-foundation-day-ambedkar-bhawan",
                content: `## SSD Delhi Celebrates 101st Foundation Day

On 24 September 2025 (or March 13 depending on branch tradition), Samta Sainik Dal Delhi unit organized a grand conference at Dr. Ambedkar Bhawan, Rani Jhansi Road.

Key highlights:
- Inspirational speeches on SSD's role in protecting Bahujan rights
- Discussion on 100+ years of achievements and future challenges
- Cultural performances and oath-taking for new volunteers
- Emphasis on youth training, women's participation, and community defence

SSD Delhi proudly calls itself the largest Bahujan organization in the capital, actively involved in atrocity prevention, education camps, and civic campaigns.

Jai Bhim! Jai Samta!`,
                category: "event",
                urgent: false,
                publishedAt: 1727222400000, // 2025-09-25
                author: admin._id,
                sources: [],
            },
            {
                headline: "SSD Delhi – Largest Bahujan Organisation in the Capital",
                slug: "ssd-delhi-largest-bahujan-organisation",
                content: `## SSD Delhi – Largest Bahujan Organisation in the Capital

Recent public statements and programs at Ambedkar Bhawan affirm SSD Delhi's scale and impact. From anniversary celebrations to street awareness drives, the unit mobilizes thousands.

Focus areas: education, atrocity response, women's empowerment, environment drives.

Join the movement shaping Delhi's future.

### Recent Achievements

- Organized 50+ community events in 2025
- Trained 500+ youth volunteers
- Provided legal aid to 100+ families facing caste discrimination
- Conducted health camps serving 2000+ community members

### Upcoming Initiatives

- Monthly Constitution study circles
- Quarterly leadership training camps
- Annual youth convention
- Women's self-defense workshops`,
                category: "announcement",
                urgent: false,
                publishedAt: 1739145600000, // 2026-02-10
                author: admin._id,
                sources: [],
            },
        ];

        for (const newsItem of newsItems) {
            const existing = await ctx.db.query("news").withIndex("by_slug", q => q.eq("slug", newsItem.slug)).first();
            if (existing) {
                await ctx.db.delete(existing._id);
            }
            await ctx.db.insert("news", newsItem);
        }

        // 5. Seed Timeline Events
        const timelineEvents = [
            {
                year: 1924,
                month: 9,
                day: 24,
                title: "Mahad Conference",
                description: "Formation of Samta Sainik Dal to organize Dalit youth and protect villages from caste-violence.",
                significance: "The foundation of the volunteer force.",
                era: "Founding Era",
                sources: [{ title: "Bahujan Swabhiman", url: "https://bahujanswabhiman.com/articles/" }],
                images: [],
                relatedArticles: []
            },
            {
                year: 1927,
                month: 3,
                day: 20,
                title: "Chavdar Lake Satyagraha",
                description: "Dr. Ambedkar leads thousands to drink water from the Chavdar Lake, asserting basic human rights.",
                significance: "A turning point in the civil rights movement in India.",
                era: "Satyagraha Era",
                sources: [{ title: "Wikipedia", url: "https://en.wikipedia.org/wiki/Mahad_Satyagraha" }],
                images: [],
                relatedArticles: []
            },
            {
                year: 1932,
                month: 9,
                day: 24,
                title: "Poona Pact",
                description: "Agreement between B. R. Ambedkar and Mahatma Gandhi on behalf of depressed classes and upper caste Hindu leaders on the reservation of electoral seats.",
                significance: "Secured political representation for depressed classes.",
                era: "Political Rights Era",
                sources: [{ title: "Britannica", url: "https://www.britannica.com/event/Poona-Pact" }],
                images: [],
                relatedArticles: []
            },
            {
                year: 1956,
                month: 10,
                day: 14,
                title: "Dhamma Chakra Pravartan",
                description: "Dr. Ambedkar and hundreds of thousands of followers embrace Buddhism at Deekshabhoomi, Nagpur.",
                significance: "Mass conversion to Buddhism as a rejection of the caste system.",
                era: "Buddhist Revival Era",
                sources: [{ title: "Deekshabhoomi Official", url: "https://deekshabhoomi.org/" }],
                images: [],
                relatedArticles: []
            },
            {
                year: 2024,
                month: 9,
                day: 24,
                title: "SSD Centenary",
                description: "Celebration of 100 years of Samta Sainik Dal's service to society.",
                significance: "Century of struggle for social equality.",
                era: "Modern Era",
                sources: [{ title: "SSD Delhi Unit", url: "https://ssddelhi.org" }],
                images: [],
                relatedArticles: []
            }
        ];

        for (const event of timelineEvents) {
            const existing = await ctx.db.query("timelineEvents").withIndex("by_year", q => q.eq("year", event.year)).collect();
            if (!existing.some(e => e.title === event.title)) {
                await ctx.db.insert("timelineEvents", event);
            }
        }

        // 6. Seed Events
        const events = [
            {
                title: "Ambedkar Jayanti Celebration 2026",
                slug: "ambedkar-jayanti-2026",
                description: "Join us for the grand celebration of Dr. B.R. Ambedkar's birth anniversary with cultural programs, speeches, and community gatherings.",
                startDate: new Date("2026-04-14").getTime(),
                endDate: new Date("2026-04-14").getTime(),
                venue: "Dr. Ambedkar Bhawan",
                address: "Rani Jhansi Road, Moti Nagar",
                city: "Delhi",
                category: "Celebration",
                isPublic: true,
                maxAttendees: 500,
                registrationDeadline: new Date("2026-04-10").getTime(),
                organizer: admin._id,
                status: "upcoming" as const,
            },
            {
                title: "Youth Leadership Training Camp",
                slug: "youth-leadership-training-camp",
                description: "A 3-day intensive training program for young volunteers to develop leadership skills, organizational management, and community mobilization techniques.",
                startDate: new Date("2026-05-01").getTime(),
                endDate: new Date("2026-05-03").getTime(),
                venue: "Ambedkar Community Center",
                address: "Sector 15, Rohini",
                city: "Delhi",
                category: "Training",
                isPublic: true,
                maxAttendees: 100,
                registrationDeadline: new Date("2026-04-25").getTime(),
                organizer: admin._id,
                status: "upcoming" as const,
            },
            {
                title: "Constitutional Rights Awareness Workshop",
                slug: "constitutional-rights-awareness-workshop",
                description: "Learn about your fundamental rights, legal provisions, and how to protect yourself from caste-based discrimination.",
                startDate: new Date("2026-03-20").getTime(),
                endDate: new Date("2026-03-20").getTime(),
                venue: "SSD Delhi Office",
                address: "Laxmi Nagar",
                city: "Delhi",
                category: "Workshop",
                isPublic: true,
                maxAttendees: 50,
                registrationDeadline: new Date("2026-03-18").getTime(),
                organizer: admin._id,
                status: "upcoming" as const,
            },
            {
                title: "Women's Empowerment Conference",
                slug: "womens-empowerment-conference",
                description: "A conference focused on women's rights, leadership, and empowerment with sessions on legal literacy, skill development, and health awareness.",
                startDate: new Date("2026-03-08").getTime(),
                endDate: new Date("2026-03-08").getTime(),
                venue: "Dr. Ambedkar Bhawan",
                address: "Rani Jhansi Road",
                city: "Delhi",
                category: "Conference",
                isPublic: true,
                maxAttendees: 200,
                registrationDeadline: new Date("2026-03-05").getTime(),
                organizer: admin._id,
                status: "ongoing" as const,
            },
            {
                title: "Health Camp for Community",
                slug: "health-camp-community",
                description: "Free health check-ups, medicine distribution, and health awareness sessions for underprivileged community members.",
                startDate: new Date("2026-02-15").getTime(),
                endDate: new Date("2026-02-16").getTime(),
                venue: "Sunder Nagri",
                address: "Sunder Vihar",
                city: "Delhi",
                category: "Health",
                isPublic: true,
                maxAttendees: 300,
                organizer: admin._id,
                status: "completed" as const,
            },
        ];

        for (const event of events) {
            const existing = await ctx.db.query("events").withIndex("by_slug", q => q.eq("slug", event.slug)).first();
            if (existing) {
                await ctx.db.delete(existing._id);
            }
            await ctx.db.insert("events", event);
        }
    }
});
