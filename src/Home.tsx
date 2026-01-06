import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './components/Header';
import SectionTitle from './components/SectionTitle';
import { 
  Briefcase, 
  ExternalLink, 
  Linkedin, 
  Twitter,
  BookOpen, 
  Code, 
  Users, 
  Zap,
  MapPin,
  Mic2,
  MessageSquare,
  FileText,
  Video,
  Link as LinkIcon,
  RefreshCw,
  Lightbulb,
  Globe,
  Scale,
  Facebook,
  Mail,
  ArrowRight,
  Utensils,
  Tent,
  Mountain
} from 'lucide-react';

// ビルド時に生成された静的データをインポート
import staticWritings from './data/writings.json';
import staticSpeakings from './data/speakings.json';
import staticInterviews from './data/interviews.json';

// 最終更新日 (ビルド時に自動生成)
const LAST_UPDATED = new Date().toLocaleDateString('ja-JP', { 
  year: 'numeric', 
  month: '2-digit', 
  day: '2-digit' 
}).replace(/\//g, '.');

// --- Types & Interfaces ---

interface Role {
  title: string;
  period: string;
  description?: string;
}

interface CompanyExperience {
  id: string;
  company: string;
  companyDescription?: string;
  website?: string;
  totalPeriod: string;
  roles: Role[];
  description: string;
  isCurrent: boolean;
  branchType?: 'main' | 'feature';
  tags?: string[];
}

// リンク情報の型定義
interface RelatedLink {
  label: string;
  url: string;
  type: 'slide' | 'video' | 'article' | 'event';
}

// 登壇実績データ（拡張）
interface Speaking {
  id: string;
  date: string;
  event: string;
  title: string;
  mainLink: string; // メインのリンク
  relatedLinks: RelatedLink[]; // 関連リンク
  imageUrl?: string; // サムネイル画像
}

interface Interview {
  id: string;
  date: string;
  media: string;
  title: string;
  link: string;
  imageUrl?: string; // サムネイル画像
}

interface PortfolioData {
  profile: {
    name: string;
    role: string;
    subRole: string;
    description: string;
    location: string;
    hobbies: string;
    imageUrl: string;
  };
  socials: {
    twitter: string;
    linkedin: string;
    facebook: string;
  };
  experiences: CompanyExperience[];
  philosophies: Array<{
    id: string;
    title: string;
    content: string;
    iconType: 'users' | 'zap' | 'code' | 'briefcase' | 'lightbulb' | 'globe' | 'scale';
  }>;
  writings: Array<{
    id: string;
    title: string;
    source: string;
    date: string;
    link: string;
    imageUrl?: string;
  }>;
  speakings: Speaking[];
  interviews: Interview[];
}


interface PortfolioProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

const Portfolio = ({ isDarkMode, setIsDarkMode }: PortfolioProps) => {
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // --- Static Data ---
  const data: PortfolioData = {
        profile: {
          name: "Yuta Kanehara",
          role: "Product Manager",
          subRole: "Org Design × Engineering × UX",
          description: "プロダクトマネジメントのプロフェッショナルとして、UX戦略から組織デザインまで、プロダクトの成功に必要なすべての要素を統合します。戦略から実装まで一貫してサポートし、チームと共に価値あるプロダクトを届けます。",
          location: "Tokyo, Japan",
          hobbies: "Camping Lover",
          imageUrl: "https://storage.googleapis.com/studio-cms-assets/projects/Z9qp7nJGOP/s-1120x1120_v-fs_webp_2a3f9622-e54d-4f8b-8670-510ba156906d_small.webp"
        },
        socials: {
          twitter: "https://twitter.com/yukagil",
          linkedin: "https://www.linkedin.com/in/yuta-kanehara/",
          facebook: "https://www.facebook.com/yuta.kanehara"
        },
        experiences: [
          {
            id: "muture",
            company: "Muture",
            companyDescription: "丸井グループとGoodpatchの合弁会社。プロダクト開発と組織変革を両立し、持続可能な変革を支援するDXパートナー。",
            website: "https://muture.jp/",
            totalPeriod: "2023.02 - Current",
            tags: ["ジョイントベンチャー", "Org Design", "UX Strategy"],
            roles: [
              {
                title: "執行役員／Chief Product Officer",
                period: "2024.07 - Current",
                description: "プロダクト戦略の統括および組織づくりをリード。"
              },
              {
                title: "Product Manager",
                period: "2023.02 - 2024.06",
                description: "「良い組織が、良いプロダクトを生み出す」という信念のもと、DX支援・プロダクト開発に従事。"
              }
            ],
            description: "",
            isCurrent: true,
            branchType: 'main'
          },
          {
            id: "marui",
            company: "marui unite",
            companyDescription: "丸井グループのデジタルプロダクト開発を行うテックカンパニー。「好き」とデジタルの力で新しい体験を共創する。",
            website: "https://marui-unite.co.jp/",
            totalPeriod: "2024.10 - Current",
            tags: ["エンタープライズ", "FinTech", "Retail"],
            roles: [
              {
                title: "Chief Product Officer",
                period: "2024.10 - Current",
                description: "丸井グループの新規事業創出、共創のエコシステムづくりをリード。"
              }
            ],
            description: "",
            isCurrent: true,
            branchType: 'feature'
          },
          {
            id: "showcase",
            company: "Showcase Gig",
            companyDescription: "モバイルオーダープラットフォーム「O:der」を提供するベンチャー企業。デジタル化による次世代店舗体験を創出。",
            website: "https://www.showcase-gig.com/",
            totalPeriod: "2020.02 - 2023.02",
            tags: ["ベンチャー", "Retail", "FoodTech", "OMO"],
            roles: [
              {
                title: "VP of Product",
                period: "2022.03 - 2023.02",
                description: "中期経営計画として5ヵ年ロードマップを策定。SMB中心からエンタープライズへの転換を推進する中「SaaS冬の時代」が到来。グロース重視から利益重視の戦略に再転換を行う。"
              },
              {
                title: "Product Manager",
                period: "2020.02 - 2022.03",
                description: "1人目PdMとして入社。PoC中のイートインプロダクトを担当するもコロナ禍に突入したためテイクアウトやデリバリーを含むオールインワン戦略へ転換。システムリアーキやリブランディングまでの一連においてプロダクトチームをリード。"
              }
            ],
            description: "",
            isCurrent: false
          },
          {
            id: "dena",
            company: "DeNA",
            companyDescription: "ゲーム、ライブストリーミング、スポーツ、ヘルスケアなど、インターネットとAIを駆使して多角的に事業を展開するIT企業。",
            website: "https://dena.com/",
            totalPeriod: "2016.04 - 2020.02",
            tags: ["メガベンチャー", "Engineering"],
            roles: [
              {
                title: "Software Engineer / Project Manager",
                period: "2018.11 - 2020.02",
                description: "アライアンス案件におけるグローバルプラットフォームの開発に従事。開発者向けのID基盤やアカウントサービスなどを担当。"
              },
              {
                title: "Software Engineer",
                period: "2016.04 - 2018.11",
                description: "iOS/Android向けの電子書籍サービス、インディーズ作品のプラットフォーム開発に従事。"
              }
            ],
            description: "",
            isCurrent: false
          }
        ],
        philosophies: [
          {
            id: "p1",
            title: "良い組織が、良いプロダクトを作る",
            content: "心理的安全性の高いチーム、自律的な意思決定ができる組織構造を大切にしています。プロダクトは組織の写し鏡であり、良い組織があってこそ、ユーザーに価値を届け続けるプロダクトが生まれます。",
            iconType: 'users'
          },
          {
            id: "p3",
            title: "理論と実践を、結びつける",
            content: "理論に裏付けられた実践と、実践に裏付けられた理論。プラクティショナーとして、この結びつきを大切にしながら、再現性のある現実的なアプローチで進みます。",
            iconType: 'lightbulb'
          },
          {
            id: "p4",
            title: "二項対立を超える",
            content: "ビジネス価値とユーザー価値をバランスさせ続けることを大切にしています。どちらかを選ぶのではなく、両方を実現する方法を探し続けます。",
            iconType: 'scale'
          }
        ],
        // ビルド時に生成された静的データを使用
        writings: staticWritings,
        speakings: staticSpeakings as Speaking[],
        interviews: staticInterviews as Interview[]
      };

  const getPhilosophyIcon = (type: string) => {
    switch (type) {
      case 'users': return <Users className="text-blue-500" />;
      case 'zap': return <Zap className="text-yellow-500" />;
      case 'code': return <Code className="text-green-500" />;
      case 'briefcase': return <Briefcase className="text-purple-500" />;
      case 'lightbulb': return <Lightbulb className="text-yellow-500" />;
      case 'globe': return <Globe className="text-green-500" />;
      case 'scale': return <Scale className="text-green-500" />;
      default: return <Users className="text-blue-500" />;
    }
  };


  const mutureExp = data.experiences.find(e => e.id === 'muture');
  const maruiExp = data.experiences.find(e => e.id === 'marui');
  const otherExps = data.experiences.filter(e => e.id !== 'muture' && e.id !== 'marui');

  // Writings表示数管理
  const [displayedWritingsCount, setDisplayedWritingsCount] = useState(5);
  const allWritings = data.writings;
  const displayedWritings = allWritings.slice(0, displayedWritingsCount);
  const hasMoreWritings = allWritings.length > displayedWritingsCount;

  // アイコンの円形軌道管理（プロフィール画像から大きく逸れないように）
  const [iconAngles, setIconAngles] = useState([0, 120, 240]); // 各アイコンの初期角度（度）

  useEffect(() => {
    const startTime = Date.now();
    
    const updatePositions = () => {
      const elapsed = (Date.now() - startTime) / 1000; // 経過時間（秒）
      
      // 各アイコンの角度を更新（滑らかに回転）
      setIconAngles([
        elapsed * (30 + Math.sin(elapsed * 0.3) * 5),  // 30度/秒をベースに±5度/秒の変動
        elapsed * (25 + Math.cos(elapsed * 0.4) * 5),   // 25度/秒をベースに±5度/秒の変動
        elapsed * (35 + Math.sin(elapsed * 0.35) * 5)   // 35度/秒をベースに±5度/秒の変動
      ]);
    };

    // アニメーションフレームで滑らかに更新
    const animationFrame = () => {
      updatePositions();
      requestAnimationFrame(animationFrame);
    };

    const frameId = requestAnimationFrame(animationFrame);

    return () => cancelAnimationFrame(frameId);
  }, []);

  // 角度から位置を計算する関数
  const getCircularPosition = (angle: number, radius: number, centerX: number, centerY: number) => {
    const rad = (angle * Math.PI) / 180;
    const x = centerX + radius * Math.cos(rad);
    const y = centerY + radius * Math.sin(rad);
    return { x, y };
  };

  // 各アイコンの円形軌道の設定（プロフィール画像の周りを回る、半径を小さくして逸れないように）
  const iconOrbits = [
    { radius: 28, startAngle: 0, anchor: 'top-right' },    // 右上から開始
    { radius: 28, startAngle: 120, anchor: 'top-left' }, // 左上から開始
    { radius: 28, startAngle: 240, anchor: 'bottom-right' } // 右下から開始
  ];

  const iconPositions = iconAngles.map((angle, idx) => {
    const orbit = iconOrbits[idx];
    const totalAngle = orbit.startAngle + angle;
    const pos = getCircularPosition(totalAngle, orbit.radius, 0, 0);
    
    if (orbit.anchor === 'top-right') {
      return { top: pos.y - 16, right: -pos.x - 16 };
    } else if (orbit.anchor === 'top-left') {
      return { top: pos.y - 16, left: pos.x - 16 };
    } else {
      return { bottom: -pos.y - 16, right: -pos.x - 16 };
    }
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#202020] text-gray-200' : 'bg-[#F0F0F0] text-gray-800'} font-sans relative`}>
      {/* Background Pattern */}
      <div className={`absolute inset-0 pointer-events-none z-0 ${
        isDarkMode 
          ? 'bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px] opacity-30' 
          : 'bg-[radial-gradient(#d4d4d8_2px,transparent_2px)] bg-[size:24px_24px] opacity-60'
      }`}></div>

      <Header isDarkMode={isDarkMode} onToggleTheme={toggleTheme} currentPage="home" />

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {/* Hero Section */}
        <section id="about" className="mb-16">
          <div className="flex flex-col-reverse md:flex-row items-start md:items-center justify-between gap-12">
            <div className="flex-1">
              <div className={`inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest rounded-full border-2 ${
                isDarkMode 
                  ? 'border-blue-400 text-blue-400 bg-blue-900/20' 
                  : 'border-black text-black bg-yellow-400'
              }`}>
                PRODUCT MANAGER
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 leading-none">
                Yuta Kanehara <br />
                <span className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>{data.profile.subRole}</span>
              </h1>
              <div className={`p-6 rounded-2xl border-2 mb-8 relative ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-600 shadow-[6px_6px_0_0_#4b5563]' 
                  : 'bg-white border-black shadow-[6px_6px_0_0_#000]'
              }`}>
                {/* Decorative Screw heads */}
                <div className={`absolute top-2 left-2 w-2 h-2 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                <div className={`absolute bottom-2 left-2 w-2 h-2 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                <div className={`absolute bottom-2 right-2 w-2 h-2 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                
                <p className={`text-lg font-medium leading-relaxed whitespace-pre-wrap ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {data.profile.description}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-8">
                {data.socials.twitter && <SocialLink href={data.socials.twitter} icon={<Twitter size={20} />} label="X (Twitter)" isDarkMode={isDarkMode} neonColor="cyan" lightBg="bg-[#1DA1F2]" />}
                {data.socials.linkedin && <SocialLink href={data.socials.linkedin} icon={<Linkedin size={20} />} label="LinkedIn" isDarkMode={isDarkMode} neonColor="blue" lightBg="bg-[#0A66C2]" />}
                {data.socials.facebook && <SocialLink href={data.socials.facebook} icon={<Facebook size={20} />} label="Facebook" isDarkMode={isDarkMode} neonColor="pink" lightBg="bg-[#1877F2]" />}
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center text-sm font-bold font-mono">
                  <MapPin size={18} className={`mr-2 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{data.profile.location}</span>
                </div>
                <div className="flex items-center text-sm font-bold font-mono">
                  <RefreshCw size={18} className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Last updated: {LAST_UPDATED}</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className={`w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 relative z-10 ${
                isDarkMode 
                  ? 'border-gray-600 shadow-[0_0_20px_rgba(59,130,246,0.5)]' 
                  : 'border-black shadow-[8px_8px_0_0_#000]'
              }`}>
                <img 
                  src={data.profile.imageUrl} 
                  alt={data.profile.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative elements behind photo */}
              {/* ラーメン */}
              <div 
                className={`absolute w-12 h-12 rounded-full border-2 z-20 flex items-center justify-center transition-all duration-300 ease-out ${
                  isDarkMode ? 'bg-gray-800 border-orange-400 text-orange-400' : 'bg-orange-400 border-black text-black'
                }`}
                style={{
                  top: `${iconPositions[0].top}px`,
                  right: `${iconPositions[0].right}px`
                }}
              >
                <Utensils size={20} />
              </div>
              {/* キャンプ */}
              <div 
                className={`absolute w-12 h-12 rounded-full border-2 z-20 flex items-center justify-center transition-all duration-300 ease-out ${
                  isDarkMode ? 'bg-gray-800 border-green-400 text-green-400' : 'bg-green-400 border-black text-black'
                }`}
                style={{
                  top: `${iconPositions[1].top}px`,
                  left: `${iconPositions[1].left}px`
                }}
              >
                <Tent size={20} />
              </div>
              {/* スノーボード */}
              <div 
                className={`absolute w-12 h-12 rounded-full border-2 z-20 flex items-center justify-center transition-all duration-300 ease-out ${
                  isDarkMode ? 'bg-gray-800 border-blue-400 text-blue-400' : 'bg-blue-400 border-black text-black'
                }`}
                style={{
                  bottom: `${iconPositions[2].bottom}px`,
                  right: `${iconPositions[2].right}px`
                }}
              >
                <Mountain size={20} />
              </div>
              <div className={`absolute -bottom-2 -left-2 px-3 py-1 rounded-full border-2 z-20 font-bold text-xs ${
                isDarkMode ? 'bg-gray-800 border-green-400 text-green-400' : 'bg-red-500 border-black text-white'
              }`}>
                @yukagil
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section id="philosophy" className="mb-16">
          <div className="mb-8">
            <SectionTitle title="Philosophy" icon={<Zap size={24} />} isDarkMode={isDarkMode} />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {data.philosophies.map((phil, idx) => (
              <PhilosophyCard 
                key={phil.id}
                icon={getPhilosophyIcon(phil.iconType)}
                title={phil.title}
                content={phil.content}
                isDarkMode={isDarkMode}
                index={idx}
              />
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="mb-16">
          <div className="mb-6">
            <SectionTitle title="Experience" icon={<Briefcase size={24} />} isDarkMode={isDarkMode} />
          </div>
          
          <div className="relative ml-2 sm:ml-4">
            {/* Timeline Line - Enhanced with gradient and glow */}
            <div className={`absolute left-[19px] top-4 bottom-0 w-1 ${
              isDarkMode ? 'bg-gradient-to-b from-blue-600 via-blue-500 to-blue-600' : 'bg-gradient-to-b from-blue-500 via-blue-400 to-blue-500'
            }`} style={{
              boxShadow: isDarkMode 
                ? '0 0 8px rgba(37, 99, 235, 0.3), inset 0 0 4px rgba(37, 99, 235, 0.2)' 
                : '0 0 8px rgba(59, 130, 246, 0.2), inset 0 0 4px rgba(59, 130, 246, 0.1)'
            }}></div>

            <div className="relative space-y-16">
              
              {/* Special Layout for Muture & Marui Unite */}
              <div className="relative">
                
                {/* Marui Unite (Top/Future Branch) */}
                {maruiExp && (
                  <div className="relative ml-16 mb-12">
                    {/* SVG Connector */}
                    <div className="absolute -left-[43px] top-9 w-16 h-20 pointer-events-none">
                       <svg className="w-full h-full overflow-visible">
                         <path 
                           d="M 0 80 C 0 40, 64 40, 64 0" 
                           fill="none" 
                           stroke={isDarkMode ? "#2563eb" : "#3b82f6"} // Blue
                           strokeWidth="4"
                         />
                       </svg>
                    </div>

                    <ExperienceItem 
                      experience={maruiExp} 
                      isDarkMode={isDarkMode} 
                    />
                  </div>
                )}

                {/* Muture (Main/Base) */}
                {mutureExp && (
                  <div className="relative">
                    <ExperienceItem 
                      experience={mutureExp} 
                      isDarkMode={isDarkMode} 
                    />
                  </div>
                )}

              </div>

              {/* Other Experiences */}
              {otherExps.map((exp) => (
                <ExperienceItem 
                  key={exp.id}
                  experience={exp}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Interviews Section */}
        <section id="interviews" className="mb-16">
          <div className="mb-6">
            <SectionTitle title="Interviews" icon={<MessageSquare size={24} />} isDarkMode={isDarkMode} />
          </div>
          <div className="grid gap-3">
            {data.interviews.map((interview) => (
              <InterviewItem 
                key={interview.id}
                interview={interview}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        </section>

        {/* Public Speaking Section */}
        <section id="speaking" className="mb-16">
          <div className="mb-6">
            <SectionTitle title="Public Speaking" icon={<Mic2 size={24} />} isDarkMode={isDarkMode} />
          </div>
          <div className="grid gap-3">
            {data.speakings.map((speak) => (
              <SpeakingItem 
                key={speak.id}
                speak={speak}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        </section>

        {/* Writings Section */}
        <section id="writings" className="mb-16">
          <div className="mb-6">
            <SectionTitle title="Writings" icon={<BookOpen size={24} />} isDarkMode={isDarkMode} />
          </div>
          
          <div className="space-y-6">
            <div className="grid gap-3">
              {displayedWritings.map((writing) => (
                <WritingItem 
                  key={writing.id}
                  title={writing.title}
                  source={writing.source}
                  date={writing.date}
                  link={writing.link}
                  imageUrl={writing.imageUrl}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
            {hasMoreWritings && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setDisplayedWritingsCount(allWritings.length)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500'
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
                  }`}
                >
                  もっと見る
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="mb-16">
          <div className="mb-6">
            <SectionTitle title="Services" icon={<Briefcase size={24} />} isDarkMode={isDarkMode} />
          </div>
          
          <p className={`mb-6 text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            プロダクトマネジメント、組織デザイン、エンジニアリングの観点から、<br />
            企業向けのアドバイザリーから個人向けのコーチングなど、様々なサービスを提供しています。
          </p>
          <div className="flex justify-center">
            <Link
              to="/services"
              className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                isDarkMode
                  ? 'bg-blue-600 border-blue-400 text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]'
                  : 'bg-blue-600 border-black text-white shadow-[2px_2px_0_0_#000] hover:shadow-[3px_3px_0_0_#000]'
              }`}
            >
              <Briefcase size={18} />
              <span className="font-bold">サービス紹介を見る</span>
            </Link>
          </div>
        </section>

        {/* Footer Contact */}
        <section className={`rounded-3xl p-12 text-center border-2 relative overflow-hidden ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-600' 
            : 'bg-white border-black'
        }`}>
          {/* Background decoration */}
          <div className={`absolute top-0 left-0 w-full h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} border-b-2 ${isDarkMode ? 'border-gray-600' : 'border-black'}`}></div>
          <div className={`absolute bottom-0 left-0 w-full h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} border-t-2 ${isDarkMode ? 'border-gray-600' : 'border-black'}`}></div>

          <h2 className="text-3xl font-black mb-6">Let's Connect!</h2>
          <p className={`mb-8 text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            プロダクトマネジメント、組織づくり、あるいはキャンプの話まで。<br />
            お気軽にご連絡ください。
          </p>
          <div className="flex flex-col items-center gap-4">
            <div className="flex justify-center items-center gap-3 w-full max-w-md">
              <a 
                href={data.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 flex items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                  isDarkMode
                    ? 'bg-transparent border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]'
                    : 'bg-[#1DA1F2] border-black text-white shadow-[2px_2px_0_0_#000] hover:shadow-[3px_3px_0_0_#000] [&_svg]:fill-white'
                }`}
              >
                <Twitter size={20} />
              </a>
              <a 
                href={data.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 flex items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                  isDarkMode
                    ? 'bg-transparent border-blue-400 text-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.3)] hover:shadow-[0_0_20px_rgba(96,165,250,0.5)]'
                    : 'bg-[#0A66C2] border-black text-white shadow-[2px_2px_0_0_#000] hover:shadow-[3px_3px_0_0_#000] [&_svg]:fill-white'
                }`}
              >
                <Linkedin size={20} />
              </a>
              <a 
                href={data.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 flex items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                  isDarkMode
                    ? 'bg-transparent border-pink-400 text-pink-400 shadow-[0_0_15px_rgba(244,114,182,0.3)] hover:shadow-[0_0_20px_rgba(244,114,182,0.5)]'
                    : 'bg-[#1877F2] border-black text-white shadow-[2px_2px_0_0_#000] hover:shadow-[3px_3px_0_0_#000] [&_svg]:fill-white'
                }`}
              >
                <Facebook size={20} />
              </a>
            </div>
            <div className="w-full max-w-md">
              <Link
                to="/contact"
                className={`w-full flex items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                  isDarkMode
                    ? 'bg-green-600 border-green-400 text-white hover:bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]'
                    : 'bg-green-500 border-black text-white hover:bg-green-600 shadow-[2px_2px_0_0_#000] hover:shadow-[3px_3px_0_0_#000]'
                }`}
              >
                <Mail size={20} />
                <span className="ml-2 font-bold text-sm">Contact</span>
              </Link>
            </div>
          </div>
        </section>

        <footer className={`mt-20 pt-8 border-t-2 text-center text-sm font-bold font-mono ${
          isDarkMode ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-400'
        }`}>
          <p>© {new Date().getFullYear()} {data.profile.name}. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};

// --- Sub-components (Updated with Pop Design) ---

const SocialLink = ({ href, icon, label, isDarkMode, neonColor, lightBg }: any) => {
  const neonColors: any = {
    'cyan': { border: 'border-cyan-400', text: 'text-cyan-400', glow: 'shadow-[0_0_10px_rgba(34,211,238,0.3)]', hoverGlow: 'hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]' },
    'blue': { border: 'border-blue-400', text: 'text-blue-400', glow: 'shadow-[0_0_10px_rgba(96,165,250,0.3)]', hoverGlow: 'hover:shadow-[0_0_20px_rgba(96,165,250,0.5)]' },
    'pink': { border: 'border-pink-400', text: 'text-pink-400', glow: 'shadow-[0_0_10px_rgba(244,114,182,0.3)]', hoverGlow: 'hover:shadow-[0_0_20px_rgba(244,114,182,0.5)]' }
  };
  
  const neon = neonColors[neonColor] || neonColors['cyan'];
  
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`p-3 rounded-xl border-2 transition-all duration-200 hover:-translate-y-1 active:translate-y-0 active:shadow-none ${
        isDarkMode 
          ? `bg-transparent ${neon.border} ${neon.text} ${neon.glow} ${neon.hoverGlow}` 
          : `${lightBg} border-black text-white shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] [&_svg]:fill-white`
      }`}
      aria-label={label}
    >
      {icon}
    </a>
  );
};

const ExperienceItem = ({ experience, isDarkMode }: any) => {
  const { company, companyDescription, website, totalPeriod, roles, description, tags } = experience;
  
  // 常に濃い青を使用
  const accentColor = isDarkMode ? 'bg-blue-600' : 'bg-blue-500';
  const accentBorder = isDarkMode ? 'border-blue-600' : 'border-blue-500';

  // タグの色分けロジック
  const getTagStyle = (tag: string) => {
    // 企業のサイズタグ（統一した色で表示）
    const sizeTags = ['エンタープライズ', 'ジョイントベンチャー', 'ベンチャー', 'メガベンチャー'];
    const isSizeTag = sizeTags.includes(tag);
    
    if (isSizeTag) {
      // 企業のサイズタグは統一した色（紫系）
      return isDarkMode 
        ? 'bg-purple-900/30 border-purple-500 text-purple-300' 
        : 'bg-purple-100 border-purple-600 text-purple-800';
    } else {
      // 事業タグは統一した色（青系）
      return isDarkMode 
        ? 'bg-blue-900/30 border-blue-500 text-blue-300' 
        : 'bg-blue-100 border-blue-600 text-blue-800';
    }
  };

  return (
    <div className={`relative pl-12 group`}>
      {/* Timeline Dot (Enhanced) */}
      <div className={`absolute left-[1px] top-6 w-10 h-10 rounded-full border-4 z-10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
        isDarkMode 
          ? `bg-[#191919] ${accentBorder}` 
          : `bg-white border-black`
      }`} style={{
        boxShadow: isDarkMode 
          ? '0 0 12px rgba(37, 99, 235, 0.4), inset 0 0 6px rgba(37, 99, 235, 0.2)' 
          : '0 0 12px rgba(59, 130, 246, 0.3), inset 0 0 6px rgba(59, 130, 246, 0.1)'
      }}>
        <div className={`w-3 h-3 rounded-full ${accentColor}`} style={{
          boxShadow: isDarkMode 
            ? '0 0 8px rgba(37, 99, 235, 0.6)' 
            : '0 0 8px rgba(59, 130, 246, 0.4)'
        }}></div>
      </div>
      
      <div className={`p-6 rounded-2xl border-2 transition-all duration-300 group-hover:-translate-y-1 ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-600 group-hover:border-gray-400' 
          : 'bg-white border-black shadow-[4px_4px_0_0_#000] group-hover:shadow-[6px_6px_0_0_#000]'
      }`}>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {website ? (
            <a 
              href={website} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`text-2xl font-black transition-colors hover:text-blue-500 flex items-center gap-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}
            >
              <span className={`bg-gradient-to-t bg-no-repeat bg-bottom ${
                isDarkMode 
                  ? 'from-blue-500/30 to-blue-500/30 bg-[length:100%_40%]' 
                  : 'from-yellow-300/70 to-yellow-300/70 bg-[length:100%_40%]'
              }`}>
                {company}
              </span>
              <ExternalLink size={20} className="opacity-60" />
            </a>
          ) : (
            <h3 className={`text-2xl font-black bg-gradient-to-t bg-no-repeat bg-bottom ${
              isDarkMode 
                ? 'text-gray-100 from-blue-500/30 to-blue-500/30 bg-[length:100%_40%]' 
                : 'text-gray-900 from-yellow-300/70 to-yellow-300/70 bg-[length:100%_40%]'
            }`}>
              {company}
            </h3>
          )}
          <span className={`inline-block px-2 py-1 text-xs font-bold font-mono rounded border ${
            isDarkMode 
              ? 'bg-gray-700/50 border-gray-600 text-gray-200' 
              : 'bg-gray-50 border-gray-300 text-gray-700'
          }`}>
            {totalPeriod}
          </span>
        </div>
        {companyDescription && (
             <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
               {companyDescription}
             </p>
        )}
        
        <div className="space-y-4 mt-4 mb-4">
          {roles.map((role: any, idx: number) => (
            <div key={idx} className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <div className={`w-1 h-6 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'}`}></div>
                <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {role.title}
                </span>
              </div>
              <span className={`text-xs font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {role.period}
              </span>
            </div>
          ))}
        </div>

        {description && roles.length === 1 && roles[0].description !== description && (
           <p className={`mb-4 font-medium leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {description}
           </p>
        )}

        {tags && tags.length > 0 && (
          <>
            <div className={`border-t border-dashed mt-4 pt-4 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag: string, idx: number) => (
                <span 
                  key={idx} 
                  className={`px-2 py-1 text-xs font-medium rounded border ${getTagStyle(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const PhilosophyCard = ({ icon, title, content, isDarkMode, index }: any) => {
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-yellow-400', 'bg-green-500'];
  const darkColors = ['bg-red-900', 'bg-blue-900', 'bg-yellow-900', 'bg-green-900'];
  const headerColor = isDarkMode ? darkColors[index % 4] : colors[index % 4];
  const headerText = isDarkMode ? 'text-white' : (index % 4 === 2 ? 'text-black' : 'text-white'); // Yellow背景のみ黒文字

  return (
    <div className={`h-full flex flex-col rounded-2xl border-2 overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-600 hover:border-gray-400' 
        : 'bg-white border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000]'
    }`}>
      <div className={`p-4 border-b-2 min-h-[72px] flex items-center gap-3 ${isDarkMode ? 'border-gray-600' : 'border-black'} ${headerColor} ${headerText}`}>
        <div className={`p-1.5 rounded bg-white/20 backdrop-blur-sm flex-shrink-0`}>{icon}</div>
        <h3 className="text-lg font-black tracking-tight leading-tight">{title}</h3>
      </div>
      <div className="p-6 flex-1">
        <p className={`text-sm font-medium leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{content}</p>
      </div>
    </div>
  );
};

const SpeakingItem = ({ speak, isDarkMode }: { speak: Speaking, isDarkMode: boolean }) => (
  <div className={`group relative p-1 rounded-xl transition-all duration-200 hover:-translate-y-0.5 ${
      isDarkMode 
        ? 'hover:bg-gray-800' 
        : 'hover:bg-white'
    }`}>
    <div className={`absolute inset-0 rounded-xl border-2 pointer-events-none transition-colors ${
      isDarkMode 
        ? 'border-transparent group-hover:border-blue-500' 
        : 'border-transparent group-hover:border-black group-hover:shadow-[2px_2px_0_0_#000]'
    }`}></div>
    
    <div className="relative p-2 flex gap-3 items-center">
      {/* Left column: Date + Thumbnail */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-shrink-0">
        {/* Date */}
        <div className={`flex-shrink-0 w-28 flex items-center justify-start sm:justify-center`}>
          <span className={`text-xs font-bold font-mono px-2 py-1 rounded border ${
            isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-600'
          }`}>
            {speak.date}
          </span>
        </div>

        {/* Thumbnail */}
        {speak.imageUrl ? (
          <div className={`relative flex-shrink-0 w-28 rounded overflow-hidden ${isDarkMode ? 'ring-2 ring-gray-600' : 'ring-2 ring-black'}`} style={{ aspectRatio: '16/9' }}>
            <img src={speak.imageUrl} alt={speak.title} className="absolute inset-0 w-full h-full object-cover" />
          </div>
        ) : (
          <div
            className={`flex flex-shrink-0 w-28 rounded overflow-hidden relative items-center justify-center ${
              isDarkMode
                ? 'ring-2 ring-gray-600 bg-gradient-to-br from-gray-700 to-gray-800'
                : 'ring-2 ring-black bg-gradient-to-br from-gray-100 to-gray-200'
            }`}
            style={{ aspectRatio: '16/9' }}
            aria-hidden="true"
          >
            <div
              className={`absolute inset-0 ${
                isDarkMode
                  ? 'opacity-40 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[size:10px_10px]'
                  : 'opacity-40 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.08)_1px,transparent_0)] bg-[size:10px_10px]'
              }`}
            />
            <Mic2 size={14} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'} />
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
        {/* Event Name */}
        <div className={`text-xs font-bold leading-tight ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          {speak.event}
        </div>
        
        {/* Title */}
        <div className="mb-1">
          <a href={speak.mainLink} target="_blank" rel="noopener noreferrer" className={`text-sm font-bold leading-tight group-hover:text-blue-500 transition-colors ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            {speak.title}
          </a>
        </div>
        
        {/* Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {speak.relatedLinks && speak.relatedLinks.map((link, idx) => {
            let Icon = LinkIcon;
            if (link.type === 'slide') Icon = FileText;
            if (link.type === 'video') Icon = Video;
            
            return (
              <a 
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.label}
                className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded border-2 transition-all hover:-translate-y-0.5 ${
                  isDarkMode 
                    ? 'border-gray-600 text-gray-300 hover:border-blue-400 hover:text-blue-400 bg-gray-800' 
                    : 'border-black text-gray-700 hover:bg-yellow-100 bg-white'
                }`}
              >
                <Icon size={10} className="mr-1" />
                {link.label}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);

const InterviewItem = ({ interview, isDarkMode }: { interview: Interview, isDarkMode: boolean }) => (
  <a 
    href={interview.link}
    target="_blank"
    rel="noopener noreferrer"
    className={`group block p-3 rounded-xl border-2 border-transparent transition-all duration-200 hover:-translate-y-0.5 ${
      isDarkMode 
        ? 'hover:bg-gray-800 hover:border-gray-600' 
        : 'hover:bg-white hover:border-black hover:shadow-[2px_2px_0_0_#000]'
    }`}
  >
    <div className="flex gap-3">
      {/* Left column: Date + Thumbnail */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-shrink-0 max-w-[120px] sm:max-w-none">
        {/* Date */}
        <div className={`flex-shrink-0 w-full sm:w-28 flex items-center justify-start sm:justify-center`}>
          <span className={`text-xs font-bold font-mono px-2 py-1 rounded border ${
            isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-600'
          }`}>
            {interview.date}
          </span>
        </div>

        {/* Thumbnail */}
        {interview.imageUrl ? (
          <div className={`block flex-shrink-0 w-full sm:w-28 aspect-video rounded overflow-hidden ${isDarkMode ? 'ring-2 ring-gray-600' : 'ring-2 ring-black'}`}>
            <img src={interview.imageUrl} alt={interview.title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div
            className={`flex flex-shrink-0 w-full sm:w-28 aspect-video rounded overflow-hidden relative items-center justify-center ${
              isDarkMode
                ? 'ring-2 ring-gray-600 bg-gradient-to-br from-gray-700 to-gray-800'
                : 'ring-2 ring-black bg-gradient-to-br from-gray-100 to-gray-200'
            }`}
            aria-hidden="true"
          >
            <div
              className={`absolute inset-0 ${
                isDarkMode
                  ? 'opacity-40 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[size:10px_10px]'
                  : 'opacity-40 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.08)_1px,transparent_0)] bg-[size:10px_10px]'
              }`}
            />
            <MessageSquare size={14} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
        <div className={`text-xs font-bold leading-tight mb-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          {interview.media}
        </div>
        <h3 className={`text-sm font-bold leading-tight group-hover:text-blue-500 transition-colors ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          {interview.title}
        </h3>
      </div>
      
      <ExternalLink size={16} className={`flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${isDarkMode ? 'text-gray-500' : 'text-black'}`} />
    </div>
  </a>
);

const WritingItem = ({ title, source, date, link, imageUrl, isDarkMode }: any) => (
  <a 
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className={`group block p-3 rounded-xl border-2 border-transparent transition-all duration-200 hover:-translate-y-0.5 ${
      isDarkMode 
        ? 'hover:bg-gray-800 hover:border-gray-600' 
        : 'hover:bg-white hover:border-black hover:shadow-[2px_2px_0_0_#000]'
    }`}
  >
    <div className="flex gap-3">
      {/* Left column: Date + Thumbnail */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-shrink-0 max-w-[120px] sm:max-w-none">
        {/* Date */}
        <div className={`flex-shrink-0 w-full sm:w-28 flex items-center justify-start sm:justify-center`}>
          <span className={`text-xs font-bold font-mono px-2 py-1 rounded border ${
            isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-600'
          }`}>
            {date}
          </span>
        </div>

        {/* Thumbnail */}
        {imageUrl ? (
          <div className={`block flex-shrink-0 w-full sm:w-28 aspect-video rounded overflow-hidden ${isDarkMode ? 'ring-2 ring-gray-600' : 'ring-2 ring-black'}`}>
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div
            className={`flex flex-shrink-0 w-full sm:w-28 aspect-video rounded overflow-hidden relative items-center justify-center ${
              isDarkMode
                ? 'ring-2 ring-gray-600 bg-gradient-to-br from-gray-700 to-gray-800'
                : 'ring-2 ring-black bg-gradient-to-br from-gray-100 to-gray-200'
            }`}
            aria-hidden="true"
          >
            <div
              className={`absolute inset-0 ${
                isDarkMode
                  ? 'opacity-40 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[size:10px_10px]'
                  : 'opacity-40 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.08)_1px,transparent_0)] bg-[size:10px_10px]'
              }`}
            />
            <BookOpen size={14} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
        <div className={`text-xs font-bold leading-tight mb-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          {source}
        </div>
        <h3 className={`text-sm font-bold leading-tight group-hover:text-blue-500 transition-colors line-clamp-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          {title}
        </h3>
      </div>

      {/* Arrow Icon */}
      <ExternalLink size={16} className={`flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${isDarkMode ? 'text-gray-500' : 'text-black'}`} />
    </div>
  </a>
);

export default Portfolio;