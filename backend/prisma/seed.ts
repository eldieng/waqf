import { PrismaClient, UserRole, ProjectStatus, CampaignStatus, ContentType, Language } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Seeding database...');

    // Clean database (only in development)
    if (process.env.NODE_ENV !== 'production') {
        console.log('🧹 Cleaning database...');
        await prisma.auditLog.deleteMany();
        await prisma.newsletter.deleteMany();
        await prisma.contact.deleteMany();
        await prisma.contentTranslation.deleteMany();
        await prisma.content.deleteMany();
        await prisma.orderItem.deleteMany();
        await prisma.order.deleteMany();
        await prisma.productCategory.deleteMany();
        await prisma.categoryTranslation.deleteMany();
        await prisma.category.deleteMany();
        await prisma.productTranslation.deleteMany();
        await prisma.product.deleteMany();
        await prisma.receipt.deleteMany();
        await prisma.subscription.deleteMany();
        await prisma.transaction.deleteMany();
        await prisma.donation.deleteMany();
        await prisma.campaignProject.deleteMany();
        await prisma.campaignTranslation.deleteMany();
        await prisma.campaign.deleteMany();
        await prisma.projectTranslation.deleteMany();
        await prisma.project.deleteMany();
        await prisma.refreshToken.deleteMany();
        await prisma.user.deleteMany();
    }

    // Create admin user
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('Admin@2026', 12);
    const admin = await prisma.user.create({
        data: {
            email: 'admin@waqf-daara.org',
            phone: '+221770000000',
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'Waqf',
            role: UserRole.ADMIN,
            isVerified: true,
            isActive: true,
        },
    });
    console.log(`  ✅ Admin created: ${admin.email}`);

    // Create test donor
    const donorPassword = await bcrypt.hash('Donor@2026', 12);
    const donor = await prisma.user.create({
        data: {
            email: 'donor@test.com',
            phone: '+221771111111',
            password: donorPassword,
            firstName: 'Amadou',
            lastName: 'Diallo',
            role: UserRole.DONOR,
            isVerified: true,
            isActive: true,
        },
    });
    console.log(`  ✅ Donor created: ${donor.email}`);

    // Create projects
    console.log('📁 Creating projects...');
    const projects = await Promise.all([
        prisma.project.create({
            data: {
                slug: 'construction-daara-thies',
                status: ProjectStatus.ACTIVE,
                goalAmount: 25000000,
                collectedAmount: 15000000,
                donorCount: 125,
                isUrgent: true,
                isFeatured: true,
                translations: {
                    create: [
                        {
                            language: Language.FR,
                            title: 'Construction Daara Thiès',
                            description: 'Construction d\'un nouveau daara moderne à Thiès pouvant accueillir 100 enfants avec des salles de classe, une bibliothèque et un réfectoire.',
                            shortDesc: 'Nouveau daara pour 100 enfants à Thiès',
                        },
                        {
                            language: Language.EN,
                            title: 'Thiès Daara Construction',
                            description: 'Construction of a new modern daara in Thiès that can accommodate 100 children with classrooms, a library and a cafeteria.',
                            shortDesc: 'New daara for 100 children in Thiès',
                        },
                        {
                            language: Language.AR,
                            title: 'بناء دارا تييس',
                            description: 'بناء دارا حديث جديد في تييس يمكنه استيعاب 100 طفل مع فصول دراسية ومكتبة ومقصف.',
                            shortDesc: 'دارا جديد لـ 100 طفل في تييس',
                        },
                    ],
                },
            },
        }),
        prisma.project.create({
            data: {
                slug: 'equipement-informatique-dakar',
                status: ProjectStatus.ACTIVE,
                goalAmount: 10000000,
                collectedAmount: 4500000,
                donorCount: 67,
                isUrgent: false,
                isFeatured: true,
                translations: {
                    create: [
                        {
                            language: Language.FR,
                            title: 'Équipement Informatique Dakar',
                            description: 'Équipement de 5 daaras de la région de Dakar avec des ordinateurs et une connexion internet pour moderniser l\'enseignement.',
                            shortDesc: 'Équipement numérique pour 5 daaras',
                        },
                        {
                            language: Language.EN,
                            title: 'Dakar IT Equipment',
                            description: 'Equipment of 5 daaras in the Dakar region with computers and internet connection to modernize teaching.',
                            shortDesc: 'Digital equipment for 5 daaras',
                        },
                        {
                            language: Language.AR,
                            title: 'معدات تكنولوجية لداكار',
                            description: 'تجهيز 5 دارات في منطقة داكار بأجهزة الكمبيوتر والإنترنت لتحديث التعليم.',
                            shortDesc: 'معدات رقمية لـ 5 دارات',
                        },
                    ],
                },
            },
        }),
        prisma.project.create({
            data: {
                slug: 'renovation-daara-touba',
                status: ProjectStatus.ACTIVE,
                goalAmount: 15000000,
                collectedAmount: 12000000,
                donorCount: 89,
                isUrgent: true,
                isFeatured: false,
                translations: {
                    create: [
                        {
                            language: Language.FR,
                            title: 'Rénovation Daara Touba',
                            description: 'Rénovation complète du daara historique de Touba incluant toiture, électricité et sanitaires.',
                            shortDesc: 'Rénovation urgente du daara historique',
                        },
                        {
                            language: Language.EN,
                            title: 'Touba Daara Renovation',
                            description: 'Complete renovation of the historic Touba daara including roofing, electricity and sanitation.',
                            shortDesc: 'Urgent renovation of historic daara',
                        },
                        {
                            language: Language.AR,
                            title: 'تجديد دارا طوبى',
                            description: 'تجديد كامل لدارا طوبى التاريخية بما في ذلك السقف والكهرباء والصرف الصحي.',
                            shortDesc: 'تجديد عاجل للدارا التاريخية',
                        },
                    ],
                },
            },
        }),
    ]);
    console.log(`  ✅ ${projects.length} projects created`);

    // Create campaign
    console.log('🎯 Creating campaign...');
    const campaign = await prisma.campaign.create({
        data: {
            slug: 'ramadan-2026',
            status: CampaignStatus.ACTIVE,
            goalAmount: 50000000,
            collectedAmount: 20000000,
            startDate: new Date('2026-02-15'),
            endDate: new Date('2026-03-20'),
            isUrgent: true,
            translations: {
                create: [
                    {
                        language: Language.FR,
                        title: 'Campagne Ramadan 2026',
                        description: 'Campagne spéciale pour le mois béni du Ramadan. Multipliez vos récompenses en soutenant l\'éducation des enfants.',
                    },
                    {
                        language: Language.EN,
                        title: 'Ramadan 2026 Campaign',
                        description: 'Special campaign for the blessed month of Ramadan. Multiply your rewards by supporting children\'s education.',
                    },
                    {
                        language: Language.AR,
                        title: 'حملة رمضان 2026',
                        description: 'حملة خاصة لشهر رمضان المبارك. ضاعف أجرك بدعم تعليم الأطفال.',
                    },
                ],
            },
        },
    });
    console.log(`  ✅ Campaign created: ${campaign.slug}`);

    // Create content (articles)
    console.log('📰 Creating content...');
    const article = await prisma.content.create({
        data: {
            slug: 'inauguration-daara-rufisque',
            type: ContentType.ARTICLE,
            isPublished: true,
            publishedAt: new Date(),
            translations: {
                create: [
                    {
                        language: Language.FR,
                        title: 'Inauguration du nouveau Daara de Rufisque',
                        body: 'Nous avons le plaisir d\'annoncer l\'inauguration de notre nouveau daara à Rufisque. Ce projet, financé grâce à vos dons généreux, accueille désormais 80 enfants dans des conditions optimales d\'apprentissage.',
                        excerpt: 'Un nouveau daara inauguré à Rufisque grâce à vos dons.',
                    },
                    {
                        language: Language.EN,
                        title: 'Inauguration of the new Rufisque Daara',
                        body: 'We are pleased to announce the inauguration of our new daara in Rufisque. This project, funded by your generous donations, now welcomes 80 children in optimal learning conditions.',
                        excerpt: 'A new daara inaugurated in Rufisque thanks to your donations.',
                    },
                    {
                        language: Language.AR,
                        title: 'افتتاح دارا روفيسك الجديدة',
                        body: 'يسعدنا أن نعلن عن افتتاح دارا جديدة في روفيسك. هذا المشروع الممول بفضل تبرعاتكم الكريمة يستقبل الآن 80 طفلاً في ظروف تعليمية مثالية.',
                        excerpt: 'افتتاح دارا جديدة في روفيسك بفضل تبرعاتكم.',
                    },
                ],
            },
        },
    });
    console.log(`  ✅ Article created: ${article.slug}`);

    // Create products
    console.log('🛍️ Creating products...');
    const categoryVetements = await prisma.category.create({
        data: {
            slug: 'vetements',
            translations: {
                create: [
                    { language: Language.FR, name: 'Vêtements' },
                    { language: Language.EN, name: 'Clothing' },
                    { language: Language.AR, name: 'ملابس' },
                ],
            },
        },
    });

    const categoryLivres = await prisma.category.create({
        data: {
            slug: 'livres',
            translations: {
                create: [
                    { language: Language.FR, name: 'Livres' },
                    { language: Language.EN, name: 'Books' },
                    { language: Language.AR, name: 'كتب' },
                ],
            },
        },
    });

    const categoryAccessoires = await prisma.category.create({
        data: {
            slug: 'accessoires',
            translations: {
                create: [
                    { language: Language.FR, name: 'Accessoires' },
                    { language: Language.EN, name: 'Accessories' },
                    { language: Language.AR, name: 'إكسسوارات' },
                ],
            },
        },
    });

    const products = await Promise.all([
        prisma.product.create({
            data: {
                slug: 't-shirt-waqf-daara',
                price: 5000,
                stock: 100,
                isActive: true,
                isFeatured: true,
                images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
                translations: {
                    create: [
                        {
                            language: Language.FR,
                            name: 'T-Shirt Waqf Daara',
                            description: 'T-shirt en coton bio avec le logo de l\'association. 100% des bénéfices reversés aux projets.',
                        },
                        {
                            language: Language.EN,
                            name: 'Waqf Daara T-Shirt',
                            description: 'Organic cotton t-shirt with association logo. 100% of profits go to projects.',
                        },
                        {
                            language: Language.AR,
                            name: 'تيشيرت وقف دارا',
                            description: 'تيشيرت قطني عضوي مع شعار الجمعية. 100% من الأرباح تذهب للمشاريع.',
                        },
                    ],
                },
                categories: {
                    create: {
                        categoryId: categoryVetements.id,
                    },
                },
            },
        }),
        prisma.product.create({
            data: {
                slug: 'livre-prieres-quotidiennes',
                price: 3500,
                stock: 50,
                isActive: true,
                isFeatured: true,
                images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'],
                translations: {
                    create: [
                        {
                            language: Language.FR,
                            name: 'Livre de Prières Quotidiennes',
                            description: 'Recueil de prières et invocations pour chaque moment de la journée.',
                        },
                        {
                            language: Language.EN,
                            name: 'Daily Prayer Book',
                            description: 'Collection of prayers and invocations for every moment of the day.',
                        },
                        {
                            language: Language.AR,
                            name: 'كتاب الأدعية اليومية',
                            description: 'مجموعة من الأدعية والأذكار لكل لحظة من اليوم.',
                        },
                    ],
                },
                categories: {
                    create: {
                        categoryId: categoryLivres.id,
                    },
                },
            },
        }),
        prisma.product.create({
            data: {
                slug: 'tapis-priere-premium',
                price: 15000,
                stock: 30,
                isActive: true,
                isFeatured: true,
                images: ['https://images.unsplash.com/photo-1585036156171-384164a8c675?w=400'],
                translations: {
                    create: [
                        {
                            language: Language.FR,
                            name: 'Tapis de Prière Premium',
                            description: 'Tapis de prière de haute qualité, doux et confortable. Design élégant.',
                        },
                        {
                            language: Language.EN,
                            name: 'Premium Prayer Mat',
                            description: 'High quality prayer mat, soft and comfortable. Elegant design.',
                        },
                        {
                            language: Language.AR,
                            name: 'سجادة صلاة فاخرة',
                            description: 'سجادة صلاة عالية الجودة، ناعمة ومريحة. تصميم أنيق.',
                        },
                    ],
                },
                categories: {
                    create: {
                        categoryId: categoryAccessoires.id,
                    },
                },
            },
        }),
        prisma.product.create({
            data: {
                slug: 'chapelet-artisanal',
                price: 2500,
                stock: 80,
                isActive: true,
                isFeatured: false,
                images: ['https://images.unsplash.com/photo-1590076215667-875d4ef2d7de?w=400'],
                translations: {
                    create: [
                        {
                            language: Language.FR,
                            name: 'Chapelet Artisanal',
                            description: 'Chapelet fait main par des artisans locaux. Perles en bois naturel.',
                        },
                        {
                            language: Language.EN,
                            name: 'Handmade Prayer Beads',
                            description: 'Handmade prayer beads by local artisans. Natural wood beads.',
                        },
                        {
                            language: Language.AR,
                            name: 'مسبحة يدوية الصنع',
                            description: 'مسبحة مصنوعة يدوياً من قبل حرفيين محليين. خرز من الخشب الطبيعي.',
                        },
                    ],
                },
                categories: {
                    create: {
                        categoryId: categoryAccessoires.id,
                    },
                },
            },
        }),
        prisma.product.create({
            data: {
                slug: 'coffret-cadeau-solidaire',
                price: 25000,
                comparePrice: 30000,
                stock: 20,
                isActive: true,
                isFeatured: true,
                images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400'],
                translations: {
                    create: [
                        {
                            language: Language.FR,
                            name: 'Coffret Cadeau Solidaire',
                            description: 'Coffret comprenant un tapis de prière, un chapelet et un livre de prières. Idéal pour offrir.',
                        },
                        {
                            language: Language.EN,
                            name: 'Solidarity Gift Box',
                            description: 'Box including a prayer mat, prayer beads and a prayer book. Perfect for gifting.',
                        },
                        {
                            language: Language.AR,
                            name: 'صندوق هدايا تضامني',
                            description: 'صندوق يحتوي على سجادة صلاة ومسبحة وكتاب أدعية. مثالي للإهداء.',
                        },
                    ],
                },
                categories: {
                    create: {
                        categoryId: categoryAccessoires.id,
                    },
                },
            },
        }),
    ]);
    console.log(`  ✅ ${products.length} products created`);

    // Create settings (upsert to avoid duplicates)
    console.log('⚙️ Creating settings...');
    await prisma.setting.deleteMany();
    await prisma.setting.createMany({
        data: [
            {
                key: 'site_name',
                value: JSON.stringify({ fr: 'Waqf And Liggeyal Daara', en: 'Waqf And Liggeyal Daara', ar: 'وقف و ليغيال دارا' }),
            },
            {
                key: 'contact_email',
                value: JSON.stringify('contact@waqf-daara.org'),
            },
            {
                key: 'contact_phone',
                value: JSON.stringify('+221 77 000 00 00'),
            },
            {
                key: 'social_links',
                value: JSON.stringify({
                    facebook: 'https://facebook.com/waqfdaara',
                    instagram: 'https://instagram.com/waqfdaara',
                    twitter: 'https://twitter.com/waqfdaara',
                    youtube: 'https://youtube.com/waqfdaara',
                }),
            },
        ],
    });
    console.log('  ✅ Settings created');

    console.log('');
    console.log('✅ Database seeded successfully!');
    console.log('');
    console.log('📋 Test accounts:');
    console.log('   Admin: admin@waqf-daara.org / Admin@2026');
    console.log('   Donor: donor@test.com / Donor@2026');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
