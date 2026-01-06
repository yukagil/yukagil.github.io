import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import SectionTitle from './components/SectionTitle';
import { useInView } from './hooks/useInView';
import { ExternalLink, Users, Lightbulb, Target, Briefcase, Code, ArrowRight } from 'lucide-react';

// Coaching Card Component with Intersection Observer
function CoachingCard({ coaching, headerColor, headerText, isDarkMode, link }: any) {
  const { ref, isInView } = useInView();
  
  const cardContent = (
    <div
      ref={ref}
      className={`flex flex-col h-full rounded-2xl border-2 overflow-hidden transition-all duration-300 hover:-translate-y-1 mobile-hover-lift ${isInView ? 'in-view' : ''} ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-600 hover:border-gray-400' 
          : 'bg-white border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000]'
      }`}
    >
      <div className={`p-4 border-b-2 ${isDarkMode ? 'border-gray-600' : 'border-black'} ${headerColor} ${headerText} flex items-center justify-between gap-3`}>
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded bg-white/20 backdrop-blur-sm">{coaching.icon}</div>
          <div>
            <h4 className="text-base font-black tracking-tight">{coaching.title}</h4>
            <p className="text-xs font-bold opacity-90">{coaching.subtitle}</p>
          </div>
        </div>
        {link && (
          <ArrowRight size={20} className="opacity-70" />
        )}
      </div>
      <div className="p-6 flex-1">
        <ul className={`space-y-2 text-sm font-medium leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {coaching.description.map((item: string, i: number) => (
            <li key={i} className="flex items-start">
              <span className="mr-2">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
  
  if (link) {
    return <Link to={link} className="block h-full">{cardContent}</Link>;
  }
  
  return cardContent;
}

interface ServicesProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

export default function Services({ isDarkMode, setIsDarkMode }: ServicesProps) {

  const coachingTypes = [
    {
      icon: <Users size={32} />,
      color: 'green',
      title: '会社・組織を変えたい',
      subtitle: 'Transformation Coaching',
      description: [
        'プロジェクトベースの文化からプロダクトベースの文化への移行',
        'プロダクト組織の立ち上げ支援',
        '企業や事業のフェーズの変化に応じたビジネス〜開発プロセスの変革'
      ],
      link: '/services/transformation'
    },
    {
      icon: <Lightbulb size={32} />,
      color: 'purple',
      title: 'プロダクトリーダーを育てたい',
      subtitle: 'Product Leadership Coaching',
      description: [
        'プロダクトビジョン/戦略/ロードマップ策定支援',
        'プロダクト組織のデザイン/チームのトレーニング',
        'プロダクトリーダーシップトレーニング'
      ],
      link: '/services/leadership'
    },
    {
      icon: <Target size={32} />,
      color: 'red',
      title: '強いプロダクトチームを作りたい',
      subtitle: 'Discovery / Delivery Coaching',
      description: [
        'プロダクトディスカバリー/デリバリーの各種トレーニング',
        'チームの自律性と成長の支援',
        'ステークホルダーとの効果的な連携'
      ],
      link: '/services/discovery'
    }
  ];

  const individualCoaching = {
    title: '個人向けプロダクトコーチング',
    description: 'キャリア相談、プロダクトマネジメントの実務相談など',
    consultationExamples: [
      {
        type: '大企業のDX・デジタルプロダクト担当者の方',
        icon: '👤',
        consultations: [
          'プロダクトマネジメントって何？何から始めればいいかわからない',
          '社内で誰に相談していいかわからず、一人で悩んでいる',
          'DXやデジタルプロダクトの担当になったけど、何をすべきか全くわからない'
        ]
      },
      {
        type: 'UXデザイナー・エンジニアの方',
        icon: '👨‍💻',
        consultations: [
          'プロダクトマネジメントの考え方を取り入れて、よりプロダクトに貢献できる視点を獲得したい',
          'PMに転向したいけど、何を勉強すればいいかわからない',
          '技術やデザインの経験はあるけど、PMとして何をすればいいかわからない'
        ]
      },
      {
        type: 'CPO・VPoPなどのキャリアに興味がある方',
        icon: '👨‍💼',
        consultations: [
          'リーダーシップキャリアに興味があるけど、何から始めればいいかわからない',
          'プロダクトリーダーになるために必要なスキルがわからない',
          '今の自分の経験でリーダーシップキャリアに進めるか不安だ'
        ]
      }
    ],
    consultationMethods: [
      {
        purpose: '匿名で相談したい',
        method: 'マシュマロ',
        description: '匿名で気軽に質問・相談ができます。具体的な悩みや疑問を気軽に投げかけてください。',
        link: 'https://marshmallow-qa.com/uos17sgwv5gcfe4?t=TsB6aG&utm_medium=url_text&utm_source=promotion',
        linkText: 'マシュマロで質問',
        badges: ['匿名', '無償']
      },
      {
        purpose: '単発で対面相談したいなら',
        method: 'Granty PM',
        description: 'プロダクトマネジメントのキャリアや実務について、1時間のオンラインMTGでじっくり相談できます。',
        link: 'https://pm-notes.com/pm_37/',
        linkText: 'Granty PMで予約',
        badges: ['単発のみ', '有償']
      },
      {
        purpose: '継続的なサポートが欲しいなら',
        method: '定期コーチング',
        description: '月2~4回のオンラインMTGとSlack等による非同期サポートで、あなたの成長を継続的に支援します。',
        link: 'https://twitter.com/yukagil',
        linkText: 'お問い合わせ',
        badges: ['有償']
      }
    ]
  };

  const corporateCoaching = {
    title: '企業向けプロダクトコーチング',
    description: '',
    items: [
      {
        title: 'Muture',
        description: '課題に適したプロフェッショナルチームを編成し、プロダクトリーダーへのアドバイザリー、外部顧問、プロダクトチーム伴走支援を提供',
        link: 'https://muture.jp/',
        linkText: 'muture.jp'
      },
      {
        title: 'Product People',
        description: 'シニアPMネットワークを活かした深いプロダクトマネジメントの専門性により、PM組織の立ち上げから次世代リーダーの育成まで支援',
        link: 'https://productpeople.jp/',
        linkText: 'productpeople.jp'
      }
    ]
  };

  const personalProducts = [
    {
      title: 'Coming Soon...',
      description: 'AIを使ったなにかしらを実験中...',
      status: '開発中',
      isPlaceholder: true
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#202020] text-gray-200' : 'bg-[#F0F0F0] text-gray-800'} font-sans relative`}>
      {/* Background Pattern */}
      <div className={`absolute inset-0 pointer-events-none z-0 ${
        isDarkMode 
          ? 'bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px] opacity-30' 
          : 'bg-[radial-gradient(#d4d4d8_2px,transparent_2px)] bg-[size:24px_24px] opacity-60'
      }`}></div>

      <Header isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} currentPage="services" />

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">

        {/* Hero Section */}
        <section className="mb-20">
          <div className={`inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest rounded-full border-2 ${
            isDarkMode 
              ? 'border-green-400 text-green-400 bg-green-900/20' 
              : 'border-black text-black bg-green-400'
          }`}>
            SERVICES
          </div>
          
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6 leading-tight ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            プロダクトマネジメントの<br />
            <span className={isDarkMode ? 'text-green-400' : 'text-green-600'}>あらゆる課題</span>に、<br />
            実践的な支援を提供します
          </h1>
          
          <p className={`text-base sm:text-lg mb-10 leading-relaxed max-w-3xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            エンジニア出身のプロダクトマネージャーとして、UX戦略の立案から実行、組織デザインまで一気通貫で推進。<br />
            企業向けの組織変革支援から、個人のキャリア相談まで、あらゆるフェーズのプロダクトマネジメントをサポートします。
          </p>

          {/* Service Category Navigation */}
          <div>
            <div className="flex flex-wrap gap-4">
              <a
                href="#corporate-coaching"
                className={`group inline-flex items-center gap-2 px-6 py-4 rounded-2xl border-4 text-base font-bold transition-all hover:-translate-y-1 ${
                  isDarkMode
                    ? 'bg-transparent border-gray-600 text-green-400 hover:bg-green-900/20 hover:border-green-600'
                    : 'bg-white border-black text-green-700 hover:bg-green-50 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000]'
                }`}
              >
                <span>💼</span>
                <span>企業向け：プロダクトマネジメント支援</span>
              </a>

              <a
                href="#individual-coaching"
                className={`group inline-flex items-center gap-2 px-6 py-4 rounded-2xl border-4 text-base font-bold transition-all hover:-translate-y-1 ${
                  isDarkMode
                    ? 'bg-transparent border-gray-600 text-blue-400 hover:bg-blue-900/20 hover:border-blue-600'
                    : 'bg-white border-black text-blue-700 hover:bg-blue-50 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000]'
                }`}
              >
                <span>👥</span>
                <span>個人向け：プロダクトコーチング</span>
              </a>

              <a
                href="#personal-products"
                className={`group inline-flex items-center gap-2 px-6 py-4 rounded-2xl border-4 text-base font-bold transition-all hover:-translate-y-1 ${
                  isDarkMode
                    ? 'bg-transparent border-gray-600 text-orange-400 hover:bg-orange-900/20 hover:border-orange-600'
                    : 'bg-white border-black text-orange-700 hover:bg-orange-50 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000]'
                }`}
              >
                <span>🚀</span>
                <span>個人プロジェクト</span>
              </a>
            </div>
          </div>
        </section>

        {/* Corporate Coaching Section */}
        <section className="mb-20 scroll-mt-24" id="corporate-coaching">
            <div className="mb-8">
              <SectionTitle title="企業向けプロダクトコーチング" icon={<Briefcase size={24} />} isDarkMode={isDarkMode} />
            </div>
            <p className={`text-lg mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              組織変革、リーダー育成、チームのディスカバリー力向上まで。<br />
              あなたの課題に合わせたコーチングサービスを提供します
            </p>
          

          
          {/* Corporate Coaching */}
          <div className="mb-12">
            
            {/* Coaching Types */}
            <div className="mb-12">
              <div className="grid md:grid-cols-3 gap-6 items-stretch" id="coaching-cards">
              {coachingTypes.map((coaching, idx) => {
                const headerColors = ['bg-green-500', 'bg-purple-500', 'bg-red-500'];
                const darkHeaderColors = ['bg-green-900', 'bg-purple-900', 'bg-red-900'];
                const headerColor = isDarkMode ? darkHeaderColors[idx % 3] : headerColors[idx % 3];
                const headerText = 'text-white';

                return (
                  <CoachingCard
                    key={idx}
                    coaching={coaching}
                    headerColor={headerColor}
                    headerText={headerText}
                    isDarkMode={isDarkMode}
                    link={coaching.link}
                  />
                );
              })}
              </div>
            </div>
            
            {/* セパレーター - 区切り線とテキスト */}
            <div className="flex items-center justify-center gap-4 my-12">
              <div className={`flex-1 h-px ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
              }`}></div>
              
              <p className={`text-base font-black text-center tracking-tight whitespace-nowrap ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <span className="relative inline-block">
                  <span className="relative z-10">ご相談は以下の企業を通じてご提供しています</span>
                  <span className={`absolute bottom-1 left-0 right-0 h-2 -z-0 ${
                    isDarkMode 
                      ? 'bg-yellow-400/40' 
                      : 'bg-yellow-300/60'
                  }`}></span>
                </span>
              </p>
              
              <div className={`flex-1 h-px ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
              }`}></div>
            </div>
            
            {/* Service Providers */}
            <div>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Muture */}
                <div
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1 mobile-hover-lift ${
                    isDarkMode ? 'bg-gray-800 border-gray-600 hover:border-gray-400' : 'bg-white border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000]'
                  }`}
                >
                  <h4 className={`text-xl font-black mb-3 tracking-tight ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {corporateCoaching.items[0].title}
                  </h4>
                  <p className={`text-sm mb-4 font-medium leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {corporateCoaching.items[0].description}
                  </p>
                  <a
                    href={corporateCoaching.items[0].link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 text-sm font-bold transition-colors ${
                      isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    {corporateCoaching.items[0].linkText}
                    <ExternalLink size={16} />
                  </a>
                </div>

                {/* Product People */}
                <div
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1 mobile-hover-lift ${
                    isDarkMode ? 'bg-gray-800 border-gray-600 hover:border-gray-400' : 'bg-white border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000]'
                  }`}
                >
                  <h4 className={`text-xl font-black mb-3 tracking-tight ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {corporateCoaching.items[1].title}
                  </h4>
                  <p className={`text-sm mb-4 font-medium leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {corporateCoaching.items[1].description}
                  </p>
                  <a
                    href={corporateCoaching.items[1].link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 text-sm font-bold transition-colors ${
                      isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    {corporateCoaching.items[1].linkText}
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Individual Coaching */}
        <section className="mb-20 scroll-mt-24" id="individual-coaching">
            <div className="mb-8">
              <SectionTitle title="個人向けプロダクトコーチング" icon={<Users size={24} />} isDarkMode={isDarkMode} />
            </div>
            <p className={`text-lg mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              キャリア相談、プロダクトマネジメントの実務相談など、気軽にご相談いただけます
            </p>
          
          <div>
            
            {/* Consultation Examples */}
            <div className="mb-4">
              <div className="grid md:grid-cols-3 gap-6 items-stretch">
                {individualCoaching.consultationExamples.map((example, idx) => {
                  const headerColors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500'];
                  const darkHeaderColors = ['bg-blue-900', 'bg-purple-900', 'bg-green-900'];
                  const headerColor = isDarkMode ? darkHeaderColors[idx % 3] : headerColors[idx % 3];
                  
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col h-full rounded-2xl border-2 overflow-hidden transition-all duration-300 hover:-translate-y-1 mobile-hover-lift ${
                        isDarkMode 
                          ? 'bg-gray-800 border-gray-600 hover:border-gray-400' 
                          : 'bg-white border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000]'
                      }`}
                    >
                      <div className={`p-4 border-b-2 ${isDarkMode ? 'border-gray-600' : 'border-black'} ${headerColor} text-white flex items-center gap-3 min-h-[72px]`}>
                        <p className="text-base font-black tracking-tight leading-tight">
                          {example.type}
                        </p>
                      </div>
                      <div className="p-6 flex-1">
                        <ul className={`space-y-2 text-sm font-medium leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {example.consultations.map((consultation, cIdx) => (
                            <li key={cIdx} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>「{consultation}」</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* セパレーター - 区切り線とテキスト */}
            <div className="flex items-center justify-center gap-4 my-12">
              <div className={`flex-1 h-px ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
              }`}></div>
              
              <p className={`text-base font-black text-center tracking-tight whitespace-nowrap ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <span className="relative inline-block">
                  <span className="relative z-10">ご相談内容に応じた窓口をご利用ください</span>
                  <span className={`absolute bottom-1 left-0 right-0 h-2 -z-0 ${
                    isDarkMode 
                      ? 'bg-yellow-400/40' 
                      : 'bg-yellow-300/60'
                  }`}></span>
                </span>
              </p>
              
              <div className={`flex-1 h-px ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
              }`}></div>
            </div>
            
            {/* Consultation Methods */}
            <div className="mb-8">
              <div className="grid md:grid-cols-3 gap-6 items-stretch">
                {individualCoaching.consultationMethods.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1 mobile-hover-lift flex flex-col ${
                      isDarkMode ? 'bg-gray-800 border-gray-600 hover:border-gray-400' : 'bg-white border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000]'
                    }`}
                  >
                    <div className="flex-1">
                      <p className={`text-sm font-bold mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.purpose}
                      </p>
                      <h4 className={`text-xl font-black tracking-tight mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {item.method}
                      </h4>
                      <p className={`text-sm mb-3 font-medium leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.description}
                      </p>
                      {item.method === 'Granty PM' && (
                        <p className={`text-xs mb-4 leading-relaxed ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          ※ 目安：5,000円程度 / 1時間
                        </p>
                      )}
                      {item.method === '定期コーチング' && (
                        <p className={`text-xs mb-4 leading-relaxed ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          ※ 目安：パーソナルジム程度
                        </p>
                      )}
                      {item.method !== 'Granty PM' && item.method !== '定期コーチング' && <div className="mb-4"></div>}
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 text-sm font-bold transition-colors ${
                          isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                        }`}
                      >
                        {item.linkText}
                        <ExternalLink size={16} />
                      </a>
                    </div>
                    {item.badges.length > 0 && (
                      <>
                        <div className={`border-t border-dashed mt-4 pt-4 -mx-6 px-6 relative ${
                          isDarkMode 
                            ? 'border-gray-700/50 bg-gray-800' 
                            : 'border-gray-300/60 bg-white'
                        }`}>
                          <div className="flex flex-wrap gap-2">
                            {item.badges.map((badge, bIdx) => (
                              <span
                                key={bIdx}
                                className={`text-xs font-bold px-2 py-1 rounded border-2 ${
                                  isDarkMode 
                                    ? 'bg-gray-700/50 border-gray-600 text-gray-300' 
                                    : 'bg-gray-100 border-gray-400 text-gray-700'
                                }`}
                              >
                                {badge}
                              </span>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              {/* 迷ったら人向け */}
              <div
                className={`mt-6 p-6 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1 ${
                  isDarkMode ? 'bg-gray-800 border-gray-600 hover:border-gray-400' : 'bg-white border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000]'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className={`text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      迷ったら
                    </p>
                    <h4 className={`text-xl font-black tracking-tight mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      お問い合わせフォームからお気軽に
                    </h4>
                    <p className={`text-sm font-medium leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      どの相談方法が自分に合うかわからない場合は、お気軽にお問い合わせフォームからご連絡ください。
                    </p>
                  </div>
                  <Link
                    to="/contact"
                    className={`flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 font-bold transition-all duration-200 hover:-translate-y-0.5 ${
                      isDarkMode
                        ? 'bg-green-600 border-green-400 text-white hover:bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]'
                        : 'bg-green-600 border-black text-white shadow-[2px_2px_0_0_#000] hover:shadow-[3px_3px_0_0_#000]'
                    }`}
                  >
                    お問い合わせフォームへ
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Personal Products */}
        <section className="mb-20 scroll-mt-24" id="personal-products">
          <div className="mb-8">
            <SectionTitle title="個人プロジェクト" icon={<Code size={24} />} isDarkMode={isDarkMode} />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personalProducts.map((product, idx) => (
              <div
                key={idx}
                className={`relative p-6 rounded-2xl border-2 border-dashed transition-all duration-300 hover:-translate-y-1 hover:rotate-1 ${
                  isDarkMode ? 'bg-gray-800 border-gray-600 hover:border-gray-400' : 'bg-white border-black'
                }`}
              >
                {/* Decorative element */}
                <div className={`absolute -top-3 -right-3 w-12 h-12 rounded-full border-2 flex items-center justify-center text-2xl ${
                  isDarkMode ? 'bg-gray-800 border-orange-600' : 'bg-orange-400 border-black'
                }`}>
                  🚀
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border-2 ${
                    isDarkMode 
                      ? 'bg-orange-500/20 border-orange-500/30 text-orange-400' 
                      : 'bg-orange-100 border-orange-600 text-orange-700'
                  }`}>
                    {product.status}
                  </span>
                  <span className={`text-xs font-mono ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    ···
                  </span>
                </div>
                
                <div className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  {product.title}
                </div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {product.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}


