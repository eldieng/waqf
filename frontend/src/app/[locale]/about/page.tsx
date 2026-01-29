import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section with Video */}
            <section className="relative py-20 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 to-slate-900/90" />
                <div className="container relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="inline-block px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-semibold mb-6">
                                À propos de notre organisation
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                Qui sommes-nous ?
                            </h1>
                            <p className="text-xl text-slate-300 leading-relaxed mb-8">
                                Waqf Sénégal est une organisation dédiée au soutien des Daaras et à l&apos;éducation 
                                des enfants à travers le principe islamique du Waqf (dotation perpétuelle).
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-emerald-400">10+</div>
                                    <div className="text-sm text-slate-400">Années</div>
                                </div>
                                <div className="w-px h-12 bg-slate-700" />
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-emerald-400">500+</div>
                                    <div className="text-sm text-slate-400">Enfants</div>
                                </div>
                                <div className="w-px h-12 bg-slate-700" />
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-emerald-400">50+</div>
                                    <div className="text-sm text-slate-400">Projets</div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            {/* YouTube Video */}
                            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                                <iframe
                                    src="https://www.youtube.com/embed/cxRMUCUBvp8"
                                    title="Waqf Sénégal - Notre Mission"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="absolute inset-0 w-full h-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Le Waqf : Une Solidarité en Action */}
            <section className="py-20 bg-white">
                <div className="container">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/img/imgi_51_Image_fx85.jpg"
                                    alt="Enfants dans un Daara"
                                    width={600}
                                    height={500}
                                    className="w-full h-[500px] object-cover"
                                />
                            </div>
                            {/* Floating stats card */}
                            <div className="absolute -bottom-6 -right-6 bg-emerald-500 text-white rounded-2xl p-6 shadow-xl">
                                <div className="text-4xl font-bold">95%</div>
                                <div className="text-sm">des dons utilisés</div>
                            </div>
                        </div>
                        <div>
                            <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
                                Notre Impact
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                                Le Waqf : Une Solidarité en Action
                            </h2>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Découvrez comment votre contribution transforme concrètement le quotidien des Talibés. 
                                Le Waqf n&apos;est pas une simple aumône, c&apos;est une fondation solide pour l&apos;avenir 
                                de notre communauté.
                            </p>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                                        <span className="text-2xl">🏫</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Rénovation d&apos;infrastructures éducatives</h3>
                                        <p className="text-sm text-slate-500">Construction et modernisation des Daaras</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                                        <span className="text-2xl">🤝</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Construit Des Communautés Plus Fortes</h3>
                                        <p className="text-sm text-slate-500">Renforcement des liens sociaux et solidaires</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                                        <span className="text-2xl">♾️</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Investissement durable et perpétuel</h3>
                                        <p className="text-sm text-slate-500">Des bénéfices qui durent pour toujours</p>
                                    </div>
                                </div>
                            </div>

                            <Link 
                                href="/fr/donate"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white font-bold rounded-full hover:bg-emerald-600 transition-colors"
                            >
                                Rejoignez la communauté maintenant
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3 Façons de Bâtir l'Avenir */}
            <section className="py-20 bg-slate-50">
                <div className="container">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
                            Comment participer
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            3 Façons de Bâtir l&apos;Avenir
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Chaque geste compte. Que ce soit par un investissement financier, un parrainage 
                            ou votre temps, vous avez le pouvoir de changer des vies durablement.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all">
                            <div className="h-48 relative overflow-hidden">
                                <Image
                                    src="/img/parrainer-un-talibe.jpg"
                                    alt="Parrainer un Talibé"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent" />
                                <div className="absolute bottom-4 left-4">
                                    <span className="px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full backdrop-blur-sm">
                                        Parrainage
                                    </span>
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">Parrainer un Talibé</h3>
                                <p className="text-slate-600 mb-6">
                                    Accompagnez un enfant dans son parcours éducatif. Votre parrainage couvre 
                                    ses besoins essentiels : éducation, santé, alimentation.
                                </p>
                                <Link 
                                    href="/fr/donate"
                                    className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700"
                                >
                                    En savoir plus
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        <div className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all">
                            <div className="h-48 relative overflow-hidden">
                                <Image
                                    src="/img/faire-un-waqf.webp"
                                    alt="Faire un Waqf"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent" />
                                <div className="absolute bottom-4 left-4">
                                    <span className="px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full backdrop-blur-sm">
                                        Don
                                    </span>
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">Faire un Waqf</h3>
                                <p className="text-slate-600 mb-6">
                                    Investissez dans une charité perpétuelle. Votre Waqf génère des bénéfices 
                                    continus pour la communauté, génération après génération.
                                </p>
                                <Link 
                                    href="/fr/donate"
                                    className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700"
                                >
                                    Faire un don
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        <div className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all">
                            <div className="h-48 relative overflow-hidden">
                                <Image
                                    src="/img/devenir-benevole.webp"
                                    alt="Devenir Bénévole"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/60 to-transparent" />
                                <div className="absolute bottom-4 left-4">
                                    <span className="px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full backdrop-blur-sm">
                                        Bénévolat
                                    </span>
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">Devenir Bénévole</h3>
                                <p className="text-slate-600 mb-6">
                                    Donnez de votre temps et de vos compétences. Rejoignez notre équipe 
                                    de bénévoles et participez activement à nos projets sur le terrain.
                                </p>
                                <Link 
                                    href="/fr/contact"
                                    className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700"
                                >
                                    Nous rejoindre
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-white">
                <div className="container">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
                            Nos Valeurs
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Ce qui nous guide
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { 
                                icon: '🤝', 
                                title: 'Transparence', 
                                desc: 'Chaque don est tracé et son utilisation est communiquée aux donateurs.' 
                            },
                            { 
                                icon: '❤️', 
                                title: 'Solidarité', 
                                desc: 'Nous croyons en la force de la communauté pour créer un changement durable.' 
                            },
                            { 
                                icon: '⭐', 
                                title: 'Excellence', 
                                desc: 'Nous visons l\'excellence dans chaque projet que nous entreprenons.' 
                            },
                            { 
                                icon: '🙏', 
                                title: 'Respect', 
                                desc: 'Nous respectons la dignité de chaque personne que nous servons.' 
                            },
                        ].map((value, i) => (
                            <div key={i} className="text-center group">
                                <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-500 transition-colors">
                                    <span className="text-4xl">{value.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                                <p className="text-slate-600">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact Numbers */}
            <section className="py-20 bg-emerald-600">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Notre Impact
                        </h2>
                        <p className="text-emerald-100 text-lg">
                            Des chiffres qui témoignent de votre générosité
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-5xl md:text-6xl font-bold text-white mb-2">10+</div>
                            <div className="text-emerald-100 text-lg">Années d&apos;expérience</div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl md:text-6xl font-bold text-white mb-2">50+</div>
                            <div className="text-emerald-100 text-lg">Projets réalisés</div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl md:text-6xl font-bold text-white mb-2">500+</div>
                            <div className="text-emerald-100 text-lg">Enfants soutenus</div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl md:text-6xl font-bold text-white mb-2">15</div>
                            <div className="text-emerald-100 text-lg">Régions couvertes</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-white">
                <div className="container">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
                            Notre Équipe
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Des personnes dévouées
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Une équipe passionnée qui travaille chaque jour pour faire la différence
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { name: 'Amadou Diop', role: 'Directeur Général', avatar: 'A' },
                            { name: 'Fatou Sall', role: 'Responsable des Projets', avatar: 'F' },
                            { name: 'Moussa Ba', role: 'Coordinateur Terrain', avatar: 'M' },
                        ].map((member, i) => (
                            <div key={i} className="text-center">
                                <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-5xl font-bold text-emerald-600">{member.avatar}</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                                <p className="text-slate-500">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Transparency Section */}
            <section className="py-20 bg-slate-50">
                <div className="container">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100">
                            <div className="grid md:grid-cols-2 gap-10 items-center">
                                <div>
                                    <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
                                        Transparence
                                    </span>
                                    <h2 className="text-3xl font-bold text-slate-900 mb-4">
                                        Nous rendons des comptes
                                    </h2>
                                    <p className="text-slate-600 mb-6 leading-relaxed">
                                        La transparence est au cœur de notre action. Nous publions régulièrement 
                                        nos rapports financiers et d&apos;activité pour que vous sachiez exactement 
                                        comment vos dons sont utilisés.
                                    </p>
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">✓</span>
                                            <span className="text-slate-700">Rapports annuels publics</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">✓</span>
                                            <span className="text-slate-700">Audits financiers indépendants</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">✓</span>
                                            <span className="text-slate-700">Suivi en temps réel des projets</span>
                                        </div>
                                    </div>
                                    <button className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors">
                                        Télécharger le rapport annuel
                                    </button>
                                </div>
                                <div className="relative">
                                    <div className="bg-emerald-50 rounded-2xl p-8">
                                        <div className="text-center">
                                            <div className="text-6xl font-bold text-emerald-600 mb-2">95%</div>
                                            <div className="text-slate-600">des dons vont directement aux projets</div>
                                        </div>
                                        <div className="mt-8 space-y-4">
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-slate-600">Projets</span>
                                                    <span className="font-semibold text-slate-900">95%</span>
                                                </div>
                                                <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '95%' }} />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-slate-600">Administration</span>
                                                    <span className="font-semibold text-slate-900">5%</span>
                                                </div>
                                                <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                                                    <div className="h-full bg-slate-400 rounded-full" style={{ width: '5%' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-emerald-900">
                <div className="container">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Rejoignez notre mission
                        </h2>
                        <p className="text-xl text-emerald-100 mb-8">
                            Ensemble, nous pouvons offrir un avenir meilleur aux enfants du Sénégal.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link 
                                href="/fr/donate" 
                                className="px-10 py-4 bg-white text-emerald-700 font-bold rounded-full hover:bg-slate-100 transition-all text-lg"
                            >
                                Faire un don
                            </Link>
                            <Link 
                                href="/fr/contact" 
                                className="px-10 py-4 bg-transparent text-white border-2 border-white rounded-full font-bold hover:bg-white/10 transition-all text-lg"
                            >
                                Devenir bénévole
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
